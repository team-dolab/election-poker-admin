'use client';

import styles from '../../admin.module.css';

interface Step9VoteStartProps {
  onSetVoteMode: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step9VoteStart({
  onSetVoteMode,
  onNext,
  onPrev,
}: Step9VoteStartProps) {
  const handleStart = () => {
    onSetVoteMode();
    onNext();
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>투표 시작</h2>
        <p className={styles.stepDescription}>
          투표를 시작합니다
        </p>
      </div>

      <div className={styles.stepContent}>
        <div className={styles.infoBox}>
          <p>투표 모드로 전환됩니다.</p>
          <p>각 플레이어가 지지하는 후보에게 투표합니다.</p>
        </div>
      </div>

      <div className={styles.stepActions}>
        <button className={styles.secondaryButton} onClick={onPrev}>
          이전
        </button>
        <button className={styles.primaryButton} onClick={handleStart}>
          투표 시작
        </button>
      </div>
    </div>
  );
}
