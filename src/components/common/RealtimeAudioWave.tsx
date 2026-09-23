import React, { useEffect, useRef } from 'react';
import { audioVisualizerService } from '../../utils/audioVisualizerService';

export type WaveVariant = 'blue' | 'rose' | 'emerald' | 'cyan' | 'amber' | 'purple';

export interface RealtimeAudioWaveProps {
  isActive: boolean;
  barCount?: number;
  minHeight?: number;
  maxHeight?: number;
  barWidth?: string;
  gap?: string;
  variant?: WaveVariant;
  className?: string;
}

const VARIANT_GRADIENTS: Record<WaveVariant, { active: string; glow: string }> = {
  blue: {
    active: 'bg-gradient-to-t from-blue-600 via-indigo-500 to-cyan-400',
    glow: 'shadow-[0_0_8px_rgba(59,130,246,0.5)]',
  },
  rose: {
    active: 'bg-gradient-to-t from-rose-600 via-pink-500 to-amber-400',
    glow: 'shadow-[0_0_8px_rgba(244,63,94,0.5)]',
  },
  emerald: {
    active: 'bg-gradient-to-t from-emerald-500 via-teal-400 to-cyan-400',
    glow: 'shadow-[0_0_8px_rgba(16,185,129,0.5)]',
  },
  cyan: {
    active: 'bg-gradient-to-t from-cyan-500 via-sky-400 to-blue-400',
    glow: 'shadow-[0_0_8px_rgba(6,182,212,0.5)]',
  },
  amber: {
    active: 'bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-300',
    glow: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]',
  },
  purple: {
    active: 'bg-gradient-to-t from-purple-600 via-fuchsia-500 to-pink-400',
    glow: 'shadow-[0_0_8px_rgba(168,85,247,0.5)]',
  },
};

// Acoustic noise floor threshold: ignore background room hiss (< ~16/255)
const NOISE_FLOOR = 16;

/**
 * RealtimeAudioWave Component
 * Renders high-performance, real-time equalizer bars connected to the user's
 * live microphone input.
 *
 * Rules:
 * - When silent ("diam"): Bars remain completely still at minHeight (no artificial fake wave).
 * - When voice enters ("nyala"): Bars bounce dynamically to incoming acoustic frequencies & volume.
 * - Always stays in consistent active styling (no alternating standby/aktif mode text).
 * - 0 React parent re-renders at 60 FPS via direct style assignment.
 */
export const RealtimeAudioWave: React.FC<RealtimeAudioWaveProps> = ({
  isActive,
  barCount = 12,
  minHeight = 3,
  maxHeight = 24,
  barWidth = 'w-1',
  gap = 'gap-0.5',
  variant = 'blue',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const smoothedHeightsRef = useRef<number[]>([]);

  // Initialize smoothed heights array
  if (smoothedHeightsRef.current.length !== barCount) {
    smoothedHeightsRef.current = Array(barCount).fill(minHeight);
  }

  const colorConfig = VARIANT_GRADIENTS[variant] || VARIANT_GRADIENTS.blue;

  useEffect(() => {
    if (!isActive) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      smoothedHeightsRef.current = Array(barCount).fill(minHeight);
      barRefs.current.forEach((bar) => {
        if (bar) {
          bar.style.height = `${minHeight}px`;
          bar.style.opacity = '0.7';
        }
      });
      return;
    }

    let isCancelled = false;

    const startVisualizer = async () => {
      const analyser = await audioVisualizerService.acquire();
      if (isCancelled || !analyser) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Focus frequency sampling on human speech range (bins 1 to 24)
      const speechMaxBin = Math.min(bufferLength, 28);
      const step = Math.max(1, Math.floor(speechMaxBin / barCount));

      const render = () => {
        if (isCancelled) return;

        analyser.getByteFrequencyData(dataArray);

        // Update each bar with acoustic frequency energy
        for (let i = 0; i < barCount; i++) {
          const binIndex = Math.min(bufferLength - 1, 1 + i * step);
          const rawEnergy = dataArray[binIndex] || 0;

          // Pure acoustic response: if silent/diam, stay at minHeight with NO wave
          let targetHeight = minHeight;
          if (rawEnergy > NOISE_FLOOR) {
            const normalized = (rawEnergy - NOISE_FLOOR) / (255 - NOISE_FLOOR);
            targetHeight = minHeight + normalized * (maxHeight - minHeight);
          }

          // Fast attack when speaking, smooth decay when pausing
          const current = smoothedHeightsRef.current[i] || minHeight;
          const factor = targetHeight > current ? 0.55 : 0.25;
          let next = current + (targetHeight - current) * factor;

          // Snap to rest when quiet so bars sit cleanly still
          if (next - minHeight < 0.2) {
            next = minHeight;
          }
          smoothedHeightsRef.current[i] = next;

          const bar = barRefs.current[i];
          if (bar) {
            bar.style.height = `${Math.round(next * 10) / 10}px`;
            // Subtle energy luminosity during peaks
            bar.style.opacity = next > minHeight + 2 ? '1' : '0.8';
          }
        }

        animFrameRef.current = requestAnimationFrame(render);
      };

      animFrameRef.current = requestAnimationFrame(render);
    };

    startVisualizer();

    return () => {
      isCancelled = true;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      audioVisualizerService.release();
      smoothedHeightsRef.current = Array(barCount).fill(minHeight);
      barRefs.current.forEach((bar) => {
        if (bar) {
          bar.style.height = `${minHeight}px`;
          bar.style.opacity = '0.7';
        }
      });
    };
  }, [isActive, barCount, minHeight, maxHeight]);

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center ${gap} ${className}`}
      aria-label="Indikator gelombang suara mikrofon"
    >
      <div className={`flex items-center ${gap}`} style={{ height: `${maxHeight + 2}px` }}>
        {Array.from({ length: barCount }).map((_, i) => (
          <span
            key={i}
            ref={(el) => {
              barRefs.current[i] = el;
            }}
            className={`${barWidth} rounded-full transition-all duration-75 ${colorConfig.active} ${colorConfig.glow}`}
            style={{
              height: `${minHeight}px`,
              opacity: 0.8,
              willChange: 'height, opacity',
            }}
          />
        ))}
      </div>
    </div>
  );
};
