'use client';

import { GameState } from '@/types/database';
import { VIEW_MODE_INFO } from '@/types/game';
import styles from './game.module.css';

interface HeaderProps {
  gameState: GameState;
  isConnected: boolean;
}

export default function Header({ gameState, isConnected }: HeaderProps) {
  const { viewMode, round } = gameState;
  const modeInfo = VIEW_MODE_INFO[viewMode];

  return (
    <header className={styles.header}>
      <div className={styles.logo}>DO:LAB</div>

      <div className={styles.roundInfo}>
        {viewMode !== 'intro' && (
          <>
            <span className={styles.roundBadge}>ROUND {round}</span>
            <span className={styles.phaseBadge}>{modeInfo.label}</span>
          </>
        )}
      </div>

      <div className={styles.connectionStatus}>
        <span className={`${styles.connectionDot} ${isConnected ? styles.connected : styles.disconnected}`} />
        <span>{isConnected ? '연결됨' : '연결 중...'}</span>
      </div>
    </header>
  );
}
