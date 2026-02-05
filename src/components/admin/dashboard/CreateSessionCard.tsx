'use client';

import { useState } from 'react';
import styles from '../admin.module.css';

interface CreateSessionCardProps {
  onCreateSession: (totalPlayers: number) => void;
}

export default function CreateSessionCard({ onCreateSession }: CreateSessionCardProps) {
  const [totalPlayers, setTotalPlayers] = useState(8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSession(totalPlayers);
  };

  return (
    <div className={styles.createSessionCard}>
      <div className={styles.cardIcon}>🎮</div>
      <h2 className={styles.createSessionTitle}>새 게임 세션</h2>
      <p className={styles.createSessionDesc}>
        새로운 대선 포커 게임 세션을 시작합니다
      </p>

      <form onSubmit={handleSubmit} className={styles.createSessionForm}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>참가 인원</label>
          <div className={styles.playerCountSelector}>
            {[6, 8, 10, 12].map((num) => (
              <button
                key={num}
                type="button"
                className={`${styles.playerCountChip} ${
                  totalPlayers === num ? styles.active : ''
                }`}
                onClick={() => setTotalPlayers(num)}
              >
                {num}명
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className={styles.createSessionButton}>
          게임 시작
        </button>
      </form>
    </div>
  );
}
