'use client';

import styles from '../admin.module.css';

interface DashboardHeaderProps {
  isConnected: boolean;
}

export default function DashboardHeader({ isConnected }: DashboardHeaderProps) {
  return (
    <header className={styles.dashboardHeader}>
      <div className={styles.dashboardHeaderLeft}>
        <h1 className={styles.dashboardTitle}>대선 포커</h1>
        <span className={styles.dashboardSubtitle}>Admin Dashboard</span>
      </div>
      <div className={styles.dashboardHeaderRight}>
        <div className={styles.connectionStatus}>
          <span
            className={`${styles.connectionDot} ${
              isConnected ? styles.connected : styles.disconnected
            }`}
          />
          <span className={styles.connectionText}>
            {isConnected ? '연결됨' : '연결 중...'}
          </span>
        </div>
      </div>
    </header>
  );
}
