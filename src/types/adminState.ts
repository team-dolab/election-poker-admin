/**
 * Admin State Types
 */

export type AdminMode = 'dashboard' | 'game';

export type GameStep =
  | 'step1_roundStart'
  | 'step2_dealing'
  | 'step3_strategyI'
  | 'step4_candidacyStart'
  | 'step5_candidacyProcess'
  | 'step6_speechStart'
  | 'step7_speechProcess'
  | 'step8_strategyII'
  | 'step9_voteStart'
  | 'step10_voteProcess'
  | 'step11_roundEnd';

export const GAME_STEPS: { step: GameStep; label: string; description: string }[] = [
  { step: 'step1_roundStart', label: '라운드 시작', description: '라운드 번호와 선 플레이어 설정' },
  { step: 'step2_dealing', label: '카드 배분', description: '카드 배분 화면 표시' },
  { step: 'step3_strategyI', label: '전략회의 I', description: '5분 타이머 시작' },
  { step: 'step4_candidacyStart', label: '출마선언 시작', description: '출마/포기 선언 안내' },
  { step: 'step5_candidacyProcess', label: '출마/포기', description: '각 플레이어 출마/포기 선택' },
  { step: 'step6_speechStart', label: '연설 시작', description: '연설 안내' },
  { step: 'step7_speechProcess', label: '연설 진행', description: '카드 선택 및 공개' },
  { step: 'step8_strategyII', label: '전략회의 II', description: '3분 타이머 시작' },
  { step: 'step9_voteStart', label: '투표 시작', description: '투표 안내' },
  { step: 'step10_voteProcess', label: '투표 진행', description: '투표 기록' },
  { step: 'step11_roundEnd', label: '라운드 종료', description: '당선자 발표' },
];

export interface AdminState {
  mode: AdminMode;
  currentStep: GameStep;
  sessionId: string | null;
}
