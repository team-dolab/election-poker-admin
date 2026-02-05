'use client';

import styles from '../../admin.module.css';

interface Step4CandidacyStartProps {
  onSetCandidacyMode: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step4CandidacyStart({
  onSetCandidacyMode,
  onNext,
  onPrev,
}: Step4CandidacyStartProps) {
  const handleStart = () => {
    onSetCandidacyMode();
    onNext();
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>출마선언 시작</h2>
        <p className={styles.stepDescription}>
          플레이어들의 출마/포기 선언을 시작합니다
        </p>
      </div>

      <div className={styles.stepContent}>
        <div className={styles.infoBox}>
          <p>출마/포기 선언 모드로 전환됩니다.</p>
          <p>각 플레이어가 순서대로 출마 또는 포기를 선언합니다.</p>
        </div>
      </div>

      <div className={styles.stepActions}>
        <button className={styles.secondaryButton} onClick={onPrev}>
          이전
        </button>
        <button className={styles.primaryButton} onClick={handleStart}>
          출마선언 시작
        </button>
      </div>
    </div>
  );
}
