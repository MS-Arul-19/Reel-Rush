import React from 'react';
import { Play, HelpCircle, Settings, Film, Award, Sparkles } from 'lucide-react';
import { useGameState } from '../../context/GameContext';

export const HomeScreen: React.FC = () => {
  const { navigateTo, manifest } = useGameState();

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
        position: 'relative',
      }}
    >
      <div
        className="glass-panel animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '720px',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          borderColor: 'rgba(255, 255, 255, 0.12)',
        }}
      >
        {/* Animated Icon Badge */}
        <div
          className="pulse-glow"
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, var(--accent-gold) 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 40px var(--accent-gold-glow)',
          }}
        >
          <Film size={48} color="#000000" />
        </div>

        {/* Title & Tagline */}
        <div>
          <h1
            style={{
              fontSize: '3.2rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '12px',
              lineHeight: 1.1,
            }}
          >
            {manifest?.title || 'MOVIE AUDIO QUIZ'}
          </h1>
          <p
            style={{
              fontSize: '1.4rem',
              color: 'var(--accent-gold)',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            "{manifest?.tagline || 'Listen. Identify. Reveal.'}"
          </p>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
            maxWidth: '380px',
            marginTop: '16px',
          }}
        >
          <button
            className="btn btn-gold btn-large"
            onClick={() => navigateTo('ROUND_SELECT')}
            aria-label="Start Game"
          >
            <Play size={24} fill="#000000" /> START GAME
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigateTo('HOW_TO_PLAY')}
            aria-label="How To Play instructions"
          >
            <HelpCircle size={20} /> HOW TO PLAY
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigateTo('SETTINGS')}
            aria-label="Game Settings"
          >
            <Settings size={20} /> SETTINGS
          </button>
        </div>
      </div>
    </div>
  );
};
