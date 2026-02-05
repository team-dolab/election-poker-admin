/**
 * Election Poker - Game Types
 */

// 카드 정의
export const CARD_SUITS = ['♠', '♥', '♦', '♣'] as const;
export const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

export type CardSuit = typeof CARD_SUITS[number];
export type CardValue = typeof CARD_VALUES[number];

// 카드 덱 (전체)
export const CARD_DECK = {
  spades: ['♠A', '♠2', '♠3', '♠4', '♠5', '♠6', '♠7', '♠8', '♠9', '♠10', '♠J', '♠Q', '♠K'],
  hearts: ['♥A', '♥2', '♥3', '♥4', '♥5', '♥6', '♥7', '♥8', '♥9', '♥10', '♥J', '♥Q', '♥K'],
  diamonds: ['♦A', '♦2', '♦3', '♦4', '♦5', '♦6', '♦7', '♦8', '♦9', '♦10', '♦J', '♦Q', '♦K'],
  clubs: ['♣A', '♣2', '♣3', '♣4', '♣5', '♣6', '♣7', '♣8', '♣9', '♣10', '♣J', '♣Q', '♣K'],
} as const;

// 포커 핸드 랭킹
export const HAND_RANKINGS = [
  { rank: 1, name: 'Royal Flush', korean: '로열 플러시' },
  { rank: 2, name: 'Straight Flush', korean: '스트레이트 플러시' },
  { rank: 3, name: 'Four of a Kind', korean: '포카드' },
  { rank: 4, name: 'Full House', korean: '풀하우스' },
  { rank: 5, name: 'Flush', korean: '플러시' },
  { rank: 6, name: 'Straight', korean: '스트레이트' },
  { rank: 7, name: 'Three of a Kind', korean: '트리플' },
  { rank: 8, name: 'Two Pair', korean: '투 페어' },
  { rank: 9, name: 'One Pair', korean: '원 페어' },
  { rank: 10, name: 'High Card', korean: '하이 카드' },
] as const;

// 뷰 모드별 정보
export const VIEW_MODE_INFO = {
  intro: { label: 'DO:LAB', description: 'DO:LAB 로고' },
  roundStart: { label: '라운드 시작', description: 'N 라운드 표시' },
  dealing: { label: '카드 배분', description: '카드 배분 중' },
  strategyI: { label: '전략 시간 I', description: '5분 타이머' },
  candidacy: { label: '출마/포기', description: '출마/포기 선언' },
  speech: { label: '연설', description: '카드 3장 공개' },
  strategyII: { label: '전략 시간 II', description: '3분 타이머' },
  vote: { label: '투표', description: '투표 현황' },
  roundEnd: { label: '라운드 종료', description: '당선자 발표' },
} as const;

// 타이머 기본값 (분)
export const DEFAULT_TIMERS = {
  strategyI: 5,
  strategyII: 3,
} as const;
