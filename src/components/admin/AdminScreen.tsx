'use client';

import { useState } from 'react';
import { useSupabaseGameState } from '@/hooks/useSupabaseGameState';
import { useTimer } from '@/hooks/useTimer';
import { ViewMode } from '@/types/database';
import { VIEW_MODE_INFO } from '@/types/game';
import styles from './admin.module.css';

const VIEW_MODES: ViewMode[] = [
  'intro',
  'roundStart',
  'dealing',
  'strategyI',
  'candidacy',
  'speech',
  'strategyII',
  'vote',
  'roundEnd',
];

export default function AdminScreen() {
  const {
    gameState,
    isLoading,
    isConnected,
    setViewMode,
    startRound,
    startStrategyI,
    setCandidacyMode,
    setPlayerStatus,
    startSpeech,
    startStrategyII,
    setVoteMode,
    setPlayerVote,
    endRound,
    stopTimer,
    setTotalPlayers,
    resetGame,
  } = useSupabaseGameState({ readOnly: false });

  const timer = useTimer({ endTime: gameState.timerEnd });

  // Local form states
  const [roundInput, setRoundInput] = useState('1');
  const [firstPlayerInput, setFirstPlayerInput] = useState('1');
  const [timerMinutes, setTimerMinutes] = useState('5');
  const [speechCardInput, setSpeechCardInput] = useState('');
  const [winnerInput, setWinnerInput] = useState('1');
  const [totalPlayersInput, setTotalPlayersInput] = useState('8');

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <div>연결 중...</div>
        </div>
      </div>
    );
  }

  const handleStartRound = () => {
    startRound(parseInt(roundInput), parseInt(firstPlayerInput));
  };

  const handleStartStrategyI = () => {
    startStrategyI(parseInt(timerMinutes));
  };

  const handleStartStrategyII = () => {
    startStrategyII(parseInt(timerMinutes));
  };

  const handleStartSpeech = () => {
    const cards = speechCardInput
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c);
    startSpeech(cards);
  };

  const handleEndRound = () => {
    endRound(parseInt(winnerInput));
  };

  const handleSetTotalPlayers = () => {
    setTotalPlayers(parseInt(totalPlayersInput));
  };

  const isRed = (card: string) => {
    return card.includes('♥') || card.includes('♦');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>대선 포커 Admin</h1>
        <div className={styles.connectionStatus}>
          <span
            className={`${styles.connectionDot} ${
              isConnected ? styles.connected : styles.disconnected
            }`}
          />
          <span>{isConnected ? '연결됨' : '연결 중...'}</span>
        </div>
      </header>

      <div className={styles.grid}>
        {/* View Mode Control */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>화면 모드</h2>
            <span className={styles.badge}>{VIEW_MODE_INFO[gameState.viewMode].label}</span>
          </div>
          <div className={styles.viewModeGrid}>
            {VIEW_MODES.map((mode) => (
              <button
                key={mode}
                className={`${styles.viewModeButton} ${
                  gameState.viewMode === mode ? styles.active : ''
                }`}
                onClick={() => setViewMode(mode)}
              >
                {VIEW_MODE_INFO[mode].label}
              </button>
            ))}
          </div>
        </div>

        {/* Round Control */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>라운드 설정</h2>
            <span className={styles.badge}>Round {gameState.round}</span>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>라운드 번호</label>
            <input
              type="number"
              className={styles.input}
              value={roundInput}
              onChange={(e) => setRoundInput(e.target.value)}
              min="1"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>선 플레이어</label>
            <input
              type="number"
              className={styles.input}
              value={firstPlayerInput}
              onChange={(e) => setFirstPlayerInput(e.target.value)}
              min="1"
              max={gameState.totalPlayers}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={handleStartRound}>
              라운드 시작
            </button>
          </div>
        </div>

        {/* Timer Control */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>타이머</h2>
          </div>
          <div className={styles.timerSection}>
            <div className={styles.timerDisplay}>{timer.formatted}</div>
            <input
              type="number"
              className={`${styles.input} ${styles.timerInput}`}
              value={timerMinutes}
              onChange={(e) => setTimerMinutes(e.target.value)}
              min="1"
              placeholder="분"
            />
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>분</span>
          </div>
          <div className={styles.buttonGroup} style={{ marginTop: 15 }}>
            <button
              className={`${styles.button} ${styles.buttonSuccess}`}
              onClick={handleStartStrategyI}
            >
              전략I 시작
            </button>
            <button
              className={`${styles.button} ${styles.buttonSuccess}`}
              onClick={handleStartStrategyII}
            >
              전략II 시작
            </button>
            <button
              className={`${styles.button} ${styles.buttonDanger}`}
              onClick={stopTimer}
            >
              정지
            </button>
          </div>
        </div>

        {/* Speech Cards */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>연설 카드</h2>
          </div>
          <div className={styles.speechCardInput}>
            <input
              type="text"
              className={styles.input}
              value={speechCardInput}
              onChange={(e) => setSpeechCardInput(e.target.value)}
              placeholder="♠A, ♥K, ♦Q (쉼표로 구분)"
            />
            <button
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={handleStartSpeech}
            >
              설정
            </button>
          </div>
          {gameState.speechCards.length > 0 && (
            <div className={styles.cardPreview}>
              {gameState.speechCards.map((card, i) => (
                <div
                  key={i}
                  className={`${styles.cardItem} ${isRed(card) ? styles.cardRed : styles.cardBlack}`}
                >
                  {card}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Player Control */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>플레이어</h2>
            <span className={styles.badge}>{gameState.totalPlayers}명</span>
          </div>
          <div className={styles.formGroup}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                type="number"
                className={`${styles.input} ${styles.timerInput}`}
                value={totalPlayersInput}
                onChange={(e) => setTotalPlayersInput(e.target.value)}
                min="2"
                max="12"
              />
              <button
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={handleSetTotalPlayers}
              >
                인원 변경
              </button>
            </div>
          </div>
          <div className={styles.playerGrid}>
            {gameState.players.map((player) => (
              <div
                key={player.id}
                className={`${styles.playerCard} ${
                  player.id === gameState.firstPlayer ? styles.first : ''
                } ${player.id === gameState.currentPlayer ? styles.current : ''}`}
              >
                <div className={styles.playerNumber}>{player.id}</div>
                <div className={styles.playerActions}>
                  <button
                    className={`${styles.button} ${styles.buttonSmall} ${styles.buttonSuccess}`}
                    onClick={() => setPlayerStatus(player.id, 'run')}
                  >
                    출마
                  </button>
                  <button
                    className={`${styles.button} ${styles.buttonSmall} ${styles.buttonSecondary}`}
                    onClick={() => setPlayerStatus(player.id, 'giveup')}
                  >
                    포기
                  </button>
                </div>
                {player.status && (
                  <div
                    className={`${styles.playerStatus} ${
                      player.status === 'run' ? styles.statusRun : styles.statusGiveup
                    }`}
                  >
                    {player.status === 'run' ? '출마' : '포기'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Vote Control */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>투표</h2>
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={setCandidacyMode}
            >
              출마/포기 모드
            </button>
            <button
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={setVoteMode}
            >
              투표 모드
            </button>
          </div>
          <div style={{ marginTop: 15 }}>
            <label className={styles.label}>투표 기록 (플레이어 → 후보)</label>
            <div className={styles.playerGrid}>
              {gameState.players.map((player) => {
                const candidates = gameState.players.filter((p) => p.status === 'run');
                return (
                  <div key={player.id} className={styles.playerCard}>
                    <div className={styles.playerNumber}>{player.id}</div>
                    <select
                      className={styles.select}
                      value={player.vote || ''}
                      onChange={(e) => setPlayerVote(player.id, parseInt(e.target.value))}
                      style={{ fontSize: '0.85rem' }}
                    >
                      <option value="">-</option>
                      {candidates.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.id}번
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Round End Control */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>라운드 종료</h2>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>당선자</label>
            <input
              type="number"
              className={styles.input}
              value={winnerInput}
              onChange={(e) => setWinnerInput(e.target.value)}
              min="1"
              max={gameState.totalPlayers}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={handleEndRound}
            >
              라운드 종료 & 당선자 발표
            </button>
          </div>
          {gameState.rankings.length > 0 && (
            <div style={{ marginTop: 15 }}>
              <label className={styles.label}>역대 당선자</label>
              <div className={styles.rankingsList}>
                {gameState.rankings.map((playerId, i) => (
                  <div key={i} className={styles.rankingItem}>
                    <span
                      className={`${styles.rankingPosition} ${
                        i === 0
                          ? styles.gold
                          : i === 1
                          ? styles.silver
                          : i === 2
                          ? styles.bronze
                          : ''
                      }`}
                    >
                      R{i + 1}
                    </span>
                    <span>Player {playerId}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Game Reset */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>게임 관리</h2>
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.button} ${styles.buttonDanger}`}
              onClick={() => {
                if (confirm('게임을 리셋하시겠습니까?')) {
                  resetGame();
                }
              }}
            >
              게임 리셋
            </button>
          </div>
        </div>

        {/* Debug State */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>현재 상태 (Debug)</h2>
          </div>
          <pre className={styles.stateDisplay}>
            {JSON.stringify(gameState, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
