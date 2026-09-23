import React from 'react';
import { Layers, ChevronRight, CheckCircle } from 'lucide-react';
import { useGameState } from '../../context/GameContext';

export const RoundSelectionScreen: React.FC = () => {
  const { manifest, selectRound, completedQuestionIds } = useGameState();

  if (!manifest || manifest.rounds.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No round content available.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 20px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '0.04em', marginBottom: '8px' }}>
          SELECT ROUND
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Choose a round to begin movie audio identification
        </p>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '840px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {manifest.rounds.map((round) => {
          // Calculate round metrics
          let totalQuestions = 0;
          round.batches.forEach((b) => {
            totalQuestions += b.questions.length;
          });

          let completedCount = 0;
          round.batches.forEach((b) => {
            b.questions.forEach((q) => {
              if (completedQuestionIds.includes(q.id)) completedCount++;
            });
          });

          const percent = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0;

          return (
            <div
              key={round.id}
              className="glass-card animate-scale-up"
              onClick={() => selectRound(round.id)}
              style={{
                padding: '32px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                borderColor: percent === 100 ? 'var(--accent-green)' : 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--accent-gold)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {round.batches.length} BATCHES
                  </span>
                  {percent === 100 && (
                    <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
                      <CheckCircle size={16} /> COMPLETE
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
                  {round.name}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  {totalQuestions} Audio Questions Total
                </p>
              </div>

              {/* Progress Bar & Footer */}
              <div style={{ marginTop: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <span>Progress</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{percent}% Completed</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: percent === 100 ? 'var(--accent-green)' : 'linear-gradient(90deg, var(--accent-indigo), var(--accent-cyan))',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>

                <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', color: 'var(--accent-indigo)', fontWeight: 600 }}>
                  ENTER ROUND <ChevronRight size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
