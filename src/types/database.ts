/**
 * Election Poker - Database Types
 */

export type ViewMode =
  | 'intro'
  | 'roundStart'
  | 'dealing'
  | 'strategyI'
  | 'candidacy'
  | 'speech'
  | 'strategyII'
  | 'vote'
  | 'roundEnd';

export interface Player {
  id: number;
  status: 'run' | 'giveup' | null;
  cards: string[];
  vote: number | null;
}

// 게임 상태 테이블 Row 타입 (snake_case - DB)
export interface GameStateRow {
  id: string;
  view_mode: ViewMode;
  round: number;
  total_players: number;
  first_player: number | null;
  current_player: number | null;
  players: Player[];
  speech_cards: string[];
  timer_end: string | null;
  timer_minutes: number;
  round_winner: number | null;
  rankings: number[];
  updated_at: string;
}

// Insert/Update용 타입
export interface GameStateInsert {
  id: string;
  view_mode?: ViewMode;
  round?: number;
  total_players?: number;
  first_player?: number | null;
  current_player?: number | null;
  players?: Player[];
  speech_cards?: string[];
  timer_end?: string | null;
  timer_minutes?: number;
  round_winner?: number | null;
  rankings?: number[];
}

export interface GameStateUpdate {
  view_mode?: ViewMode;
  round?: number;
  total_players?: number;
  first_player?: number | null;
  current_player?: number | null;
  players?: Player[];
  speech_cards?: string[];
  timer_end?: string | null;
  timer_minutes?: number;
  round_winner?: number | null;
  rankings?: number[];
}

// Supabase Database 타입
export interface Database {
  public: {
    Tables: {
      election_poker_game_state: {
        Row: GameStateRow;
        Insert: GameStateInsert;
        Update: GameStateUpdate;
      };
    };
  };
}

// 프론트엔드용 GameState 타입 (camelCase)
export interface GameState {
  id: string;
  viewMode: ViewMode;
  round: number;
  totalPlayers: number;
  firstPlayer: number | null;
  currentPlayer: number | null;
  players: Player[];
  speechCards: string[];
  timerEnd: Date | null;
  timerMinutes: number;
  roundWinner: number | null;
  rankings: number[];
}

// 기본 게임 상태
export const DEFAULT_GAME_STATE: GameState = {
  id: 'main',
  viewMode: 'intro',
  round: 1,
  totalPlayers: 8,
  firstPlayer: null,
  currentPlayer: null,
  players: [],
  speechCards: [],
  timerEnd: null,
  timerMinutes: 5,
  roundWinner: null,
  rankings: [],
};

// 초기 플레이어 생성
export function createInitialPlayers(count: number): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    status: null,
    cards: [],
    vote: null,
  }));
}

// DB Row → GameState 변환
export function rowToGameState(row: GameStateRow): GameState {
  return {
    id: row.id,
    viewMode: row.view_mode,
    round: row.round,
    totalPlayers: row.total_players,
    firstPlayer: row.first_player,
    currentPlayer: row.current_player,
    players: row.players || [],
    speechCards: row.speech_cards || [],
    timerEnd: row.timer_end ? new Date(row.timer_end) : null,
    timerMinutes: row.timer_minutes,
    roundWinner: row.round_winner,
    rankings: row.rankings || [],
  };
}

// GameState → DB Update 변환
export function gameStateToUpdate(state: Partial<GameState>): GameStateUpdate {
  const update: GameStateUpdate = {};

  if (state.viewMode !== undefined) update.view_mode = state.viewMode;
  if (state.round !== undefined) update.round = state.round;
  if (state.totalPlayers !== undefined) update.total_players = state.totalPlayers;
  if (state.firstPlayer !== undefined) update.first_player = state.firstPlayer;
  if (state.currentPlayer !== undefined) update.current_player = state.currentPlayer;
  if (state.players !== undefined) update.players = state.players;
  if (state.speechCards !== undefined) update.speech_cards = state.speechCards;
  if (state.timerEnd !== undefined) {
    update.timer_end = state.timerEnd?.toISOString() || null;
  }
  if (state.timerMinutes !== undefined) update.timer_minutes = state.timerMinutes;
  if (state.roundWinner !== undefined) update.round_winner = state.roundWinner;
  if (state.rankings !== undefined) update.rankings = state.rankings;

  return update;
}

// ============================================
// Game Results Types (doneon 연동용)
// ============================================

export interface PlayerResult {
  player_number: number;
  rank: number;
}

export interface GameResultRow {
  id: string;
  game_name: string;
  game_type: string;
  results: PlayerResult[];
  total_players: number;
  created_at: string;
  updated_at: string;
}

export interface GameResultInsert {
  game_name: string;
  game_type?: string;
  results: PlayerResult[];
  total_players: number;
}

export interface GameResultUpdate {
  game_name?: string;
  game_type?: string;
  results?: PlayerResult[];
  total_players?: number;
}
