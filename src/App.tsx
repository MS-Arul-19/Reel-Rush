import React, { useEffect } from 'react';
import { useGameState, GameProvider } from './context/GameContext';
import { Header } from './components/Common/Header';
import { HomeScreen } from './components/Screens/HomeScreen';
import { HowToPlayScreen } from './components/Screens/HowToPlayScreen';
import { SettingsModal } from './components/Screens/SettingsModal';
import { RoundSelectionScreen } from './components/Screens/RoundSelectionScreen';
import { BatchSelectionScreen } from './components/Screens/BatchSelectionScreen';
import { QuestionSelectionScreen } from './components/Screens/QuestionSelectionScreen';
import { QuestionPlayScreen } from './components/Screens/QuestionPlayScreen';
import { BatchCompleteScreen } from './components/Screens/BatchCompleteScreen';
import { Loader2 } from 'lucide-react';

const GameRouter: React.FC = () => {
  const {
    currentScreen,
    isLoading,
    error,
    selectedQuestionId,
    questionPlayState,
    setQuestionPlayState,
    markQuestionCompleted,
    nextQuestion,
    navigateTo,
    toggleFullscreen,
    currentQuestion,
  } = useGameState();

  // Global Keyboard Shortcuts Dispatcher
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in an input
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      const key = e.key.toUpperCase();

      if (key === 'F') {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      if (key === 'ESCAPE') {
        e.preventDefault();
        if (currentScreen === 'QUESTION_PLAY') {
          navigateTo('QUESTION_SELECT');
        } else if (currentScreen === 'QUESTION_SELECT') {
          navigateTo('BATCH_SELECT');
        } else if (currentScreen === 'BATCH_SELECT') {
          navigateTo('ROUND_SELECT');
        } else if (currentScreen === 'ROUND_SELECT' || currentScreen === 'HOW_TO_PLAY' || currentScreen === 'SETTINGS') {
          navigateTo('HOME');
        }
        return;
      }

      if (currentScreen === 'QUESTION_SELECT') {
        if (key === 'ENTER' && selectedQuestionId) {
          e.preventDefault();
          navigateTo('QUESTION_PLAY');
        }
      } else if (currentScreen === 'QUESTION_PLAY') {
        if (key === 'ENTER') {
          e.preventDefault();
          if (questionPlayState === 'READY') {
            setQuestionPlayState('AUDIO_PLAYING');
          } else if (questionPlayState === 'AUDIO_COMPLETED' || questionPlayState === 'AUDIO_PLAYING') {
            setQuestionPlayState('THINKING');
          } else if (questionPlayState === 'THINKING') {
            setQuestionPlayState('ANSWER_REVEALED');
            if (currentQuestion) markQuestionCompleted(currentQuestion.id);
          } else if (questionPlayState === 'ANSWER_REVEALED') {
            nextQuestion();
          }
        } else if (key === 'A') {
          e.preventDefault();
          if (questionPlayState === 'THINKING' || questionPlayState === 'AUDIO_COMPLETED' || questionPlayState === 'AUDIO_PLAYING') {
            setQuestionPlayState('ANSWER_REVEALED');
            if (currentQuestion) markQuestionCompleted(currentQuestion.id);
          }
        } else if (key === 'N') {
          e.preventDefault();
          if (questionPlayState === 'ANSWER_REVEALED' || questionPlayState === 'THINKING') {
            nextQuestion();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentScreen,
    selectedQuestionId,
    questionPlayState,
    setQuestionPlayState,
    markQuestionCompleted,
    nextQuestion,
    navigateTo,
    toggleFullscreen,
    currentQuestion,
  ]);

  if (isLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loader2 size={48} color="var(--accent-gold)" className="spin" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Loading Movie Audio Quiz...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        <h2 style={{ color: 'var(--accent-red)', marginBottom: '12px' }}>MANIFEST ERROR</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentScreen === 'HOME' && <HomeScreen />}
        {currentScreen === 'HOW_TO_PLAY' && <HowToPlayScreen />}
        {currentScreen === 'SETTINGS' && <SettingsModal />}
        {currentScreen === 'ROUND_SELECT' && <RoundSelectionScreen />}
        {currentScreen === 'BATCH_SELECT' && <BatchSelectionScreen />}
        {currentScreen === 'QUESTION_SELECT' && <QuestionSelectionScreen />}
        {currentScreen === 'QUESTION_PLAY' && <QuestionPlayScreen />}
        {currentScreen === 'BATCH_COMPLETE' && <BatchCompleteScreen />}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
};

export default App;
