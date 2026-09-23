import React, { useState } from 'react';
import { ArrowLeft, Save, Trash2, ShieldAlert, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import { useGameState } from '../../context/GameContext';

export const SettingsModal: React.FC = () => {
  const { settings, updateSettings, resetProgress, navigateTo } = useGameState();

  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  const handleReset = () => {
    resetProgress();
    setConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div
        className="glass-panel animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: '40px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>SETTINGS & CONFIGURATION</h2>
          <button className="btn btn-secondary" onClick={() => navigateTo('HOME')} aria-label="Back to Home">
            <ArrowLeft size={18} /> BACK
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Game Mode */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Game Mode</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Host Mode enables quick live event controls (Prev/Next/Overlay).
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`btn ${settings.gameMode === 'player' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => updateSettings({ gameMode: 'player' })}
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                PLAYER
              </button>
              <button
                className={`btn ${settings.gameMode === 'host' ? 'btn-gold' : 'btn-secondary'}`}
                onClick={() => updateSettings({ gameMode: 'host' })}
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                HOST
              </button>
            </div>
          </div>

          {/* Scoring System */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Scoring System</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Enable Correct / Wrong marking after answer reveal.
              </p>
            </div>
            <button
              onClick={() => updateSettings({ enableScoring: !settings.enableScoring })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: settings.enableScoring ? 'var(--accent-green)' : 'var(--text-muted)' }}
              aria-label="Toggle scoring system"
            >
              {settings.enableScoring ? <ToggleRight size={38} /> : <ToggleLeft size={38} />}
            </button>
          </div>

          {settings.enableScoring && (
            <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '20px', borderColor: 'var(--accent-indigo)' }}>
              <span style={{ fontSize: '0.95rem' }}>Points Per Correct Answer</span>
              <input
                type="number"
                min={1}
                max={100}
                value={settings.pointsPerCorrectAnswer}
                onChange={(e) => updateSettings({ pointsPerCorrectAnswer: parseInt(e.target.value, 10) || 10 })}
                style={{
                  width: '80px',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-glass)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  textAlign: 'center',
                  fontWeight: 700,
                }}
              />
            </div>
          )}

          {/* Free Question Selection */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Free Question Selection</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Allow picking any question grid card vs enforcing sequential order.
              </p>
            </div>
            <button
              onClick={() => updateSettings({ freeQuestionSelection: !settings.freeQuestionSelection })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: settings.freeQuestionSelection ? 'var(--accent-gold)' : 'var(--text-muted)' }}
              aria-label="Toggle free question selection"
            >
              {settings.freeQuestionSelection ? <ToggleRight size={38} /> : <ToggleLeft size={38} />}
            </button>
          </div>

          {/* Reset Progress */}
          <div className="glass-card" style={{ padding: '20px', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-red)', marginBottom: '4px' }}>
                  Reset Game Progress
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Clear all completed questions, scores, and saved session data.
                </p>
              </div>
              <button
                className="btn btn-red"
                onClick={() => setConfirmReset(true)}
                style={{ padding: '10px 18px', fontSize: '0.9rem' }}
              >
                <Trash2 size={16} /> RESET
              </button>
            </div>

            {confirmReset && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '16px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  borderRadius: '10px',
                  border: '1px solid var(--accent-red)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', fontSize: '0.9rem' }}>
                  <ShieldAlert size={20} color="var(--accent-red)" />
                  <span>Are you sure? This cannot be undone.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary" onClick={() => setConfirmReset(false)} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                    CANCEL
                  </button>
                  <button className="btn btn-red" onClick={handleReset} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                    CONFIRM RESET
                  </button>
                </div>
              </div>
            )}

            {resetSuccess && (
              <div style={{ marginTop: '12px', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <Check size={16} /> Progress has been reset successfully!
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '36px', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigateTo('HOME')} style={{ width: '100%', maxWidth: '280px' }}>
            SAVE & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
