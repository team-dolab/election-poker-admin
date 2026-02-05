'use client';

import { Player } from '@/types/database';
import styles from '../../admin.module.css';

interface Step10VoteProcessProps {
  players: Player[];
  onSetPlayerVote: (playerId: number, candidateId: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step10VoteProcess({
  players,
  onSetPlayerVote,
  onNext,
  onPrev,
}: Step10VoteProcessProps) {
  const candidates = players.filter((p) => p.status === 'run');
  const allVoted = players.every((p) => p.vote !== null);

  // 득표수 계산
  const voteCount = candidates.reduce((acc, candidate) => {
    acc[candidate.id] = players.filter((p) => p.vote === candidate.id).length;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>투표 진행</h2>
        <p className={styles.stepDescription}>
          각 플레이어의 투표를 기록하세요
        </p>
      </div>

      <div className={styles.stepContent}>
        {/* 득표 현황 */}
        <div className={styles.voteResultSection}>
          <h3 className={styles.sectionTitle}>득표 현황</h3>
          <div className={styles.voteResultGrid}>
            {candidates.map((candidate) => (
              <div key={candidate.id} className={styles.voteResultCard}>
                <div className={styles.voteResultNumber}>{candidate.id}번</div>
                <div className={styles.voteResultCount}>
                  {voteCount[candidate.id] || 0}표
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 투표 기록 */}
        <div className={styles.voteRecordSection}>
          <h3 className={styles.sectionTitle}>투표 기록</h3>
          <div className={styles.voteRecordGrid}>
            {players.map((player) => (
              <div key={player.id} className={styles.voteRecordCard}>
                <div className={styles.voteRecordPlayer}>
                  Player {player.id}
                </div>
                <div className={styles.voteRecordSelect}>
                  <select
                    className={styles.voteSelect}
                    value={player.vote || ''}
                    onChange={(e) =>
                      onSetPlayerVote(player.id, parseInt(e.target.value))
                    }
                  >
                    <option value="">-</option>
                    {candidates.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id}번
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.stepActions}>
        <button className={styles.secondaryButton} onClick={onPrev}>
          이전
        </button>
        <button className={styles.successButton} onClick={onNext}>
          투표 종료 → 결과 발표
        </button>
      </div>
    </div>
  );
}
