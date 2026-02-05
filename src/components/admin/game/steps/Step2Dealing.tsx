'use client';

import styles from '../../admin.module.css';

interface Step2DealingProps {
  onSetDealing: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2Dealing({
  onSetDealing,
  onNext,
  onPrev,
}: Step2DealingProps) {
  const handleStart = () => {
    onSetDealing();
  };

  const handleComplete = () => {
    onNext();
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>카드 배분</h2>
        <p className={styles.stepDescription}>
          플레이어들에게 카드를 배분합니다
        </p>
      </div>

      <div className={styles.stepContent}>
        <div className={styles.infoBox}>
          <p>카드 배분 화면이 디스플레이에 표시됩니다.</p>
          <p>실제 카드 배분이 완료되면 다음 단계로 진행하세요.</p>
        </div>
      </div>

      <div className={styles.stepActions}>
        <button className={styles.secondaryButton} onClick={onPrev}>
          이전
        </button>
        <button className={styles.primaryButton} onClick={handleStart}>
          카드 배분 화면 표시
        </button>
        <button className={styles.successButton} onClick={handleComplete}>
          배분 완료 → 다음
        </button>
      </div>
    </div>
  );
}
