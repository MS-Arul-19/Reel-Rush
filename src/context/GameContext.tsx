import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  GameManifest,
  GameScreen,
  QuestionPlayState,
  GameSettings,
  Round,
  Batch,
  Question,
  QuestionResult
} from '../types/game';

interface GameContextType {
  manifest: GameManifest | null;
  isLoading: boolean;
  error: string | null;
  currentScreen: GameScreen;
  currentRoundId: string | null;
  currentBatchId: string | null;
  selectedQuestionId: string | null;
  questionPlayState: QuestionPlayState;
  completedQuestionIds: string[];
  scoredResults: Record<string, QuestionResult>;
  score: number;
  settings: GameSettings;

  // Actions
  navigateTo: (screen: GameScreen) => void;
  selectRound: (roundId: string) => void;
  selectBatch: (batchId: string) => void;
  selectQuestion: (questionId: string) => void;
  setQuestionPlayState: (state: QuestionPlayState) => void;
  markQuestionCompleted: (questionId: string, isCorrect?: boolean) => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  resetProgress: () => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  toggleFullscreen: () => void;
  isFullscreen: boolean;

  // Resolved helpers
  currentRound: Round | null;
  currentBatch: Batch | null;
  currentQuestion: Question | null;
  getQuestionStatus: (qId: string) => 'UNPLAYED' | 'SELECTED' | 'IN_PROGRESS' | 'COMPLETED';
}

const DEFAULT_SETTINGS: GameSettings = {
  gameMode: 'player',
  enableScoring: false,
  pointsPerCorrectAnswer: 10,
  timerEnabled: false,
  timerDuration: 30,
  freeQuestionSelection: true,
  persistProgress: true,
};

const STORAGE_KEY_PROGRESS = 'movie_quiz_completed_questions';
const STORAGE_KEY_SETTINGS = 'movie_quiz_settings';
const STORAGE_KEY_SCORES = 'movie_quiz_scores';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manifest, setManifest] = useState<GameManifest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentScreen, setCurrentScreen] = useState<GameScreen>('HOME');
  const [currentRoundId, setCurrentRoundId] = useState<string | null>('round-1');
  const [currentBatchId, setCurrentBatchId] = useState<string | null>('batch-1');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [questionPlayState, setQuestionPlayState] = useState<QuestionPlayState>('READY');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Settings state
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Completed questions state
  const [completedQuestionIds, setCompletedQuestionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Scored results
  const [scoredResults, setScoredResults] = useState<Record<string, QuestionResult>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCORES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Load manifest on mount
  useEffect(() => {
    fetch('/gameData.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load game content manifest.');
        return res.json();
      })
      .then((data: GameManifest) => {
        setManifest(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Error loading manifest data');
        setIsLoading(false);
      });
  }, []);

  // Save settings on update
  useEffect(() => {
    if (settings.persistProgress) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    }
  }, [settings]);

  // Save completed questions
  useEffect(() => {
    if (settings.persistProgress) {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(completedQuestionIds));
    }
  }, [completedQuestionIds, settings.persistProgress]);

  // Save score results
  useEffect(() => {
    if (settings.persistProgress) {
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(scoredResults));
    }
  }, [scoredResults, settings.persistProgress]);

  // Handle Fullscreen state change events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Calculate overall score
  const score = Object.values(scoredResults).reduce((acc, curr) => {
    return acc + (curr.pointsEarned || 0);
  }, 0);

  // Resolved entities
  const currentRound = manifest?.rounds.find((r) => r.id === currentRoundId) || null;
  const currentBatch = currentRound?.batches.find((b) => b.id === currentBatchId) || null;
  const currentQuestion = currentBatch?.questions.find((q) => q.id === selectedQuestionId) || null;

  const navigateTo = (screen: GameScreen) => {
    setCurrentScreen(screen);
  };

  const selectRound = (roundId: string) => {
    setCurrentRoundId(roundId);
    const round = manifest?.rounds.find((r) => r.id === roundId);
    if (round && round.batches.length > 0) {
      setCurrentBatchId(round.batches[0].id);
    } else {
      setCurrentBatchId(null);
    }
    setCurrentScreen('BATCH_SELECT');
  };

  const selectBatch = (batchId: string) => {
    setCurrentBatchId(batchId);
    setCurrentScreen('QUESTION_SELECT');
  };

  const selectQuestion = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setQuestionPlayState('READY');
  };

  const getQuestionStatus = (qId: string) => {
    if (completedQuestionIds.includes(qId)) return 'COMPLETED';
    if (selectedQuestionId === qId) {
      if (currentScreen === 'QUESTION_PLAY') return 'IN_PROGRESS';
      return 'SELECTED';
    }
    return 'UNPLAYED';
  };

  const markQuestionCompleted = (questionId: string, isCorrect?: boolean) => {
    if (!completedQuestionIds.includes(questionId)) {
      setCompletedQuestionIds((prev) => [...prev, questionId]);
    }

    if (settings.enableScoring && isCorrect !== undefined) {
      const points = isCorrect ? settings.pointsPerCorrectAnswer : 0;
      setScoredResults((prev) => ({
        ...prev,
        [questionId]: {
          questionId,
          batchId: currentBatchId || '',
          roundId: currentRoundId || '',
          isCorrect,
          pointsEarned: points,
        },
      }));
    }
  };

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetProgress = () => {
    setCompletedQuestionIds([]);
    setScoredResults({});
    localStorage.removeItem(STORAGE_KEY_PROGRESS);
    localStorage.removeItem(STORAGE_KEY_SCORES);
  };

  const nextQuestion = () => {
    if (!currentBatch) return;
    const questions = currentBatch.questions;
    const currentIndex = questions.findIndex((q) => q.id === selectedQuestionId);

    if (currentIndex !== -1 && currentIndex < questions.length - 1) {
      const nextQ = questions[currentIndex + 1];
      setSelectedQuestionId(nextQ.id);
      setQuestionPlayState('READY');
      setCurrentScreen('QUESTION_PLAY');
    } else {
      // Batch complete!
      setCurrentScreen('BATCH_COMPLETE');
    }
  };

  const prevQuestion = () => {
    if (!currentBatch) return;
    const questions = currentBatch.questions;
    const currentIndex = questions.findIndex((q) => q.id === selectedQuestionId);

    if (currentIndex > 0) {
      const prevQ = questions[currentIndex - 1];
      selectQuestion(prevQ.id);
      setQuestionPlayState('READY');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn('Exit fullscreen error:', err);
      });
    }
  };

  return (
    <GameContext.Provider
      value={{
        manifest,
        isLoading,
        error,
        currentScreen,
        currentRoundId,
        currentBatchId,
        selectedQuestionId,
        questionPlayState,
        completedQuestionIds,
        scoredResults,
        score,
        settings,
        navigateTo,
        selectRound,
        selectBatch,
        selectQuestion,
        setQuestionPlayState,
        markQuestionCompleted,
        updateSettings,
        resetProgress,
        nextQuestion,
        prevQuestion,
        toggleFullscreen,
        isFullscreen,
        currentRound,
        currentBatch,
        currentQuestion,
        getQuestionStatus,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};
