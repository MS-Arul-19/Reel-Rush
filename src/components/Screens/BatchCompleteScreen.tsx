import React from 'react';
import { Award, CheckCircle, ArrowRight, Layers, Home, RefreshCw } from 'lucide-react';
import { useGameState } from '../../context/GameContext';

export const BatchCompleteScreen: React.FC = () => {
  const { currentRound, currentBatch, score, settings, navigateTo, selectBatch } = useGameState();

  if (!currentRound || !currentBatch) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Batch complete details unavailable.</p>
      </div>
    );
  }

  const totalQuestions = currentBatch.questions.length;
  const maxPossibleScore = totalQuestions * settings.pointsPerCorrectAnswer;

  // Check if there is a next batch in the current round
  const currentBatchIndex = currentRound.batches.findIndex((b) => b.id === currentBatch.id);
  const nextBatch = currentBatchIndex !== -1 && currentBatchIndex < currentRound.batches.length - 1
    ? currentRound.batches[currentBatchIndex + 1]
    : null;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <div
        className="glass-panel animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: '50px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          borderColor: 'var(--accent-green)',
          boxShadow: '0 0 50px rgba(16, 185, 129, 0.25)',
        }}
      >
        <div
          className="pulse-glow"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid var(--accent-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-green)',
          }}
        >
          <Award size={48} />
        </div>

        <div>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-green)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {currentRound.name} • {currentBatch.name}
          </span>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '0.04em', marginTop: '4px' }}>
            BATCH COMPLETE
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '8px' }}>
            ALL {totalQuestions} QUESTIONS COMPLETED!
          </p>
        </div>

        {/* Optional Final Score */}
        {settings.enableScoring && (
          <div
            style={{
              padding: '16px 32px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              border: '1px solid var(--accent-gold)',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              BATCH FINAL SCORE
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>
              {score} / {maxPossibleScore}
            </div>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '340px', marginTop: '12px' }}>
          {nextBatch && (
            <button
              className="btn btn-gold btn-large"
              onClick={() => selectBatch(nextBatch.id)}
            >
              NEXT BATCH <ArrowRight size={20} />
            </button>
          )}

          <button
            className="btn btn-secondary"
            onClick={() => navigateTo('BATCH_SELECT')}
          >
            <Layers size={18} /> BACK TO BATCHES
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigateTo('ROUND_SELECT')}
          >
            BACK TO ROUNDS
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigateTo('HOME')}
          >
            <Home size={18} /> HOME
          </button>
        </div>
      </div>
    </div>
  );
};
