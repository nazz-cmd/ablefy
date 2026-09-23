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

// Active audio element tracker and cancellation generation sequence
let currentAudioInstance: HTMLAudioElement | null = null;
let activeAudioGeneration = 0;

export const getAudioGeneration = (): number => activeAudioGeneration;
export const incrementAudioGeneration = (): number => ++activeAudioGeneration;

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
 * Play synthesized audio URL with full lifecycle management
 */
export const playAudioUrl = (
  audioUrl: string,
  options?: AudioPlaybackOptions
): Promise<HTMLAudioElement> => {
  stopAllAudio();

  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(audioUrl);
      if (options?.playbackRate) {
        audio.playbackRate = options.playbackRate;
      }
      currentAudioInstance = audio;

      audio.onplay = () => {
        options?.onStart?.();
      };

      audio.onended = () => {
        currentAudioInstance = null;
        options?.onEnd?.();
        resolve(audio);
      };

      audio.onerror = (e) => {
        currentAudioInstance = null;
        options?.onError?.(e);
        reject(e);
      };

      audio.play().catch((err) => {
        currentAudioInstance = null;
        options?.onError?.(err);
        reject(err);
      });
    } catch (err) {
      currentAudioInstance = null;
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
  if (currentAudioInstance) {
    try {
      currentAudioInstance.pause();
      currentAudioInstance.currentTime = 0;
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

  utterance.onstart = () => options?.onStart?.();
  utterance.onend = () => options?.onEnd?.();
  utterance.onerror = (e) => options?.onError?.(e);

  window.speechSynthesis.speak(utterance);
};
