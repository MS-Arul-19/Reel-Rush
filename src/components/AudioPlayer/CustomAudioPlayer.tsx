import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

interface CustomAudioPlayerProps {
  audioUrl: string;
  onAudioStart?: () => void;
  onAudioEnded?: () => void;
  autoPlayTrigger?: boolean;
}

export const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({
  audioUrl,
  onAudioStart,
  onAudioEnded,
  autoPlayTrigger = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  const handlePlay = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.play().then(() => {
      setIsPlaying(true);
      if (!hasStarted) {
        setHasStarted(true);
        onAudioStart?.();
      }
    }).catch((err) => {
      console.warn('Audio play request handled:', err);
    });
  }, [hasStarted, onAudioStart]);

  const handlePause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  }, [isPlaying, handlePause, handlePlay]);

  const handleReplay = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    handlePlay();
  }, [handlePlay]);

  // Handle trigger from parent
  useEffect(() => {
    if (autoPlayTrigger && !hasStarted && audioRef.current) {
      handlePlay();
    }
  }, [autoPlayTrigger, hasStarted, handlePlay]);

  // Audio setup and cleanup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);
    setIsPlaying(false);
    setHasStarted(false);
    setCurrentTime(0);

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const onEnded = () => {
      setIsPlaying(false);
      onAudioEnded?.();
    };

    const onError = (e: Event) => {
      console.warn('Audio metadata event:', e);
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [audioUrl, onAudioEnded]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0) setIsMuted(false);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '28px 36px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <audio ref={audioRef} preload="auto" loop>
        <source src={audioUrl} type="audio/mpeg" />
        <source src={audioUrl} type="audio/mp3" />
        <source src={audioUrl} />
      </audio>

      {/* Visualizer */}
      <AudioVisualizer isPlaying={isPlaying} />

      {/* Progress Bar & Timers */}
      <div style={{ marginTop: '20px', marginBottom: '24px' }}>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          aria-label="Audio progress slider"
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            accentColor: 'var(--accent-gold)',
            background: 'rgba(255,255,255,0.1)',
            cursor: 'pointer'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Primary Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            className="btn btn-primary"
            onClick={togglePlayPause}
            style={{ width: '140px' }}
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? <><Pause size={20} /> PAUSE</> : <><Play size={20} /> {hasStarted ? 'RESUME' : 'PLAY'}</>}
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleReplay}
            title="Replay Audio (R)"
            aria-label="Replay audio"
          >
            <RotateCcw size={20} /> REPLAY
          </button>
        </div>

        {/* Volume Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted || volume === 0 ? <VolumeX size={22} color="var(--accent-red)" /> : <Volume2 size={22} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label="Volume slider"
            style={{ width: '90px', accentColor: 'var(--accent-indigo)' }}
          />
        </div>
      </div>
    </div>
  );
};
