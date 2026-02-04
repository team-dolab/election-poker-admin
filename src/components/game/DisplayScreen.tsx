'use client';

import { useSupabaseGameState } from '@/hooks/useSupabaseGameState';
import Header from './Header';
import MainStage from './MainStage';
import styles from './game.module.css';

export default function DisplayScreen() {
  const { gameState, isLoading, isConnected } = useSupabaseGameState({
    readOnly: true,
  });

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <div>연결 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header gameState={gameState} isConnected={isConnected} />
      <main className={styles.main}>
        <MainStage gameState={gameState} />
      </main>
    </div>
  );
}
