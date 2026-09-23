import React, { useState } from 'react';
import { Home, Maximize, Minimize, Settings, Keyboard, Film, ChevronRight } from 'lucide-react';
import { useGameState } from '../../context/GameContext';
import { ShortcutGuide } from './ShortcutGuide';

export const Header: React.FC = () => {
  const {
    currentScreen,
    currentRound,
    currentBatch,
    selectedQuestionId,
    navigateTo,
    settings,
    toggleFullscreen,
    isFullscreen,
  } = useGameState();

  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);

  const qNum = selectedQuestionId ? parseInt(selectedQuestionId.replace(/\D/g, ''), 10) : null;

  return (
    <>
      <header
        style={{
          width: '100%',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-glass)',
          background: 'rgba(7, 9, 14, 0.85)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Brand & Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            onClick={() => navigateTo('HOME')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--accent-gold) 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px var(--accent-gold-glow)',
              }}
            >
              <Film size={22} color="#000000" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.04em', lineHeight: 1 }}>
                REEL RUSH
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.08em', marginTop: '3px' }}>
                Listen. Identify. Reveal.
              </div>
            </div>
          </button>

          {/* Breadcrumb Trail */}
          {currentScreen !== 'HOME' && currentScreen !== 'HOW_TO_PLAY' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                marginLeft: '12px',
                paddingLeft: '16px',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {currentRound && (
                <button
                  onClick={() => navigateTo('ROUND_SELECT')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  {currentRound.name}
                </button>
              )}

              {currentBatch && (currentScreen === 'QUESTION_SELECT' || currentScreen === 'QUESTION_PLAY' || currentScreen === 'BATCH_COMPLETE') && (
                <>
                  <ChevronRight size={14} />
                  <button
                    onClick={() => navigateTo('BATCH_SELECT')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  >
                    {currentBatch.name}
                  </button>
                </>
              )}

              {qNum && currentScreen === 'QUESTION_PLAY' && (
                <>
                  <ChevronRight size={14} />
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
                    Question {String(qNum).padStart(2, '0')}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Header Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Host Mode Badge */}
          {settings.gameMode === 'host' && (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                padding: '4px 10px',
                borderRadius: '20px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--accent-gold)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
              }}
            >
              HOST MODE
            </span>
          )}

          {/* Shortcuts Guide Button */}
          <button
            className="btn btn-secondary"
            onClick={() => setShowShortcuts(true)}
            title="Keyboard Shortcuts"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            aria-label="View keyboard shortcuts"
          >
            <Keyboard size={16} /> SHORTCUTS
          </button>

          {/* Settings Button */}
          <button
            className="btn btn-secondary"
            onClick={() => navigateTo('SETTINGS')}
            title="Settings"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            aria-label="Open settings"
          >
            <Settings size={16} />
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            className="btn btn-secondary"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>

          {/* Home Button */}
          {currentScreen !== 'HOME' && (
            <button
              className="btn btn-secondary"
              onClick={() => navigateTo('HOME')}
              title="Home"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              aria-label="Return to Home screen"
            >
              <Home size={16} />
            </button>
          )}
        </div>
      </header>

      <ShortcutGuide isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </>
  );
};
