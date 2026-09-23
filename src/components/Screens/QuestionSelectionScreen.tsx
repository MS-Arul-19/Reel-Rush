import React, { useEffect } from 'react';
import { Check, Play, ArrowLeft } from 'lucide-react';
import { useGameState } from '../../context/GameContext';

export const QuestionSelectionScreen: React.FC = () => {
  const {
    currentRound,
    currentBatch,
    selectedQuestionId,
    selectQuestion,
    getQuestionStatus,
    navigateTo,
    completedQuestionIds,
  } = useGameState();

  // Highlight first uncompleted question if none selected yet
  useEffect(() => {
    if (currentBatch && currentBatch.questions.length > 0 && !selectedQuestionId) {
      const firstUncompleted = currentBatch.questions.find((q) => !completedQuestionIds.includes(q.id));
      if (firstUncompleted) {
        selectQuestion(firstUncompleted.id);
      } else {
        selectQuestion(currentBatch.questions[0].id);
      }
    }
  }, [currentBatch, selectedQuestionId, completedQuestionIds, selectQuestion]);

  if (!currentRound || !currentBatch) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No batch selected.</p>
      </div>
    );
  }

  if (currentBatch.questions.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
        <div className="glass-panel animate-scale-up" style={{ padding: '40px', maxWidth: '500px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {currentRound.name}
          </span>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: '8px 0 16px 0' }}>{currentBatch.name}</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '1.05rem' }}>
            Questions for this round will be added soon.
          </p>
          <button className="btn btn-secondary" onClick={() => navigateTo('BATCH_SELECT')}>
            <ArrowLeft size={18} /> BACK TO BATCHES
          </button>
        </div>
      </div>
    );
  }

  const selectedQuestionObj = currentBatch.questions.find((q) => q.id === selectedQuestionId);
  const selectedNum = selectedQuestionObj ? String(selectedQuestionObj.number).padStart(2, '0') : null;

  const totalQuestions = currentBatch.questions.length;
  const completedCount = currentBatch.questions.filter((q) => completedQuestionIds.includes(q.id)).length;
  const progressPercent = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0;

  const handleStartQuestion = () => {
    if (selectedQuestionId) {
      navigateTo('QUESTION_PLAY');
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px 120px 20px',
        position: 'relative',
      }}
    >
      {/* Title & Progress Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {currentRound.name} • {currentBatch.name}
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '0.04em', marginTop: '4px' }}>
          SELECT QUESTION
        </h2>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', marginTop: '12px', background: 'rgba(255,255,255,0.04)', padding: '6px 20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {completedCount} / {totalQuestions} COMPLETED
          </span>
          <div style={{ width: '100px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--accent-gold)' }} />
          </div>
        </div>
      </div>

      {/* Grid of Question Cards */}
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '18px',
        }}
      >
        {currentBatch.questions.map((q) => {
          const status = getQuestionStatus(q.id);
          const isSelected = selectedQuestionId === q.id;
          const isCompleted = status === 'COMPLETED';
          const formattedNum = String(q.number).padStart(2, '0');

          return (
            <div
              key={q.id}
              className="glass-card animate-scale-up"
              onClick={() => selectQuestion(q.id)}
              style={{
                height: '130px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                userSelect: 'none',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%)'
                  : isCompleted
                  ? 'rgba(16, 185, 129, 0.08)'
                  : 'rgba(22, 28, 46, 0.65)',
                borderWidth: isSelected ? '2px' : '1px',
                borderColor: isSelected
                  ? 'var(--accent-gold)'
                  : isCompleted
                  ? 'rgba(16, 185, 129, 0.4)'
                  : 'rgba(255, 255, 255, 0.08)',
                boxShadow: isSelected ? '0 0 25px var(--accent-gold-glow)' : 'none',
                transform: isSelected ? 'scale(1.05)' : 'none',
              }}
            >
              {isCompleted && (
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    color: 'var(--accent-green)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Check size={18} strokeWidth={3} />
                </div>
              )}

              <span
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  color: isSelected
                    ? 'var(--accent-gold)'
                    : isCompleted
                    ? 'var(--accent-green)'
                    : 'var(--text-primary)',
                }}
              >
                {formattedNum}
              </span>

              {isSelected && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: 'var(--accent-gold)',
                    textTransform: 'uppercase',
                    marginTop: '4px',
                  }}
                >
                  SELECTED
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Confirmation Action Bar */}
      {selectedNum && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 40px)',
            maxWidth: '600px',
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 40,
            borderColor: 'var(--accent-gold)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              CURRENT SELECTION
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              QUESTION {selectedNum}
            </div>
          </div>

          <button
            className="btn btn-gold btn-large"
            onClick={handleStartQuestion}
            style={{ padding: '12px 28px', fontSize: '1.1rem' }}
          >
            <Play size={20} fill="#000000" /> [ ENTER TO START ]
          </button>
        </div>
      )}

      {/* Back Button */}
      <div style={{ marginTop: '40px' }}>
        <button className="btn btn-secondary" onClick={() => navigateTo('BATCH_SELECT')}>
          <ArrowLeft size={18} /> BACK TO BATCHES
        </button>
      </div>
    </div>
  );
};
