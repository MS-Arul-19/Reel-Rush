import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, barCount = 36 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bars = Array.from({ length: barCount }, () => Math.random() * 0.3 + 0.1);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const barWidth = (width / barCount) * 0.65;
      const gap = (width - barWidth * barCount) / (barCount + 1);

      for (let i = 0; i < barCount; i++) {
        if (isPlaying) {
          // Smooth random height variation simulating dynamic audio spectrum
          const target = Math.random() * 0.85 + 0.15;
          bars[i] = bars[i] + (target - bars[i]) * 0.25;
        } else {
          // Decay when paused
          bars[i] = Math.max(0.08, bars[i] * 0.92);
        }

        const barHeight = bars[i] * height;
        const x = gap + i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        // Gradient color for bars
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isPlaying) {
          gradient.addColorStop(0, '#f59e0b'); // Warm amber top
          gradient.addColorStop(0.5, '#6366f1'); // Indigo center
          gradient.addColorStop(1, '#06b6d4'); // Cyan bottom
        } else {
          gradient.addColorStop(0, '#475569');
          gradient.addColorStop(1, '#1e293b');
        }

        ctx.fillStyle = gradient;
        ctx.shadowColor = isPlaying ? 'rgba(99, 102, 241, 0.5)' : 'transparent';
        ctx.shadowBlur = isPlaying ? 10 : 0;

        // Rounded rect bar
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barHeight, 4);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, barCount]);

  return (
    <div style={{ width: '100%', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={140}
        style={{ width: '100%', height: '100%', maxWidth: '700px' }}
      />
    </div>
  );
};
