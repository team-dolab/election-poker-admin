'use client';

import { useState } from 'react';
import styles from '../../admin.module.css';

interface Step8StrategyIIProps {
  timerFormatted: string;
  timerRemaining: number;
  onStartTimer: (minutes: number) => void;
  onStopTimer: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step8StrategyII({
  timerFormatted,
  timerRemaining,
  onStartTimer,
  onStopTimer,
  onNext,
  onPrev,
}: Step8StrategyIIProps) {
  const [minutes, setMinutes] = useState(3);

  const handleStart = () => {
    onStartTimer(minutes);
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>전략회의 II</h2>
        <p className={styles.stepDescription}>
          두 번째 전략 시간입니다 (기본 3분)
        </p>
      </div>

      <div className={styles.stepContent}>
        <div className={styles.timerSection}>
          <div className={styles.timerDisplay}>{timerFormatted}</div>

          <div className={styles.timerControls}>
            <div className={styles.minuteSelector}>
              {[2, 3, 5].map((m) => (
                <button
                  key={m}
                  className={`${styles.minuteChip} ${minutes === m ? styles.active : ''}`}
                  onClick={() => setMinutes(m)}
                >
                  {m}분
                </button>
              ))}
            </div>

            <div className={styles.timerButtons}>
              <button className={styles.primaryButton} onClick={handleStart}>
                타이머 시작
              </button>
              <button className={styles.dangerButton} onClick={onStopTimer}>
                정지
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.stepActions}>
        <button className={styles.secondaryButton} onClick={onPrev}>
          이전
        </button>
        <button className={styles.successButton} onClick={onNext}>
          전략회의 종료 → 다음
        </button>
      </div>
    </div>
  );
}
