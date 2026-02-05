'use client';

import { GameStep, GAME_STEPS } from '@/types/adminState';
import styles from '../admin.module.css';

interface GameHeaderProps {
  currentStep: GameStep;
  round: number;
  isConnected: boolean;
  onExitGame: () => void;
}

export default function GameHeader({
  currentStep,
  round,
  isConnected,
  onExitGame,
}: GameHeaderProps) {
  const currentStepInfo = GAME_STEPS.find((s) => s.step === currentStep);
  const currentStepIndex = GAME_STEPS.findIndex((s) => s.step === currentStep);

  return (
    <header className={styles.gameHeader}>
      <div className={styles.gameHeaderLeft}>
        <button className={styles.backButton} onClick={onExitGame}>
          ← 대시보드
        </button>
        <div className={styles.gameHeaderInfo}>
          <span className={styles.roundBadge}>Round {round}</span>
          <span className={styles.stepBadge}>
            Step {currentStepIndex + 1}: {currentStepInfo?.label}
          </span>
        </div>
      </div>

      <div className={styles.gameHeaderCenter}>
        <div className={styles.stepProgress}>
          {GAME_STEPS.map((step, index) => (
            <div
              key={step.step}
              className={`${styles.stepDot} ${
                index <= currentStepIndex ? styles.active : ''
              } ${index === currentStepIndex ? styles.current : ''}`}
              title={step.label}
            />
          ))}
        </div>
      </div>

      <div className={styles.gameHeaderRight}>
        <div className={styles.connectionStatus}>
          <span
            className={`${styles.connectionDot} ${
              isConnected ? styles.connected : styles.disconnected
            }`}
          />
        </div>
      </div>
    </header>
  );
}
