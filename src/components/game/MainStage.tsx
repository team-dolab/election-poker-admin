'use client';

import { GameState } from '@/types/database';
import PlayerCircle from './PlayerCircle';
import TimerDisplay from './TimerDisplay';
import styles from './game.module.css';

interface MainStageProps {
  gameState: GameState;
}

export default function MainStage({ gameState }: MainStageProps) {
  const {
    viewMode,
    round,
    players,
    totalPlayers,
    firstPlayer,
    currentPlayer,
    speechCards,
    timerEnd,
    roundWinner,
    rankings,
  } = gameState;

  // Intro 화면
  if (viewMode === 'intro') {
    return (
      <div className={styles.introScreen}>
        <div className={styles.introLogo}>DO:LAB</div>
        <div className={styles.introSubtitle}>대선 포커</div>
      </div>
    );
  }

  // Round Start 화면
  if (viewMode === 'roundStart') {
    return (
      <div className={styles.roundStartScreen}>
        <div className={styles.roundNumber}>{round}</div>
        <div className={styles.roundLabel}>ROUND</div>
      </div>
    );
  }

  // Dealing 화면
  if (viewMode === 'dealing') {
    return (
      <div>
        <PlayerCircle
          players={players}
          totalPlayers={totalPlayers}
          firstPlayer={firstPlayer}
          currentPlayer={currentPlayer}
        />
        <TimerDisplay endTime={null} />
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: '1.5rem', color: 'rgba(255,255,255,0.7)' }}>
          카드 배분 중...
        </div>
      </div>
    );
  }

  // Strategy I 화면 (5분 타이머)
  if (viewMode === 'strategyI') {
    return (
      <div style={{ position: 'relative' }}>
        <PlayerCircle
          players={players}
          totalPlayers={totalPlayers}
          firstPlayer={firstPlayer}
          currentPlayer={currentPlayer}
        />
        <TimerDisplay endTime={timerEnd} label="전략 시간 I" />
      </div>
    );
  }

  // Candidacy 화면 (출마/포기)
  if (viewMode === 'candidacy') {
    return (
      <div>
        <PlayerCircle
          players={players}
          totalPlayers={totalPlayers}
          firstPlayer={firstPlayer}
          currentPlayer={currentPlayer}
          showStatus={true}
        />
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: '1.5rem', color: '#e94560' }}>
          출마 / 포기 선언
        </div>
      </div>
    );
  }

  // Speech 화면 (카드 공개)
  if (viewMode === 'speech') {
    const isRed = (suit: string) => suit === '♥' || suit === '♦';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <div className={styles.speechCards}>
          {speechCards.map((card, index) => {
            const suit = card.charAt(0);
            return (
              <div
                key={index}
                className={`${styles.card} ${isRed(suit) ? styles.cardRed : styles.cardBlack}`}
              >
                {card}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.7)' }}>
          공약 카드
        </div>
      </div>
    );
  }

  // Strategy II 화면 (3분 타이머)
  if (viewMode === 'strategyII') {
    return (
      <div style={{ position: 'relative' }}>
        <PlayerCircle
          players={players}
          totalPlayers={totalPlayers}
          firstPlayer={firstPlayer}
          currentPlayer={currentPlayer}
          showStatus={true}
        />
        <TimerDisplay endTime={timerEnd} label="전략 시간 II" />
      </div>
    );
  }

  // Vote 화면
  if (viewMode === 'vote') {
    return (
      <div className={styles.voteContainer}>
        <div className={styles.voteTitle}>투표 진행 중</div>
        <PlayerCircle
          players={players}
          totalPlayers={totalPlayers}
          firstPlayer={firstPlayer}
          currentPlayer={currentPlayer}
          showStatus={true}
          showVotes={true}
        />
      </div>
    );
  }

  // Round End 화면
  if (viewMode === 'roundEnd') {
    return (
      <div className={styles.roundEndScreen}>
        <div className={styles.winnerAnnouncement}>ROUND {round} 당선자</div>
        <div className={styles.winnerNumber}>{roundWinner}</div>
        <div className={styles.winnerLabel}>당선!</div>

        {rankings.length > 0 && (
          <div className={styles.rankingsContainer}>
            {rankings.map((playerId, index) => (
              <div key={playerId} className={styles.rankingItem}>
                <span
                  className={`${styles.rankingPosition} ${
                    index === 0 ? styles.gold : index === 1 ? styles.silver : index === 2 ? styles.bronze : ''
                  }`}
                >
                  {index + 1}위
                </span>
                <div className={styles.rankingPlayer}>{playerId}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 기본 화면
  return (
    <div>
      <PlayerCircle
        players={players}
        totalPlayers={totalPlayers}
        firstPlayer={firstPlayer}
        currentPlayer={currentPlayer}
      />
    </div>
  );
}
