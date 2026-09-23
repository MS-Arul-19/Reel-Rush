import React from 'react';
import { ArrowLeft, ChevronRight, CheckCircle, Disc } from 'lucide-react';
import { useGameState } from '../../context/GameContext';

export const BatchSelectionScreen: React.FC = () => {
  const { currentRound, selectBatch, completedQuestionIds, navigateTo } = useGameState();

  if (!currentRound) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No round selected.</p>
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
        padding: '50px 20px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {currentRound.name}
        </span>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '0.04em', marginTop: '4px' }}>
          SELECT BATCH
        </h2>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '840px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}
      >
        {currentRound.batches.map((batch) => {
          const totalQ = batch.questions.length;
          const completedQ = batch.questions.filter((q) => completedQuestionIds.includes(q.id)).length;
          const percent = totalQ > 0 ? Math.round((completedQ / totalQ) * 100) : 0;

          return (
            <div
              key={batch.id}
              className="glass-card animate-scale-up"
              onClick={() => selectBatch(batch.id)}
              style={{
                padding: '32px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: percent === 100 ? 'var(--accent-green)' : 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {totalQ} QUESTIONS
                  </span>
                  {percent === 100 && (
                    <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
                      <CheckCircle size={16} /> COMPLETED
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>
                  {batch.name}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                  {completedQ} / {totalQ} Completed
                </p>
              </div>

              {/* Progress Bar & Footer */}
              <div style={{ marginTop: '28px' }}>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: percent === 100 ? 'var(--accent-green)' : 'linear-gradient(90deg, var(--accent-gold), var(--accent-indigo))',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {percent}% Done
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)', fontWeight: 700 }}>
                    OPEN BATCH <ChevronRight size={18} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '40px' }}>
        <button className="btn btn-secondary" onClick={() => navigateTo('ROUND_SELECT')}>
          <ArrowLeft size={18} /> BACK TO ROUNDS
        </button>
      </div>
    </div>
  );
};
