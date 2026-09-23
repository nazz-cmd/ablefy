/**
 * AudioVisualizerService
 * Singleton Web Audio API manager that shares a single microphone MediaStream
 * and AnalyserNode across all visualizer components in Ablefy.
 *
 * Prevents multiple conflicting microphone accesses, ensures high performance,
 * and cleanly stops media tracks and closes AudioContext when no longer used.
 */

class AudioVisualizerService {
  private static instance: AudioVisualizerService;
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private refCount: number = 0;
  private pendingPromise: Promise<AnalyserNode | null> | null = null;

  private constructor() {}

  public static getInstance(): AudioVisualizerService {
    if (!AudioVisualizerService.instance) {
      AudioVisualizerService.instance = new AudioVisualizerService();
    }
    return AudioVisualizerService.instance;
  }

  public async acquire(): Promise<AnalyserNode | null> {
    this.refCount++;

    if (this.analyser && this.audioContext && this.audioContext.state !== 'closed') {
      if (this.audioContext.state === 'suspended') {
        try {
          await this.audioContext.resume();
        } catch (_) {}
      }
      return this.analyser;
    }

    if (this.pendingPromise) {
      return this.pendingPromise;
    }

    this.pendingPromise = (async () => {
      try {
        if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
          return null;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });

        this.stream = stream;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return null;

        const ctx = new AudioContextClass();
        this.audioContext = ctx;

        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128; // 64 frequency bins - optimal voice resolution
        analyser.smoothingTimeConstant = 0.65;
        source.connect(analyser);

        this.analyser = analyser;
        return analyser;
      } catch (err) {
        console.warn('Microphone access for visualizer not granted or unavailable:', err);
        return null;
      } finally {
        this.pendingPromise = null;
      }
    })();

    return this.pendingPromise;
  }

  public release(): void {
    this.refCount = Math.max(0, this.refCount - 1);

    if (this.refCount === 0) {
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
        this.stream = null;
      }
      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close().catch(() => {});
        this.audioContext = null;
      }
      this.analyser = null;
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }
}

export const audioVisualizerService = AudioVisualizerService.getInstance();
