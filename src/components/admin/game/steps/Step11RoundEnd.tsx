'use client';

import { useState } from 'react';
import { Player } from '@/types/database';
import styles from '../../admin.module.css';

interface Step11RoundEndProps {
  players: Player[];
  round: number;
  rankings: number[];
  onEndRound: (winnerId: number) => void;
  onNextRound: () => void;
  onResetGame: () => void;
}

export default function Step11RoundEnd({
  players,
  round,
  rankings,
  onEndRound,
  onNextRound,
  onResetGame,
}: Step11RoundEndProps) {
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const candidates = players.filter((p) => p.status === 'run');

  // 득표수 계산
  const voteCount = candidates.reduce((acc, candidate) => {
    acc[candidate.id] = players.filter((p) => p.vote === candidate.id).length;
    return acc;
  }, {} as Record<number, number>);

  // 최다 득표자 찾기
  const maxVotes = Math.max(...Object.values(voteCount));
  const topCandidates = candidates.filter((c) => voteCount[c.id] === maxVotes);

  const handleAnnounce = () => {
    if (winnerId) {
      onEndRound(winnerId);
    }
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>라운드 {round} 종료</h2>
        <p className={styles.stepDescription}>
          당선자를 발표합니다
        </p>
      </div>

      <div className={styles.stepContent}>
        {/* 투표 결과 */}
        <div className={styles.voteResultSection}>
          <h3 className={styles.sectionTitle}>투표 결과</h3>
          <div className={styles.voteResultGrid}>
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`${styles.voteResultCard} ${
                  voteCount[candidate.id] === maxVotes ? styles.winner : ''
                }`}
              >
                <div className={styles.voteResultNumber}>{candidate.id}번</div>
                <div className={styles.voteResultCount}>
                  {voteCount[candidate.id] || 0}표
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 당선자 선택 */}
        <div className={styles.winnerSelectSection}>
          <h3 className={styles.sectionTitle}>당선자 선택</h3>
          {topCandidates.length > 1 && (
            <p className={styles.warningText}>
              동점자가 있습니다. 카드 대결 후 당선자를 선택하세요.
            </p>
          )}
          <div className={styles.winnerSelectGrid}>
            {candidates.map((candidate) => (
              <button
                key={candidate.id}
                className={`${styles.winnerSelectButton} ${
                  winnerId === candidate.id ? styles.selected : ''
                }`}
                onClick={() => setWinnerId(candidate.id)}
              >
                {candidate.id}번
                <span className={styles.winnerVotes}>
                  ({voteCount[candidate.id] || 0}표)
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 역대 당선자 */}
        {rankings.length > 0 && (
          <div className={styles.rankingsSection}>
            <h3 className={styles.sectionTitle}>역대 당선자</h3>
            <div className={styles.rankingsList}>
              {rankings.map((playerId, index) => (
                <div key={index} className={styles.rankingsItem}>
                  <span className={styles.rankingsRound}>R{index + 1}</span>
                  <span className={styles.rankingsPlayer}>{playerId}번</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.stepActions}>
        <button
          className={styles.primaryButton}
          onClick={handleAnnounce}
          disabled={!winnerId}
        >
          당선자 발표
        </button>
        <button className={styles.successButton} onClick={onNextRound}>
          다음 라운드
        </button>
        <button className={styles.dangerButton} onClick={onResetGame}>
          게임 리셋
        </button>
      </div>
    </div>
  );
}
