import React from 'react';
import { ArrowLeft, CheckCircle2, Volume2, Film, Eye, Play } from 'lucide-react';
import { useGameState } from '../../context/GameContext';

export const HowToPlayScreen: React.FC = () => {
  const { navigateTo } = useGameState();

  const steps = [
    { num: 1, title: 'Select a Round', text: 'Choose the round you wish to play from the round selection screen.' },
    { num: 2, title: 'Select a Batch', text: 'Pick any batch of audio questions.' },
    { num: 3, title: 'Select a Question', text: 'Choose any question number from the question grid (01, 02, etc).' },
    { num: 4, title: 'Press ENTER to Begin', text: 'Press ENTER or click Start Question to open the question screen.' },
    { num: 5, title: 'Listen Carefully', text: 'Press ENTER to play the movie audio snippet. Use SPACE to pause/resume or R to replay.' },
    { num: 6, title: 'Identify the Movie', text: 'Listen closely and try to identify the film from the audio clue.' },
    { num: 7, title: 'Reveal the Answer', text: 'Press ENTER or click SHOW ANSWER to reveal the official movie answer image.' },
    { num: 8, title: 'Continue & Score', text: 'Mark as correct/wrong if scoring is enabled, and press ENTER or N for the Next Question.' },
  ];

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
          maxWidth: '800px',
          padding: '40px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            HOW TO PLAY
          </h2>
          <button className="btn btn-secondary" onClick={() => navigateTo('HOME')} aria-label="Back to Home">
            <ArrowLeft size={20} /> BACK
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {steps.map((step) => (
            <div
              key={step.num}
              className="glass-card"
              style={{
                padding: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--accent-indigo)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  flexShrink: 0,
                }}
              >
                {step.num}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--accent-gold)' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '36px', textAlign: 'center' }}>
          <button className="btn btn-gold btn-large" onClick={() => navigateTo('ROUND_SELECT')} style={{ width: '100%', maxWidth: '320px' }}>
            <Play size={20} fill="#000000" /> START PLAYING NOW
          </button>
        </div>
      </div>
    </div>
  );
};
