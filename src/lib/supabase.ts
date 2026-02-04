/**
 * Supabase Client Configuration
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경 변수 체크 (빌드 시에는 경고만 출력)
const isConfigured = supabaseUrl && supabaseAnonKey;

if (!isConfigured && typeof window !== 'undefined') {
  console.warn(
    'Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
  );
}

// Supabase 클라이언트 생성 (플레이스홀더 URL로 초기화하여 빌드 오류 방지)
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

// 설정 여부 확인
export const isSupabaseConfigured = isConfigured;

// 테이블 이름 상수
export const GAME_STATE_TABLE = 'election_poker_game_state';
export const GAME_STATE_ID = 'main'; // 단일 레코드 ID
export const GAME_RESULTS_TABLE = 'game_results'; // doneon 연동용
