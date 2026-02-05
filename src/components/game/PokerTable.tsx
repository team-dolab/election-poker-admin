'use client';

import { Player } from '@/types/database';
import PlayerBox from './PlayerBox';
import styles from './game.module.css';

interface PokerTableProps {
  players: Player[];
  totalPlayers: number;
  firstPlayer: number | null;
  currentPlayer: number | null;
  showStatus?: boolean;
  showVotes?: boolean;
}

// 12개 플레이어 고정 위치 (타원형 배치 - 박스가 잘리지 않도록 여유 확보)
const PLAYER_POSITIONS: { left: string; top: string }[] = [
  { left: '50%', top: '8%' },      // 1 - 상단 중앙
  { left: '73%', top: '10%' },     // 2 - 상단 우측
  { left: '88%', top: '22%' },     // 3 - 우측 상단
  { left: '93%', top: '42%' },     // 4 - 우측 중상
  { left: '93%', top: '58%' },     // 5 - 우측 중하
  { left: '88%', top: '78%' },     // 6 - 우측 하단
  { left: '73%', top: '90%' },     // 7 - 하단 우측
  { left: '50%', top: '92%' },     // 8 - 하단 중앙
  { left: '27%', top: '90%' },     // 9 - 하단 좌측
  { left: '12%', top: '78%' },     // 10 - 좌측 하단
  { left: '7%', top: '58%' },      // 11 - 좌측 중하
  { left: '7%', top: '42%' },      // 12 - 좌측 중상
];

export default function PokerTable({
  players,
  totalPlayers,
  firstPlayer,
  currentPlayer,
  showStatus = false,
  showVotes = false,
}: PokerTableProps) {
  // 플레이어 배열이 비어있으면 기본 생성
  const displayPlayers = players.length > 0
    ? players
    : Array.from({ length: totalPlayers }, (_, i) => ({
        id: i + 1,
        status: null as 'run' | 'giveup' | null,
        cards: [],
        vote: null,
      }));

  // 사용할 위치들 (플레이어 수에 따라 균등하게 배치)
  const getPositionIndex = (playerIndex: number, total: number): number => {
    if (total === 12) return playerIndex;
    const step = 12 / total;
    return Math.round(playerIndex * step) % 12;
  };

  return (
    <div className={styles.pokerTableContainer}>
      {/* 타원형 테이블 */}
      <div className={styles.pokerTable}>
        <div className={styles.pokerTableInner}>
          <div className={styles.pokerTableLogo}>DO:LAB</div>
          <div className={styles.pokerTableSubtitle}>ELECTION POKER</div>
        </div>
      </div>

      {/* 플레이어들 */}
      {displayPlayers.map((player, index) => {
        const posIndex = getPositionIndex(index, totalPlayers);
        const position = PLAYER_POSITIONS[posIndex];
        const isFirst = player.id === firstPlayer;
        const isCurrent = player.id === currentPlayer;

        return (
          <PlayerBox
            key={player.id}
            player={player}
            position={position}
            isFirst={isFirst}
            isCurrent={isCurrent}
            showStatus={showStatus}
            showVotes={showVotes}
          />
        );
      })}
    </div>
  );
}
