'use client';

import { useTimer } from '@/hooks/useTimer';
import styles from './game.module.css';

interface TimerDisplayProps {
  endTime: Date | null;
  label?: string;
}

export default function TimerDisplay({ endTime, label }: TimerDisplayProps) {
  const timer = useTimer({ endTime });

  const getTimerClass = () => {
    if (timer.remainingSeconds <= 30) return styles.danger;
    if (timer.remainingSeconds <= 60) return styles.warning;
    return '';
  };

  if (!endTime) {
    return null;
  }

  return (
    <div className={styles.timerContainer}>
      <div className={`${styles.timerDisplay} ${getTimerClass()}`}>
        {timer.formatted}
      </div>
      {label && <div className={styles.timerLabel}>{label}</div>}
    </div>
  );
}
