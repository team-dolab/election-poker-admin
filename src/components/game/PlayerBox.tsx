'use client';

import { Player } from '@/types/database';
import styles from './game.module.css';

interface PlayerBoxProps {
  player: Player;
  position: { left: string; top: string };
  isFirst: boolean;
  isCurrent: boolean;
  showStatus?: boolean;
  showVotes?: boolean;
}

export default function PlayerBox({
  player,
  position,
  isFirst,
  isCurrent,
  showStatus = false,
  showVotes = false,
}: PlayerBoxProps) {
  return (
    <div
      className={`${styles.playerBox} ${isFirst ? styles.firstPlayer : ''} ${isCurrent ? styles.currentPlayer : ''}`}
      style={{ left: position.left, top: position.top }}
    >
      <div className={styles.playerBoxInner}>
        <div className={styles.playerBoxNumber}>{player.id}</div>
        {isFirst && <div className={styles.firstBadge}>선</div>}

        {showStatus && player.status && (
          <div
            className={`${styles.playerBoxStatus} ${
              player.status === 'run' ? styles.statusRun : styles.statusGiveup
            }`}
          >
            {player.status === 'run' ? '출마' : '포기'}
          </div>
        )}

        {showVotes && player.vote !== null && (
          <div className={styles.playerBoxVote}>
            → {player.vote}
          </div>
        )}
      </div>
    </div>
  );
}
