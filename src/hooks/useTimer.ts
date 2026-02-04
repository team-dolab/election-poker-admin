/**
 * Timer Hook - 타이머 계산
 */
'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseTimerOptions {
  /** 타이머 종료 시간 */
  endTime: Date | null;
  /** 틱 간격 (ms) */
  tickInterval?: number;
  /** 종료 시 콜백 */
  onExpire?: () => void;
}

interface TimerState {
  /** 남은 시간 (초) */
  remainingSeconds: number;
  /** 남은 분 */
  minutes: number;
  /** 남은 초 (분을 제외한) */
  seconds: number;
  /** 만료 여부 */
  isExpired: boolean;
  /** 활성 여부 */
  isActive: boolean;
  /** 포맷된 문자열 (MM:SS) */
  formatted: string;
}

export function useTimer(options: UseTimerOptions): TimerState {
  const { endTime, tickInterval = 1000, onExpire } = options;

  const calculateRemaining = useCallback((): number => {
    if (!endTime) return 0;
    const diff = endTime.getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  }, [endTime]);

  const [remainingSeconds, setRemainingSeconds] = useState(calculateRemaining);

  useEffect(() => {
    if (!endTime) {
      setRemainingSeconds(0);
      return;
    }

    // 초기 계산
    setRemainingSeconds(calculateRemaining());

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, tickInterval);

    return () => clearInterval(interval);
  }, [endTime, tickInterval, calculateRemaining, onExpire]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isExpired = endTime !== null && remainingSeconds <= 0;
  const isActive = endTime !== null && remainingSeconds > 0;

  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return {
    remainingSeconds,
    minutes,
    seconds,
    isExpired,
    isActive,
    formatted,
  };
}
