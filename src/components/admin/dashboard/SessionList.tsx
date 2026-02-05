'use client';

import styles from '../admin.module.css';

interface Session {
  id: string;
  createdAt: string;
  totalPlayers: number;
  currentRound: number;
  status: 'active' | 'completed';
}

interface SessionListProps {
  sessions: Session[];
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export default function SessionList({
  sessions,
  onSelectSession,
  onDeleteSession,
}: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className={styles.sessionListEmpty}>
        <p>진행 중인 세션이 없습니다</p>
      </div>
    );
  }

  return (
    <div className={styles.sessionList}>
      <h3 className={styles.sessionListTitle}>진행 중인 세션</h3>
      <div className={styles.sessionItems}>
        {sessions.map((session) => (
          <div key={session.id} className={styles.sessionItem}>
            <div className={styles.sessionItemInfo}>
              <span className={styles.sessionItemRound}>
                Round {session.currentRound}
              </span>
              <span className={styles.sessionItemPlayers}>
                {session.totalPlayers}명
              </span>
              <span
                className={`${styles.sessionItemStatus} ${
                  session.status === 'active' ? styles.statusActive : styles.statusCompleted
                }`}
              >
                {session.status === 'active' ? '진행중' : '완료'}
              </span>
            </div>
            <div className={styles.sessionItemActions}>
              <button
                className={styles.sessionItemButton}
                onClick={() => onSelectSession(session.id)}
              >
                이어하기
              </button>
              <button
                className={`${styles.sessionItemButton} ${styles.danger}`}
                onClick={() => onDeleteSession(session.id)}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
