import { useState, useEffect, useRef } from 'react';
import { audioVisualizerService } from '../utils/audioVisualizerService';

export interface AudioVisualizerResult {
  audioLevels: number[];
  volume: number;
  isVoiceActive: boolean;
}

/**
 * useAudioVisualizer Hook
 * Connects to the user's live microphone using Web Audio API (shared via AudioVisualizerService)
 * and returns real-time frequency spectrum levels (in pixels) and volume.
 *
 * Automatically releases audio stream and hardware resources when deactivated.
 */
export const useAudioVisualizer = (
  isActive: boolean,
  barCount: number = 14,
  minHeight: number = 4,
  maxHeight: number = 28
): AudioVisualizerResult => {
  const [audioLevels, setAudioLevels] = useState<number[]>(() => Array(barCount).fill(minHeight));
  const [volume, setVolume] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      setAudioLevels(Array(barCount).fill(minHeight));
      setVolume(0);
      return;
    }

    let isCancelled = false;
    let lastRenderTime = 0;

    const startAudioAnalysis = async () => {
      const analyser = await audioVisualizerService.acquire();
      if (isCancelled || !analyser) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const speechMaxBin = Math.min(bufferLength, 28);
      const step = Math.max(1, Math.floor(speechMaxBin / barCount));

      const renderFrame = () => {
        if (isCancelled) return;

        const now = performance.now();
        // Throttle React state updates to ~30 FPS (~33ms) to prevent render thrashing
        if (now - lastRenderTime >= 33) {
          lastRenderTime = now;
          analyser.getByteFrequencyData(dataArray);

          // Calculate average acoustic volume (normalized 0 to 1)
          let total = 0;
          for (let i = 0; i < speechMaxBin; i++) {
            total += dataArray[i];
          }
          const avgVolume = total / (speechMaxBin * 255);
          setVolume(avgVolume);

          // Map frequency spectrum to visualizer bars
          const levels: number[] = [];
          for (let i = 0; i < barCount; i++) {
            const binIdx = Math.min(bufferLength - 1, 1 + i * step);
            const rawVal = dataArray[binIdx] || 0;
            const normalized = rawVal / 255;
            const barH = Math.round(minHeight + normalized * (maxHeight - minHeight));
            levels.push(Math.max(minHeight, Math.min(maxHeight, barH)));
          }

          setAudioLevels(levels);
        }

        animFrameRef.current = requestAnimationFrame(renderFrame);
      };

      animFrameRef.current = requestAnimationFrame(renderFrame);
    };

    startAudioAnalysis();

    return () => {
      isCancelled = true;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      audioVisualizerService.release();
      setAudioLevels(Array(barCount).fill(minHeight));
      setVolume(0);
    };
  }, [isActive, barCount, minHeight, maxHeight]);

  return {
    audioLevels,
    volume,
    isVoiceActive: volume > 0.04,
  };
};
