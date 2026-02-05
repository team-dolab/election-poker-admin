'use client';

import { useState } from 'react';
import styles from '../../admin.module.css';

interface Step1RoundStartProps {
  currentRound: number;
  totalPlayers: number;
  onStartRound: (round: number, firstPlayer: number) => void;
  onNext: () => void;
}

export default function Step1RoundStart({
  currentRound,
  totalPlayers,
  onStartRound,
  onNext,
}: Step1RoundStartProps) {
  const [round, setRound] = useState(currentRound);
  const [firstPlayer, setFirstPlayer] = useState(1);

  const handleStart = () => {
    onStartRound(round, firstPlayer);
    onNext();
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>라운드 시작</h2>
        <p className={styles.stepDescription}>
          라운드 번호와 선 플레이어를 설정합니다
        </p>
      </div>

      <div className={styles.stepContent}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>라운드 번호</label>
            <input
              type="number"
              className={styles.formInput}
              value={round}
              onChange={(e) => setRound(parseInt(e.target.value) || 1)}
              min={1}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>선 플레이어</label>
            <div className={styles.playerChipSelector}>
              {Array.from({ length: totalPlayers }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`${styles.playerChip} ${
                    firstPlayer === num ? styles.active : ''
                  }`}
                  onClick={() => setFirstPlayer(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.stepActions}>
        <button className={styles.primaryButton} onClick={handleStart}>
          라운드 {round} 시작
        </button>
      </div>
    </div>
  );
}
