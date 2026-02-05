'use client';

import { GameState } from '@/types/database';
import styles from './game.module.css';

interface HeaderProps {
  gameState: GameState;
  isConnected: boolean;
}

export default function Header({ gameState, isConnected }: HeaderProps) {
  const { round } = gameState;

  return (
    <header className={styles.header}>
      {/* 브랜드 박스 */}
      <div className={styles.brandBox}>
        <span className={styles.brandLogo}>DO:LAB</span>
        <div className={styles.connectionStatus}>
          <span className={`${styles.connectionDot} ${isConnected ? styles.connected : styles.disconnected}`} />
        </div>
      </div>

      {/* 타이틀 프레임 (skewX) */}
      <div className={styles.titleFrame}>
        <div className={styles.titleFrameInner}>
          <span className={styles.titleText}>ELECTION POKER</span>
        </div>
      </div>

      {/* 라운드 박스 */}
      <div className={styles.roundBox}>
        <span className={styles.roundLabel}>ROUND</span>
        <span className={styles.roundNumber}>{round}</span>
      </div>
    </header>
  );
}
