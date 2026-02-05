'use client';

import { GameState } from '@/types/database';
import { VIEW_MODE_INFO, HAND_RANKINGS } from '@/types/game';
import TimerDisplay from './TimerDisplay';
import styles from './game.module.css';

interface InfoSectionProps {
  gameState: GameState;
}

export default function InfoSection({ gameState }: InfoSectionProps) {
  const { viewMode, timerEnd } = gameState;
  const modeInfo = VIEW_MODE_INFO[viewMode];

  const showTimer = viewMode === 'strategyI' || viewMode === 'strategyII';
  const showHandRankings = viewMode !== 'intro' && viewMode !== 'roundStart' && viewMode !== 'roundEnd';

  return (
    <div className={styles.infoSection}>
      {/* Phase Info */}
      <div className={styles.phaseBox}>
        <div className={styles.phaseLabel}>PHASE</div>
        <div className={styles.phaseValue}>{modeInfo.label}</div>
      </div>

      {/* Timer */}
      {showTimer && (
        <div className={styles.timerBox}>
          <TimerDisplay endTime={timerEnd} />
        </div>
      )}

      {/* Hand Rankings */}
      {showHandRankings && (
        <div className={styles.handRankingBox}>
          <div className={styles.handRankingTitle}>HAND RANKING</div>
          <div className={styles.handRankingList}>
            {HAND_RANKINGS.slice(0, 5).map((hand) => (
              <div key={hand.rank} className={styles.handRankingItem}>
                <span className={styles.handRankingNumber}>{hand.rank}</span>
                <span className={styles.handRankingName}>{hand.korean}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
