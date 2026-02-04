-- ============================================
-- DO:LAB Game State Tables
-- 두 게임을 같은 Supabase 프로젝트에서 관리
-- ============================================

-- ============================================
-- 공통: updated_at 트리거 함수
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================
-- 1. Election Poker Game State Table
-- ============================================

-- 기존 테이블 삭제 (필요시)
-- DROP TABLE IF EXISTS election_poker_game_state;

CREATE TABLE IF NOT EXISTS election_poker_game_state (
  id TEXT PRIMARY KEY DEFAULT 'main',

  -- 게임 진행 상태
  view_mode TEXT NOT NULL DEFAULT 'intro',
  round INTEGER NOT NULL DEFAULT 1,
  total_players INTEGER NOT NULL DEFAULT 8,
  first_player INTEGER,
  current_player INTEGER,

  -- 플레이어 데이터 (JSONB)
  players JSONB NOT NULL DEFAULT '[]',

  -- 연설 카드
  speech_cards JSONB NOT NULL DEFAULT '[]',

  -- 타이머
  timer_end TIMESTAMPTZ,
  timer_minutes INTEGER NOT NULL DEFAULT 5,

  -- 결과
  round_winner INTEGER,
  rankings JSONB NOT NULL DEFAULT '[]',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- view_mode 제약조건
  CONSTRAINT election_poker_view_mode_check CHECK (
    view_mode = ANY (ARRAY[
      'intro', 'roundStart', 'dealing', 'strategyI',
      'candidacy', 'speech', 'strategyII', 'vote', 'roundEnd'
    ])
  )
);

-- updated_at 트리거
DROP TRIGGER IF EXISTS update_election_poker_game_state_updated_at ON election_poker_game_state;
CREATE TRIGGER update_election_poker_game_state_updated_at
  BEFORE UPDATE ON election_poker_game_state
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE election_poker_game_state ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
DROP POLICY IF EXISTS "election_poker_allow_public_read" ON election_poker_game_state;
CREATE POLICY "election_poker_allow_public_read" ON election_poker_game_state
  FOR SELECT USING (true);

-- 공개 쓰기 정책
DROP POLICY IF EXISTS "election_poker_allow_public_write" ON election_poker_game_state;
CREATE POLICY "election_poker_allow_public_write" ON election_poker_game_state
  FOR ALL USING (true);

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE election_poker_game_state;

-- 초기 데이터 삽입
INSERT INTO election_poker_game_state (id, view_mode, round, total_players, players, timer_minutes)
VALUES ('main', 'intro', 1, 8, '[]', 5)
ON CONFLICT (id) DO NOTHING;


-- ============================================
-- 2. Trinity Force Game State Table
-- ============================================

-- 기존 테이블 삭제 (필요시)
-- DROP TABLE IF EXISTS trinity_force_game_state;

CREATE TABLE IF NOT EXISTS trinity_force_game_state (
  id TEXT PRIMARY KEY DEFAULT 'main',

  -- 게임 진행 상태
  view_mode TEXT NOT NULL DEFAULT 'intro',
  round INTEGER NOT NULL DEFAULT 1,

  -- 자원
  merchant INTEGER NOT NULL DEFAULT 5,
  alchemist INTEGER NOT NULL DEFAULT 4,
  thief INTEGER NOT NULL DEFAULT 3,

  -- 유물
  relic_a INTEGER NOT NULL DEFAULT 0,
  relic_b INTEGER NOT NULL DEFAULT 0,
  relic_c INTEGER NOT NULL DEFAULT 0,

  -- 랭킹
  rankings JSONB NOT NULL DEFAULT '[]',

  -- 메인 타이머
  timer_minutes INTEGER NOT NULL DEFAULT 20,
  timer_state TEXT NOT NULL DEFAULT 'stopped',
  timer_end_time TIMESTAMPTZ,

  -- 턴 타이머
  turn_player TEXT NOT NULL DEFAULT '',
  turn_timer_end TIMESTAMPTZ,

  -- 대기 타이머
  waiting_player TEXT NOT NULL DEFAULT '',
  waiting_timer_end TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- view_mode 제약조건
  CONSTRAINT trinity_force_view_mode_check CHECK (
    view_mode = ANY (ARRAY['intro', 'waiting', 'turn', 'round', 'end', 'final'])
  ),

  -- timer_state 제약조건
  CONSTRAINT trinity_force_timer_state_check CHECK (
    timer_state = ANY (ARRAY['running', 'stopped'])
  )
);

-- updated_at 트리거
DROP TRIGGER IF EXISTS update_trinity_force_game_state_updated_at ON trinity_force_game_state;
CREATE TRIGGER update_trinity_force_game_state_updated_at
  BEFORE UPDATE ON trinity_force_game_state
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE trinity_force_game_state ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
DROP POLICY IF EXISTS "trinity_force_allow_public_read" ON trinity_force_game_state;
CREATE POLICY "trinity_force_allow_public_read" ON trinity_force_game_state
  FOR SELECT USING (true);

-- 공개 쓰기 정책
DROP POLICY IF EXISTS "trinity_force_allow_public_write" ON trinity_force_game_state;
CREATE POLICY "trinity_force_allow_public_write" ON trinity_force_game_state
  FOR ALL USING (true);

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE trinity_force_game_state;

-- 초기 데이터 삽입
INSERT INTO trinity_force_game_state (
  id, view_mode, round, merchant, alchemist, thief,
  relic_a, relic_b, relic_c, rankings, timer_minutes, timer_state
)
VALUES (
  'main', 'intro', 1, 5, 4, 3,
  0, 0, 0, '[]', 20, 'stopped'
)
ON CONFLICT (id) DO NOTHING;


-- ============================================
-- 마이그레이션 참고 (기존 game_state → trinity_force_game_state)
-- ============================================
-- 기존 game_state 테이블의 데이터를 마이그레이션하려면:
--
-- INSERT INTO trinity_force_game_state
-- SELECT * FROM game_state
-- ON CONFLICT (id) DO NOTHING;
--
-- 마이그레이션 후 기존 테이블 삭제:
-- DROP TABLE IF EXISTS game_state;
