// Microsoft Azure & Edge Neural Text-to-Speech Engine (id-ID)
// Powered by Microsoft Azure Neural Voices: Gadis & Ardi

export type AzureVoiceId = 'id-ID-GadisNeural' | 'id-ID-ArdiNeural';
export type AzurePersona = 'gadis' | 'ardi';

export interface AzureVoiceOption {
  id: AzureVoiceId;
  name: string;
  gender: 'FEMALE' | 'MALE';
  persona: AzurePersona;
  role: string;
  description: string;
  sampleText: string;
}

export const AZURE_INDONESIAN_VOICES: AzureVoiceOption[] = [
  {
    id: 'id-ID-GadisNeural',
    name: 'Gadis',
    gender: 'FEMALE',
    persona: 'gadis',
    role: 'Pemandu Ramah & Percakapan',
    description: 'Suara wanita Indonesia paling ekspresif dan alami. Memiliki artikulasi luwes, nada hangat, dan jeda bernapas seperti manusia asli.',
    sampleText: 'Halo! Saya Gadis, pemandu suara ramah Anda di Ablefy. Senang sekali bisa mendampingi Anda belajar dan membaca hari ini.'
  },
  {
    id: 'id-ID-ArdiNeural',
    name: 'Ardi',
    gender: 'MALE',
    persona: 'ardi',
    role: 'Narasumber & Narator Berwibawa',
    description: 'Suara pria tenang, berwibawa, dan mantap. Sangat pas untuk membaca dokumen, artikel informatif, materi bacaan, dan panduan sistem.',
    sampleText: 'Halo, saya Ardi. Saya siap membacakan dokumen dan materi bacaan Anda dengan artikulasi yang tenang dan jelas.'
  }
];

// Audio URL in-memory cache for instant 0ms playback on repeated phrases
const audioCache = new Map<string, string>();

// Active audio element tracker, shared instance for mobile unlock, and cancellation generation sequence
let sharedAudioInstance: HTMLAudioElement | null = null;
let sharedAudioContext: AudioContext | null = null;
let currentAudioInstance: HTMLAudioElement | null = null;
let activeAudioGeneration = 0;

export const getAudioGeneration = (): number => activeAudioGeneration;
export const incrementAudioGeneration = (): number => ++activeAudioGeneration;

export const getSharedAudio = (): HTMLAudioElement => {
  if (!sharedAudioInstance && typeof window !== 'undefined') {
    sharedAudioInstance = new Audio();
    sharedAudioInstance.setAttribute('playsinline', 'true');
    sharedAudioInstance.setAttribute('webkit-playsinline', 'true');
  }
  return sharedAudioInstance!;
};

export interface AudioPlaybackOptions {
  playbackRate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

/**
 * Synthesize speech via /api/tts endpoint (powered by Microsoft Azure Neural Voice Engine)
 */
export const synthesizeMicrosoftTts = async (
  text: string,
  options?: {
    voice?: AzureVoiceId;
    rate?: number;
  }
): Promise<string> => {
  const cleanText = text.trim();
  if (!cleanText) return '';

  const voiceId = options?.voice || 'id-ID-GadisNeural';
  const rate = options?.rate || 1.0;
  const cacheKey = `${voiceId}_${rate}_${cleanText}`;

  // Return cached Object URL if available
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: cleanText,
        voice: voiceId,
        rate: rate
      })
    });

    if (!response.ok) {
      throw new Error(`Server /api/tts mengembalikan status ${response.status}`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    audioCache.set(cacheKey, objectUrl);
    return objectUrl;
  } catch (err) {
    console.warn('Sintesis /api/tts gagal, mencoba jalur peramban lokal:', err);
    throw err;
  }
};

/**
 * Synchronously pre-unlock mobile browser audio stack within a user touch/click gesture
 */
export const unlockMobileAudio = (): void => {
  if (typeof window === 'undefined') return;
  try {
    const audio = getSharedAudio();
    if (!audio.src) {
      // 0.05s silent WAV
      audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      audio.play().then(() => {
        audio.pause();
      }).catch(() => {});
    }
  } catch (_) {}

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      if (!sharedAudioContext) {
        sharedAudioContext = new AudioCtx();
      }
      if (sharedAudioContext.state === 'suspended') {
        sharedAudioContext.resume().catch(() => {});
      }
    }
  } catch (_) {}

  if ('speechSynthesis' in window) {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (_) {}
  }
};

let isAudioPlaying = false;
let lastAudioEndTime = 0;
let hardwareAecStream: MediaStream | null = null;

/**
 * Enable hardware acoustic echo cancellation on device's audio chipset
 */
export const enableHardwareEchoCancellation = async (): Promise<void> => {
  if (hardwareAecStream) return;
  if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      hardwareAecStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
    } catch (_) {}
  }
};

export const isSystemAudioPlaying = (): boolean => {
  return isAudioPlaying || (Date.now() - lastAudioEndTime < 350);
};

/**
 * Play synthesized audio URL with full lifecycle management and mobile unlock resilience
 */
export const playAudioUrl = (
  audioUrl: string,
  options?: AudioPlaybackOptions
): Promise<HTMLAudioElement> => {
  stopAllAudio();

  return new Promise((resolve, reject) => {
    try {
      const audio = getSharedAudio();
      audio.src = audioUrl;
      if (options?.playbackRate) {
        audio.playbackRate = options.playbackRate;
      } else {
        audio.playbackRate = 1.0;
      }
      currentAudioInstance = audio;

      audio.onplay = () => {
        isAudioPlaying = true;
        if (typeof window !== 'undefined') {
          (window as any).__ablefyAudioPlaying = true;
          (window as any).__ablefyLastAudioEndTime = 0;
          window.dispatchEvent(new CustomEvent('ablefy-system-speaking', { detail: { speaking: true, url: audioUrl } }));
        }
        options?.onStart?.();
      };

      const handleAudioEnd = () => {
        isAudioPlaying = false;
        lastAudioEndTime = Date.now();
        currentAudioInstance = null;
        if (typeof window !== 'undefined') {
          (window as any).__ablefyAudioPlaying = false;
          (window as any).__ablefyLastAudioEndTime = Date.now();
          window.dispatchEvent(new CustomEvent('ablefy-system-speaking', { detail: { speaking: false } }));
        }
        options?.onEnd?.();
        resolve(audio);
      };

      audio.onended = handleAudioEnd;

      audio.onerror = (e) => {
        isAudioPlaying = false;
        lastAudioEndTime = Date.now();
        currentAudioInstance = null;
        if (typeof window !== 'undefined') {
          (window as any).__ablefyAudioPlaying = false;
          (window as any).__ablefyLastAudioEndTime = Date.now();
          window.dispatchEvent(new CustomEvent('ablefy-system-speaking', { detail: { speaking: false } }));
        }
        options?.onError?.(e);
        reject(e);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play request blocked or failed:', err);
          isAudioPlaying = false;
          lastAudioEndTime = Date.now();
          currentAudioInstance = null;
          if (typeof window !== 'undefined') {
            (window as any).__ablefyAudioPlaying = false;
            (window as any).__ablefyLastAudioEndTime = Date.now();
            window.dispatchEvent(new CustomEvent('ablefy-system-speaking', { detail: { speaking: false } }));
          }
          options?.onError?.(err);
          reject(err);
        });
      }
    } catch (err) {
      isAudioPlaying = false;
      lastAudioEndTime = Date.now();
      currentAudioInstance = null;
      if (typeof window !== 'undefined') {
        (window as any).__ablefyAudioPlaying = false;
        (window as any).__ablefyLastAudioEndTime = Date.now();
        window.dispatchEvent(new CustomEvent('ablefy-system-speaking', { detail: { speaking: false } }));
      }
      options?.onError?.(err);
      reject(err);
    }
  });
};

/**
 * Pause any currently active audio or speech synthesis
 */
export const pauseCurrentAudio = (): void => {
  if (currentAudioInstance) {
    try {
      currentAudioInstance.pause();
    } catch (_) {}
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.pause();
    } catch (_) {}
  }
};

/**
 * Resume paused audio or speech synthesis
 */
export const resumeCurrentAudio = (): void => {
  if (currentAudioInstance) {
    try {
      currentAudioInstance.play();
    } catch (_) {}
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.resume();
    } catch (_) {}
  }
};

/**
 * Stop any active audio element and browser speech synthesis
 */
export const stopAllAudio = (): void => {
  isAudioPlaying = false;
  lastAudioEndTime = Date.now();
  if (typeof window !== 'undefined') {
    (window as any).__ablefyAudioPlaying = false;
    (window as any).__ablefyLastAudioEndTime = Date.now();
    window.dispatchEvent(new CustomEvent('ablefy-system-speaking', { detail: { speaking: false } }));
  }

  if (currentAudioInstance) {
    try {
      currentAudioInstance.pause();
      currentAudioInstance.currentTime = 0;
      currentAudioInstance.onplay = null;
      currentAudioInstance.onended = null;
      currentAudioInstance.onerror = null;
    } catch (_) {}
    currentAudioInstance = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
};

/**
 * Asynchronously pre-fetch sentence into cache
 */
export const prefetchMicrosoftTts = async (
  text: string,
  options?: {
    voice?: AzureVoiceId;
    rate?: number;
  }
): Promise<void> => {
  try {
    if (text && text.trim()) {
      await synthesizeMicrosoftTts(text, options);
    }
  } catch (_) {
    // Ignore prefetch errors silently
  }
};

/**
 * Pre-cache standard UI audio cues in memory for instant 0ms playback on mobile & desktop
 */
export const prefetchCommonAudioCues = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  const commonCues = [
    'Panduan suara layar aktif',
    'Panduan suara layar dinonaktifkan',
    'Navigasi suara bebas tangan aktif',
    'Navigasi suara dinonaktifkan',
    'Beranda',
    'Transkrip Bicara',
    'Baca Isyarat',
    'Riwayat Aktivitas',
    'Pengaturan Suara',
    'Panel kanan dibuka',
    'Panel kanan ditutup',
    'Jeda mendengar',
    'Kontrol Suara'
  ];

  for (const text of commonCues) {
    try {
      await prefetchMicrosoftTts(text, { voice: 'id-ID-GadisNeural', rate: 1.0 });
    } catch (_) {}
  }
};

/**
 * Fallback via Web Speech API (prioritizing Microsoft Gadis/Ardi Natural if available in browser)
 */
export const speakWithBrowserAzureFallback = (
  text: string,
  voicePreference: AzureVoiceId = 'id-ID-GadisNeural',
  options?: {
    rate?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  stopAllAudio();

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch (_) {}

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = options?.rate || 1.0;

  const voices = window.speechSynthesis.getVoices();
  const idVoices = voices.filter((v) => v.lang.startsWith('id'));

  if (idVoices.length > 0) {
    const isMale = voicePreference === 'id-ID-ArdiNeural';
    const targetVoice = idVoices.find((v) => {
      const name = v.name.toLowerCase();
      if (isMale) {
        return name.includes('ardi') || name.includes('male') || name.includes('pria');
      }
      return name.includes('gadis') || name.includes('female') || name.includes('wanita') || name.includes('natural');
    });

    if (targetVoice) {
      utterance.voice = targetVoice;
    } else {
      utterance.voice = idVoices[0];
    }
  }

  // Pin utterance globally to prevent Chromium GC mid-speech
  (window as any).__ablefyActiveUtterance = utterance;

  utterance.onstart = () => options?.onStart?.();
  utterance.onend = () => {
    if ((window as any).__ablefyActiveUtterance === utterance) {
      (window as any).__ablefyActiveUtterance = null;
    }
    options?.onEnd?.();
  };
  utterance.onerror = (e) => {
    if ((window as any).__ablefyActiveUtterance === utterance) {
      (window as any).__ablefyActiveUtterance = null;
    }
    options?.onError?.(e);
  };

  window.speechSynthesis.speak(utterance);
};
