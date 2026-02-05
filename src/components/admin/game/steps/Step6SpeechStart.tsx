'use client';

import styles from '../../admin.module.css';

interface Step6SpeechStartProps {
  onNext: () => void;
  onPrev: () => void;
}

export default function Step6SpeechStart({
  onNext,
  onPrev,
}: Step6SpeechStartProps) {
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>연설 시작</h2>
        <p className={styles.stepDescription}>
          후보자들의 연설을 시작합니다
        </p>
      </div>

      <div className={styles.stepContent}>
        <div className={styles.infoBox}>
          <p>각 후보자가 3장의 공약 카드를 선택하여 공개합니다.</p>
          <p>다음 단계에서 카드를 선택하세요.</p>
        </div>
      </div>

      <div className={styles.stepActions}>
        <button className={styles.secondaryButton} onClick={onPrev}>
          이전
        </button>
        <button className={styles.primaryButton} onClick={onNext}>
          연설 진행
        </button>
      </div>
    </div>
  );
}
