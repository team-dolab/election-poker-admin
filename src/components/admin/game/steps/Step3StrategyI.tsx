'use client';

import { useState } from 'react';
import styles from '../../admin.module.css';

interface Step3StrategyIProps {
  timerFormatted: string;
  timerRemaining: number;
  onStartTimer: (minutes: number) => void;
  onStopTimer: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step3StrategyI({
  timerFormatted,
  timerRemaining,
  onStartTimer,
  onStopTimer,
  onNext,
  onPrev,
}: Step3StrategyIProps) {
  const [minutes, setMinutes] = useState(5);

  const handleStart = () => {
    onStartTimer(minutes);
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>전략회의 I</h2>
        <p className={styles.stepDescription}>
          첫 번째 전략 시간입니다 (기본 5분)
        </p>
      </div>

      <div className={styles.stepContent}>
        <div className={styles.timerSection}>
          <div className={styles.timerDisplay}>{timerFormatted}</div>

          <div className={styles.timerControls}>
            <div className={styles.minuteSelector}>
              {[3, 5, 7, 10].map((m) => (
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
