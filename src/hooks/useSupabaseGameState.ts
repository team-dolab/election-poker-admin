/**
 * Supabase Game State Hook - 실시간 동기화
 *
 * 시청자/관리자 모두 사용 가능
 * - 시청자: 읽기 전용 (실시간 구독)
 * - 관리자: 읽기 + 쓰기
 */
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, GAME_STATE_TABLE, GAME_STATE_ID } from '@/lib/supabase';
import {
  GameState,
  GameStateRow,
  GameStateInsert,
  DEFAULT_GAME_STATE,
  rowToGameState,
  gameStateToUpdate,
  ViewMode,
  Player,
  createInitialPlayers,
} from '@/types/database';

interface UseSupabaseGameStateOptions {
  /** 읽기 전용 모드 (시청자용) */
  readOnly?: boolean;
}

export function useSupabaseGameState(options: UseSupabaseGameStateOptions = {}) {
  const { readOnly = false } = options;

  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const channelRef = useRef<RealtimeChannel | null>(null);

  // 초기 데이터 생성
  const initializeGameState = useCallback(async () => {
    const initialPlayers = createInitialPlayers(8);
    const initialData: GameStateInsert = {
      id: GAME_STATE_ID,
      view_mode: 'intro',
      round: 1,
      total_players: 8,
      first_player: null,
      current_player: null,
      players: initialPlayers,
      speech_cards: [],
      timer_end: null,
      timer_minutes: 5,
      round_winner: null,
      rankings: [],
    };

    const { data, error: insertError } = await supabase
      .from(GAME_STATE_TABLE)
      .insert(initialData as unknown as Record<string, unknown>)
      .select()
      .single();

    if (insertError) {
      console.error('Failed to initialize game state:', insertError);
      return;
    }

    if (data) {
      setGameState(rowToGameState(data as GameStateRow));
    }
  }, []);

  // 초기 데이터 로드
  const fetchGameState = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from(GAME_STATE_TABLE)
        .select('*')
        .eq('id', GAME_STATE_ID)
        .single();

      if (fetchError) {
        // 데이터가 없으면 초기 데이터 생성 (관리자 모드에서만)
        if (fetchError.code === 'PGRST116' && !readOnly) {
          await initializeGameState();
          return;
        }
        throw fetchError;
      }

      if (data) {
        setGameState(rowToGameState(data as GameStateRow));
      }
    } catch (err) {
      console.error('Failed to fetch game state:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [readOnly, initializeGameState]);

  // 실시간 구독 설정
  useEffect(() => {
    fetchGameState();

    // Realtime 채널 구독
    const channel = supabase
      .channel('election_poker_game_state_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: GAME_STATE_TABLE,
          filter: `id=eq.${GAME_STATE_ID}`,
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          if (payload.new && typeof payload.new === 'object') {
            setGameState(rowToGameState(payload.new as GameStateRow));
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;

    // Cleanup
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [fetchGameState]);

  // 게임 상태 업데이트 (관리자 전용)
  const updateGameState = useCallback(
    async (updates: Partial<GameState>) => {
      if (readOnly) {
        console.warn('Cannot update in read-only mode');
        return;
      }

      try {
        const dbUpdates = gameStateToUpdate(updates);

        const { error: updateError } = await supabase
          .from(GAME_STATE_TABLE)
          .update(dbUpdates as unknown as Record<string, unknown>)
          .eq('id', GAME_STATE_ID);

        if (updateError) {
          throw updateError;
        }

        // 로컬 상태도 즉시 업데이트 (낙관적 업데이트)
        setGameState((prev) => ({ ...prev, ...updates }));
      } catch (err) {
        console.error('Failed to update game state:', err);
        setError(err instanceof Error ? err.message : 'Failed to update');
      }
    },
    [readOnly]
  );

  // === 관리자 액션 함수들 ===

  // 뷰 모드 변경
  const setViewMode = useCallback(
    (mode: ViewMode) => {
      updateGameState({ viewMode: mode });
    },
    [updateGameState]
  );

  // 인트로 모드 설정
  const setIntroMode = useCallback(() => {
    updateGameState({ viewMode: 'intro' });
  }, [updateGameState]);

  // 라운드 시작 설정
  const startRound = useCallback(
    (round: number, firstPlayer: number) => {
      const players = createInitialPlayers(gameState.totalPlayers);
      updateGameState({
        viewMode: 'roundStart',
        round,
        firstPlayer,
        currentPlayer: firstPlayer,
        players,
        speechCards: [],
        roundWinner: null,
      });
    },
    [updateGameState, gameState.totalPlayers]
  );

  // 카드 배분 모드
  const setDealingMode = useCallback(() => {
    updateGameState({ viewMode: 'dealing' });
  }, [updateGameState]);

  // 전략 시간 I 시작 (5분)
  const startStrategyI = useCallback(
    (minutes: number = 5) => {
      const endTime = new Date(Date.now() + minutes * 60 * 1000);
      updateGameState({
        viewMode: 'strategyI',
        timerEnd: endTime,
        timerMinutes: minutes,
      });
    },
    [updateGameState]
  );

  // 출마/포기 모드
  const setCandidacyMode = useCallback(() => {
    updateGameState({ viewMode: 'candidacy', timerEnd: null });
  }, [updateGameState]);

  // 플레이어 출마/포기 설정
  const setPlayerStatus = useCallback(
    (playerId: number, status: 'run' | 'giveup') => {
      const updatedPlayers = gameState.players.map((p) =>
        p.id === playerId ? { ...p, status } : p
      );
      updateGameState({ players: updatedPlayers });
    },
    [updateGameState, gameState.players]
  );

  // 연설 모드 시작
  const startSpeech = useCallback(
    (cards: string[]) => {
      updateGameState({
        viewMode: 'speech',
        speechCards: cards,
      });
    },
    [updateGameState]
  );

  // 전략 시간 II 시작 (3분)
  const startStrategyII = useCallback(
    (minutes: number = 3) => {
      const endTime = new Date(Date.now() + minutes * 60 * 1000);
      updateGameState({
        viewMode: 'strategyII',
        timerEnd: endTime,
        timerMinutes: minutes,
      });
    },
    [updateGameState]
  );

  // 투표 모드
  const setVoteMode = useCallback(() => {
    updateGameState({ viewMode: 'vote', timerEnd: null });
  }, [updateGameState]);

  // 투표 기록
  const setPlayerVote = useCallback(
    (playerId: number, votedFor: number) => {
      const updatedPlayers = gameState.players.map((p) =>
        p.id === playerId ? { ...p, vote: votedFor } : p
      );
      updateGameState({ players: updatedPlayers });
    },
    [updateGameState, gameState.players]
  );

  // 라운드 종료
  const endRound = useCallback(
    (winnerId: number) => {
      const newRankings = [...gameState.rankings, winnerId];
      updateGameState({
        viewMode: 'roundEnd',
        roundWinner: winnerId,
        rankings: newRankings,
      });
    },
    [updateGameState, gameState.rankings]
  );

  // 타이머 정지
  const stopTimer = useCallback(() => {
    updateGameState({ timerEnd: null });
  }, [updateGameState]);

  // 타이머 리셋
  const resetTimer = useCallback(
    (minutes: number) => {
      updateGameState({ timerEnd: null, timerMinutes: minutes });
    },
    [updateGameState]
  );

  // 총 플레이어 수 변경
  const setTotalPlayers = useCallback(
    (count: number) => {
      const players = createInitialPlayers(count);
      updateGameState({ totalPlayers: count, players });
    },
    [updateGameState]
  );

  // 플레이어 카드 설정
  const setPlayerCards = useCallback(
    (playerId: number, cards: string[]) => {
      const updatedPlayers = gameState.players.map((p) =>
        p.id === playerId ? { ...p, cards } : p
      );
      updateGameState({ players: updatedPlayers });
    },
    [updateGameState, gameState.players]
  );

  // 게임 리셋
  const resetGame = useCallback(() => {
    const players = createInitialPlayers(gameState.totalPlayers);
    updateGameState({
      viewMode: 'intro',
      round: 1,
      firstPlayer: null,
      currentPlayer: null,
      players,
      speechCards: [],
      timerEnd: null,
      timerMinutes: 5,
      roundWinner: null,
      rankings: [],
    });
  }, [updateGameState, gameState.totalPlayers]);

  return {
    // 상태
    gameState,
    isLoading,
    error,
    isConnected,

    // 읽기 전용 여부
    readOnly,

    // 액션 (관리자 전용)
    updateGameState,
    setViewMode,
    setIntroMode,
    startRound,
    setDealingMode,
    startStrategyI,
    setCandidacyMode,
    setPlayerStatus,
    startSpeech,
    startStrategyII,
    setVoteMode,
    setPlayerVote,
    endRound,
    stopTimer,
    resetTimer,
    setTotalPlayers,
    setPlayerCards,
    resetGame,
  };
}
