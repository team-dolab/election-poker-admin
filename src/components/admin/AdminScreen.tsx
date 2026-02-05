'use client';

import { useState } from 'react';
import { useSupabaseGameState } from '@/hooks/useSupabaseGameState';
import { useTimer } from '@/hooks/useTimer';
import { useAdminState } from '@/hooks/useAdminState';
import { GameStep } from '@/types/adminState';

// Dashboard components
import DashboardHeader from './dashboard/DashboardHeader';
import CreateSessionCard from './dashboard/CreateSessionCard';
import SessionList from './dashboard/SessionList';

// Game components
import GameHeader from './game/GameHeader';
import Step1RoundStart from './game/steps/Step1RoundStart';
import Step2Dealing from './game/steps/Step2Dealing';
import Step3StrategyI from './game/steps/Step3StrategyI';
import Step4CandidacyStart from './game/steps/Step4CandidacyStart';
import Step5CandidacyProcess from './game/steps/Step5CandidacyProcess';
import Step6SpeechStart from './game/steps/Step6SpeechStart';
import Step7SpeechProcess from './game/steps/Step7SpeechProcess';
import Step8StrategyII from './game/steps/Step8StrategyII';
import Step9VoteStart from './game/steps/Step9VoteStart';
import Step10VoteProcess from './game/steps/Step10VoteProcess';
import Step11RoundEnd from './game/steps/Step11RoundEnd';
import ConfirmModal from './common/ConfirmModal';

import styles from './admin.module.css';

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
  const adminState = useAdminState();

  // Modal states
  const [showResetModal, setShowResetModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Mock sessions (in real app, this would come from database)
  const [sessions] = useState<
    {
      id: string;
      createdAt: string;
      totalPlayers: number;
      currentRound: number;
      status: 'active' | 'completed';
    }[]
  >([]);

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

  // Handlers
  const handleCreateSession = (totalPlayers: number) => {
    setTotalPlayers(totalPlayers);
    adminState.enterGame('new-session');
  };

  const handleExitGame = () => {
    setShowExitModal(true);
  };

  const confirmExitGame = () => {
    adminState.exitGame();
    setShowExitModal(false);
  };

  const handleResetGame = () => {
    setShowResetModal(true);
  };

  const confirmResetGame = () => {
    resetGame();
    adminState.goToStep('step1_roundStart');
    setShowResetModal(false);
  };

  const handleStartRound = (round: number, firstPlayer: number) => {
    startRound(round, firstPlayer);
  };

  const handleSetDealing = () => {
    setViewMode('dealing');
  };

  const handleStartStrategyI = (minutes: number) => {
    startStrategyI(minutes);
  };

  const handleStartStrategyII = (minutes: number) => {
    startStrategyII(minutes);
  };

  const handleSetSpeechCards = (cards: string[]) => {
    startSpeech(cards);
  };

  const handleEndRound = (winnerId: number) => {
    endRound(winnerId);
  };

  const handleNextRound = () => {
    adminState.goToStep('step1_roundStart');
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (adminState.currentStep) {
      case 'step1_roundStart':
        return (
          <Step1RoundStart
            currentRound={gameState.round}
            totalPlayers={gameState.totalPlayers}
            onStartRound={handleStartRound}
            onNext={adminState.nextStep}
          />
        );
      case 'step2_dealing':
        return (
          <Step2Dealing
            onSetDealing={handleSetDealing}
            onNext={adminState.nextStep}
            onPrev={adminState.prevStep}
          />
        );
      case 'step3_strategyI':
        return (
          <Step3StrategyI
            timerFormatted={timer.formatted}
            timerRemaining={timer.remainingSeconds}
            onStartTimer={handleStartStrategyI}
            onStopTimer={stopTimer}
            onNext={adminState.nextStep}
            onPrev={adminState.prevStep}
          />
        );
      case 'step4_candidacyStart':
        return (
          <Step4CandidacyStart
            onSetCandidacyMode={setCandidacyMode}
            onNext={adminState.nextStep}
            onPrev={adminState.prevStep}
          />
        );
      case 'step5_candidacyProcess':
        return (
          <Step5CandidacyProcess
            players={gameState.players}
            currentPlayer={gameState.currentPlayer}
            onSetPlayerStatus={setPlayerStatus}
            onNext={adminState.nextStep}
            onPrev={adminState.prevStep}
          />
        );
      case 'step6_speechStart':
        return (
          <Step6SpeechStart
            onNext={adminState.nextStep}
            onPrev={adminState.prevStep}
          />
        );
      case 'step7_speechProcess':
        return (
          <Step7SpeechProcess
            players={gameState.players}
            speechCards={gameState.speechCards}
            onSetSpeechCards={handleSetSpeechCards}
            onNext={adminState.nextStep}
            onPrev={adminState.prevStep}
          />
        );
      case 'step8_strategyII':
        return (
          <Step8StrategyII
            timerFormatted={timer.formatted}
            timerRemaining={timer.remainingSeconds}
            onStartTimer={handleStartStrategyII}
            onStopTimer={stopTimer}
            onNext={adminState.nextStep}
            onPrev={adminState.prevStep}
          />
        );
      case 'step9_voteStart':
        return (
          <Step9VoteStart
            onSetVoteMode={setVoteMode}
            onNext={adminState.nextStep}
            onPrev={adminState.prevStep}
          />
        );
      case 'step10_voteProcess':
        return (
          <Step10VoteProcess
            players={gameState.players}
            onSetPlayerVote={setPlayerVote}
            onNext={adminState.nextStep}
            onPrev={adminState.prevStep}
          />
        );
      case 'step11_roundEnd':
        return (
          <Step11RoundEnd
            players={gameState.players}
            round={gameState.round}
            rankings={gameState.rankings}
            onEndRound={handleEndRound}
            onNextRound={handleNextRound}
            onResetGame={handleResetGame}
          />
        );
      default:
        return null;
    }
  };

  // Dashboard Mode
  if (adminState.mode === 'dashboard') {
    return (
      <div className={styles.container}>
        <DashboardHeader isConnected={isConnected} />
        <div className={styles.dashboardContent}>
          <CreateSessionCard onCreateSession={handleCreateSession} />
          <SessionList
            sessions={sessions}
            onSelectSession={(id) => adminState.enterGame(id)}
            onDeleteSession={(id) => console.log('delete', id)}
          />
        </div>
      </div>
    );
  }

  // Game Mode
  return (
    <div className={styles.container}>
      <GameHeader
        currentStep={adminState.currentStep}
        round={gameState.round}
        isConnected={isConnected}
        onExitGame={handleExitGame}
      />
      <div className={styles.gameContent}>
        {renderCurrentStep()}
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={showResetModal}
        title="게임 리셋"
        message="정말 게임을 리셋하시겠습니까? 모든 진행 상황이 초기화됩니다."
        confirmText="리셋"
        onConfirm={confirmResetGame}
        onCancel={() => setShowResetModal(false)}
        variant="danger"
      />
      <ConfirmModal
        isOpen={showExitModal}
        title="대시보드로 이동"
        message="대시보드로 돌아가시겠습니까? 현재 진행 상황은 유지됩니다."
        confirmText="이동"
        onConfirm={confirmExitGame}
        onCancel={() => setShowExitModal(false)}
      />
    </div>
  );
}
