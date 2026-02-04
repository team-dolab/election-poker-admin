'use client';

import { Player } from '@/types/database';
import styles from './game.module.css';

interface PlayerCircleProps {
  players: Player[];
  totalPlayers: number;
  firstPlayer: number | null;
  currentPlayer: number | null;
  showStatus?: boolean;
  showVotes?: boolean;
}

export default function PlayerCircle({
  players,
  totalPlayers,
  firstPlayer,
  currentPlayer,
  showStatus = false,
  showVotes = false,
}: PlayerCircleProps) {
  // 원형 배치 계산
  const getPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // 12시 방향부터 시작
    const radius = 280; // 원의 반지름
    const centerX = 350;
    const centerY = 350;

    return {
      left: centerX + radius * Math.cos(angle),
      top: centerY + radius * Math.sin(angle),
    };
  };

  // 플레이어 배열이 비어있으면 기본 생성
  const displayPlayers = players.length > 0
    ? players
    : Array.from({ length: totalPlayers }, (_, i) => ({
        id: i + 1,
        status: null as 'run' | 'giveup' | null,
        cards: [],
        vote: null,
      }));

  return (
    <div className={styles.playerCircle}>
      {displayPlayers.map((player, index) => {
        const pos = getPosition(index, totalPlayers);
        const isFirst = player.id === firstPlayer;
        const isCurrent = player.id === currentPlayer;

        return (
          <div
            key={player.id}
            className={styles.playerSlot}
            style={{ left: pos.left, top: pos.top }}
          >
            <div
              className={`${styles.playerNumber} ${isFirst ? styles.firstPlayer : ''} ${isCurrent ? styles.currentPlayer : ''}`}
            >
              {player.id}
            </div>

            {showStatus && player.status && (
              <span
                className={`${styles.playerStatus} ${
                  player.status === 'run' ? styles.statusRun : styles.statusGiveup
                }`}
              >
                {player.status === 'run' ? '출마' : '포기'}
              </span>
            )}

            {showVotes && player.vote !== null && (
              <div className={styles.voteArrow}>
                → {player.vote}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
