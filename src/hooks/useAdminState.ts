'use client';

import { useState, useCallback } from 'react';
import { AdminMode, GameStep } from '@/types/adminState';

interface UseAdminStateReturn {
  mode: AdminMode;
  currentStep: GameStep;
  sessionId: string | null;
  setMode: (mode: AdminMode) => void;
  setCurrentStep: (step: GameStep) => void;
  setSessionId: (id: string | null) => void;
  enterGame: (sessionId: string) => void;
  exitGame: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: GameStep) => void;
}

const STEP_ORDER: GameStep[] = [
  'step1_roundStart',
  'step2_dealing',
  'step3_strategyI',
  'step4_candidacyStart',
  'step5_candidacyProcess',
  'step6_speechStart',
  'step7_speechProcess',
  'step8_strategyII',
  'step9_voteStart',
  'step10_voteProcess',
  'step11_roundEnd',
];

export function useAdminState(): UseAdminStateReturn {
  const [mode, setMode] = useState<AdminMode>('dashboard');
  const [currentStep, setCurrentStep] = useState<GameStep>('step1_roundStart');
  const [sessionId, setSessionId] = useState<string | null>(null);

  const enterGame = useCallback((id: string) => {
    setSessionId(id);
    setMode('game');
    setCurrentStep('step1_roundStart');
  }, []);

  const exitGame = useCallback(() => {
    setMode('dashboard');
    setSessionId(null);
  }, []);

  const nextStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      setCurrentStep(STEP_ORDER[currentIndex + 1]);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEP_ORDER[currentIndex - 1]);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: GameStep) => {
    setCurrentStep(step);
  }, []);

  return {
    mode,
    currentStep,
    sessionId,
    setMode,
    setCurrentStep,
    setSessionId,
    enterGame,
    exitGame,
    nextStep,
    prevStep,
    goToStep,
  };
}
