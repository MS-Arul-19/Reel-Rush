import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutGuide: React.FC<ShortcutGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'ENTER', desc: 'Start question / Start audio / Reveal answer / Next' },
    { key: 'SPACE', desc: 'Play / Pause audio' },
    { key: 'R', desc: 'Replay audio' },
    { key: 'A', desc: 'Show Answer image' },
    { key: 'N', desc: 'Next Question' },
    { key: 'F', desc: 'Toggle Fullscreen mode' },
    { key: 'ESC', desc: 'Back to previous screen / Close overlay' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-scale-up"
        style={{ width: '100%', maxWidth: '540px', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Keyboard size={24} color="var(--accent-gold)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>KEYBOARD SHORTCUTS</h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            aria-label="Close shortcuts modal"
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {shortcuts.map((sc) => (
            <div
              key={sc.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <kbd
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  padding: '4px 10px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--accent-gold)',
                  borderRadius: '6px',
                  color: 'var(--accent-gold)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                {sc.key}
              </kbd>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{sc.desc}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ width: '100%' }}>
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
};
