'use client';

import { Player } from '@/types/database';
import styles from '../../admin.module.css';

interface Step5CandidacyProcessProps {
  players: Player[];
  currentPlayer: number | null;
  onSetPlayerStatus: (playerId: number, status: 'run' | 'giveup') => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step5CandidacyProcess({
  players,
  currentPlayer,
  onSetPlayerStatus,
  onNext,
  onPrev,
}: Step5CandidacyProcessProps) {
  const currentPlayerData = players.find((p) => p.id === currentPlayer);
  const allDecided = players.every((p) => p.status !== null);

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>출마 / 포기</h2>
        <p className={styles.stepDescription}>
          각 플레이어의 출마/포기를 선택하세요
        </p>
      </div>

      <div className={styles.stepContent}>
        {/* 현재 플레이어 대형 버튼 */}
        {currentPlayer && (
          <div className={styles.currentPlayerSection}>
            <div className={styles.currentPlayerLabel}>
              Player {currentPlayer}
            </div>
            <div className={styles.largeButtonGroup}>
              <button
                className={`${styles.largeButton} ${styles.runButton}`}
                onClick={() => onSetPlayerStatus(currentPlayer, 'run')}
              >
                출마
              </button>
              <button
                className={`${styles.largeButton} ${styles.giveupButton}`}
                onClick={() => onSetPlayerStatus(currentPlayer, 'giveup')}
              >
                포기
              </button>
            </div>
          </div>
        )}

        {/* 플레이어 상태 그리드 */}
        <div className={styles.playerStatusGrid}>
          {players.map((player) => (
            <div
              key={player.id}
              className={`${styles.playerStatusCard} ${
                player.id === currentPlayer ? styles.current : ''
              }`}
            >
              <div className={styles.playerStatusNumber}>{player.id}</div>
              <div
                className={`${styles.playerStatusBadge} ${
                  player.status === 'run'
                    ? styles.run
                    : player.status === 'giveup'
                    ? styles.giveup
                    : styles.pending
                }`}
              >
                {player.status === 'run'
                  ? '출마'
                  : player.status === 'giveup'
                  ? '포기'
                  : '-'}
              </div>
              <div className={styles.playerStatusActions}>
                <button
                  className={styles.smallRunButton}
                  onClick={() => onSetPlayerStatus(player.id, 'run')}
                >
                  출
                </button>
                <button
                  className={styles.smallGiveupButton}
                  onClick={() => onSetPlayerStatus(player.id, 'giveup')}
                >
                  포
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.stepActions}>
        <button className={styles.secondaryButton} onClick={onPrev}>
          이전
        </button>
        <button
          className={styles.successButton}
          onClick={onNext}
          disabled={!allDecided}
        >
          출마선언 완료 → 다음
        </button>
      </div>
    </div>
  );
}
