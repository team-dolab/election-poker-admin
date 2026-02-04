'use client';

import { useState, useEffect } from 'react';
import { supabase, GAME_RESULTS_TABLE } from '@/lib/supabase';
import { GameResultRow, GameResultInsert, PlayerResult } from '@/types/database';
import styles from './results.module.css';

export default function ResultsScreen() {
  const [gameName, setGameName] = useState('');
  const [totalPlayers, setTotalPlayers] = useState(8);
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [existingResult, setExistingResult] = useState<GameResultRow | null>(null);

  // 플레이어 수 변경 시 results 초기화
  useEffect(() => {
    const initialResults: PlayerResult[] = Array.from({ length: totalPlayers }, (_, i) => ({
      player_number: i + 1,
      rank: 0,
    }));
    setResults(initialResults);
  }, [totalPlayers]);

  // 게임 이름으로 기존 결과 조회
  const handleLoadResult = async () => {
    if (!gameName.trim()) {
      setMessage({ type: 'error', text: '게임 이름을 입력해주세요.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase
        .from(GAME_RESULTS_TABLE)
        .select('*')
        .eq('game_name', gameName.trim())
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setExistingResult(data as GameResultRow);
        setTotalPlayers(data.total_players);
        setResults(data.results as PlayerResult[]);
        setMessage({ type: 'success', text: '기존 결과를 불러왔습니다.' });
      } else {
        setExistingResult(null);
        setMessage({ type: 'success', text: '새 게임입니다. 결과를 입력해주세요.' });
      }
    } catch (err) {
      console.error('Failed to load result:', err);
      setMessage({ type: 'error', text: '결과 조회 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  // 플레이어 순위 변경
  const handleRankChange = (playerNumber: number, rank: number) => {
    setResults((prev) =>
      prev.map((r) => (r.player_number === playerNumber ? { ...r, rank } : r))
    );
  };

  // 순위 유효성 검사
  const validateResults = (): string | null => {
    const ranks = results.map((r) => r.rank).filter((r) => r > 0);

    // 모든 플레이어에 순위가 지정되었는지 확인
    if (ranks.length !== totalPlayers) {
      return '모든 플레이어의 순위를 입력해주세요.';
    }

    // 중복 순위 확인
    const uniqueRanks = new Set(ranks);
    if (uniqueRanks.size !== ranks.length) {
      return '중복된 순위가 있습니다. 각 플레이어는 고유한 순위를 가져야 합니다.';
    }

    // 순위 범위 확인
    for (const rank of ranks) {
      if (rank < 1 || rank > totalPlayers) {
        return `순위는 1부터 ${totalPlayers}까지여야 합니다.`;
      }
    }

    return null;
  };

  // 결과 저장
  const handleSave = async () => {
    if (!gameName.trim()) {
      setMessage({ type: 'error', text: '게임 이름을 입력해주세요.' });
      return;
    }

    const validationError = validateResults();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const gameResultData: GameResultInsert = {
        game_name: gameName.trim(),
        game_type: 'election_poker',
        results: results,
        total_players: totalPlayers,
      };

      if (existingResult) {
        // 기존 결과 업데이트
        const { error } = await supabase
          .from(GAME_RESULTS_TABLE)
          .update({
            results: results,
            total_players: totalPlayers,
          })
          .eq('id', existingResult.id);

        if (error) throw error;
        setMessage({ type: 'success', text: '결과가 수정되었습니다.' });
      } else {
        // 새 결과 생성
        const { data, error } = await supabase
          .from(GAME_RESULTS_TABLE)
          .insert(gameResultData)
          .select()
          .single();

        if (error) throw error;
        setExistingResult(data as GameResultRow);
        setMessage({ type: 'success', text: '결과가 저장되었습니다.' });
      }
    } catch (err) {
      console.error('Failed to save result:', err);
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  // 초기화
  const handleReset = () => {
    setGameName('');
    setTotalPlayers(8);
    setResults(
      Array.from({ length: 8 }, (_, i) => ({
        player_number: i + 1,
        rank: 0,
      }))
    );
    setExistingResult(null);
    setMessage(null);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>게임 결과 입력</h1>
        <a href="/admin" className={styles.backLink}>
          Admin으로 돌아가기
        </a>
      </header>

      <div className={styles.content}>
        {/* 게임 정보 입력 */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>게임 정보</h2>
            {existingResult && <span className={styles.badge}>수정 모드</span>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>게임 이름</label>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  className={styles.input}
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="20260204_1500_electionpoker"
                />
                <button
                  className={`${styles.button} ${styles.buttonSecondary}`}
                  onClick={handleLoadResult}
                  disabled={isLoading}
                >
                  {isLoading ? '조회 중...' : '조회'}
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>플레이어 수</label>
              <select
                className={styles.select}
                value={totalPlayers}
                onChange={(e) => setTotalPlayers(parseInt(e.target.value))}
              >
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                  <option key={n} value={n}>
                    {n}명
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 순위 입력 */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>플레이어별 순위</h2>
          </div>

          <div className={styles.rankGrid}>
            {results.map((result) => (
              <div key={result.player_number} className={styles.rankItem}>
                <div className={styles.playerNumber}>P{result.player_number}</div>
                <select
                  className={styles.rankSelect}
                  value={result.rank}
                  onChange={(e) =>
                    handleRankChange(result.player_number, parseInt(e.target.value))
                  }
                >
                  <option value={0}>-</option>
                  {Array.from({ length: totalPlayers }, (_, i) => i + 1).map((rank) => (
                    <option key={rank} value={rank}>
                      {rank}등
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* 메시지 */}
        {message && (
          <div
            className={`${styles.message} ${
              message.type === 'success' ? styles.messageSuccess : styles.messageError
            }`}
          >
            {message.text}
          </div>
        )}

        {/* 액션 버튼 */}
        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonLarge}`}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : existingResult ? '결과 수정' : '결과 저장'}
          </button>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={handleReset}
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
