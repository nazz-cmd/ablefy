// Google Cloud Text-to-Speech (DeepMind WaveNet id-ID) Service with Smart Prosody & Audio Cache

export type VoicePersona = 'friendly' | 'educator' | 'casual';
export type GoogleVoiceId = 'id-ID-Wavenet-A' | 'id-ID-Wavenet-B' | 'id-ID-Wavenet-C' | 'id-ID-Wavenet-D';

export interface GoogleVoiceOption {
  id: GoogleVoiceId;
  name: string;
  gender: 'FEMALE' | 'MALE';
  persona: VoicePersona;
  description: string;
  sampleText: string;
}

export const GOOGLE_INDONESIAN_VOICES: GoogleVoiceOption[] = [
  {
    id: 'id-ID-Wavenet-A',
    name: 'Nadia (Pemandu Ramah)',
    gender: 'FEMALE',
    persona: 'friendly',
    description: 'Suara wanita ramah, hangat, dan artikulatif. Sangat cocok untuk panduan suara navigasi dan pendampingan disabilitas.',
    sampleText: 'Halo! Saya Nadia, pemandu suara ramah Anda di Ablefy, siap mendampingi setiap langkah belajar Anda.'
  },
  {
    id: 'id-ID-Wavenet-B',
    name: 'Budi (Narasumber Tenang)',
    gender: 'MALE',
    persona: 'educator',
    description: 'Suara pria tenang, berwibawa, dan jelas. Sangat ideal untuk membaca dokumen resmi, artikel, dan materi bacaan sehari-hari.',
    sampleText: 'Selamat datang di materi inklusif. Mari kita pelajari prinsip kesetaraan dan kemudahan aksesibilitas teknologi.'
  },
  {
    id: 'id-ID-Wavenet-D',
    name: 'Siti (Teman Santai)',
    gender: 'FEMALE',
    persona: 'casual',
    description: 'Suara wanita kasual, luwes, dan berirama natural layaknya berbincang santai dengan teman belajar.',
    sampleText: 'Hai! Yuk kita simak ringkasan materi hari ini dengan cara yang lebih mudah, menyenangkan, dan santai.'
  },
  {
    id: 'id-ID-Wavenet-C',
    name: 'Arif (Formal & Lugas)',
    gender: 'MALE',
    persona: 'educator',
    description: 'Suara pria formal, lugas, dan terstruktur untuk instruksi operasional dan laporan kepatuhan sistem.',
    sampleText: 'Sistem Ablefy telah memverifikasi dokumen Anda dengan standar kepatuhan aksesibilitas universal WCAG AAA.'
  }
];

// Audio in-memory cache to prevent redundant API calls for recurring UI voice cues
const audioCache = new Map<string, string>();

// Currently playing audio instance tracker
let currentAudioInstance: HTMLAudioElement | null = null;

/**
 * Check if Google Cloud TTS API key is configured (localStorage or Vite env)
 */
export const getGoogleTtsApiKey = (): string => {
  if (typeof window === 'undefined') return '';
  const localKey = localStorage.getItem('ablefy_gcloud_tts_key');
  if (localKey && localKey.trim()) return localKey.trim();

  // Vite environment variable fallback
  try {
    const envKey = (import.meta as any).env?.VITE_GOOGLE_TTS_API_KEY;
    if (envKey && typeof envKey === 'string' && envKey.trim()) {
      return envKey.trim();
    }
  } catch (_) {}

  return '';
};

export const setGoogleTtsApiKey = (key: string): void => {
  if (typeof window === 'undefined') return;
  if (!key.trim()) {
    localStorage.removeItem('ablefy_gcloud_tts_key');
  } else {
    localStorage.setItem('ablefy_gcloud_tts_key', key.trim());
  }
};

export const hasGoogleTtsApiKey = (): boolean => {
  return Boolean(getGoogleTtsApiKey());
};

/**
 * Generate human-like SSML with natural breathing pauses and emotional prosody
 */
export const generateSsml = (rawText: string, persona: VoicePersona = 'friendly'): string => {
  // Clean XML special chars
  let escaped = rawText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  // Insert natural human cadence pauses at punctuation
  escaped = escaped
    .replace(/,\s*/g, ', <break time="220ms"/> ')
    .replace(/([:;])\s*/g, '$1 <break time="260ms"/> ')
    .replace(/([.?!])\s+/g, '$1 <break time="380ms"/> ');

  let prosodyTag = '<prosody rate="98%" pitch="+1.2st">';
  if (persona === 'educator') {
    prosodyTag = '<prosody rate="95%" pitch="-0.8st">';
  } else if (persona === 'casual') {
    prosodyTag = '<prosody rate="102%" pitch="+0.4st">';
  }

  return `<speak>${prosodyTag}${escaped}</prosody></speak>`;
};

/**
 * Synthesize speech using Google Cloud Text-to-Speech REST API (WaveNet)
 */
export const synthesizeGoogleTts = async (
  text: string,
  options?: {
    apiKey?: string;
    voiceId?: GoogleVoiceId;
    persona?: VoicePersona;
    speakingRate?: number;
  }
): Promise<string> => {
  const apiKey = (options?.apiKey || getGoogleTtsApiKey()).trim();
  if (!apiKey) {
    throw new Error('Kunci API Google Cloud TTS belum diatur.');
  }

  const persona = options?.persona || 'friendly';
  const voiceId = options?.voiceId || (persona === 'educator' ? 'id-ID-Wavenet-B' : 'id-ID-Wavenet-A');
  const cacheKey = `${voiceId}_${persona}_${text.trim()}`;

  // Check cache first for instant 0ms playback
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  const ssml = generateSsml(text, persona);
  const voiceConfig = GOOGLE_INDONESIAN_VOICES.find((v) => v.id === voiceId) || GOOGLE_INDONESIAN_VOICES[0];

  const payload = {
    input: { ssml: ssml },
    voice: {
      languageCode: 'id-ID',
      name: voiceId,
      ssmlGender: voiceConfig.gender
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: options?.speakingRate || (persona === 'educator' ? 0.96 : 0.98),
      pitch: persona === 'friendly' ? 1.0 : persona === 'educator' ? -0.5 : 0.5,
      volumeGainDb: 0.0
    }
  };

  const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = errJson.error?.message || response.statusText;
    } catch (_) {
      errorDetail = response.statusText;
    }
    throw new Error(`Google Cloud TTS Gagal (${response.status}): ${errorDetail}`);
  }

  const data = await response.json();
  if (!data.audioContent) {
    throw new Error('Tidak ada konten audio yang dikembalikan oleh Google Cloud TTS.');
  }

  const base64Audio = data.audioContent;
  audioCache.set(cacheKey, base64Audio);
  return base64Audio;
};

export interface AudioPlayOptions {
  playbackRate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

/**
 * Play Base64 MP3 Audio with automatic lifecycle management
 */
export const playBase64Audio = (
  base64Audio: string,
  options?: AudioPlayOptions
): Promise<HTMLAudioElement> => {
  stopAllAudio();

  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
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
 * Pause currently active audio or speech synthesis
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
 * Stop any active HTML5 audio or browser speech synthesis
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
 * Prefetch sentence into cache asynchronously
 */
export const prefetchGoogleTts = async (
  text: string,
  options?: {
    apiKey?: string;
    voiceId?: GoogleVoiceId;
    persona?: VoicePersona;
    speakingRate?: number;
  }
): Promise<void> => {
  try {
    if (text && text.trim()) {
      await synthesizeGoogleTts(text, options);
    }
  } catch (_) {
    // Ignore prefetch errors silently
  }
};

/**
 * Smart Browser Neural Voice Engine (High-Performance Client-Side Fallback)
 * Automatically filters and selects the most natural Indonesian neural voice with tuned pitch & rate.
 */
export const speakWithSmartBrowserEngine = (
  text: string,
  persona: VoicePersona = 'friendly',
  options?: {
    rateMultiplier?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  stopAllAudio();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';

  // Tune pitch and rate according to human persona
  let baseRate = 0.96;
  if (persona === 'friendly') {
    utterance.pitch = 1.05;
    baseRate = 0.96;
  } else if (persona === 'educator') {
    utterance.pitch = 0.96;
    baseRate = 0.93;
  } else {
    utterance.pitch = 1.02;
    baseRate = 0.98;
  }

  const multiplier = options?.rateMultiplier || 1.0;
  utterance.rate = Math.max(0.5, Math.min(2.0, baseRate * multiplier));

  // Find the most natural Indonesian voice available in browser
  const allVoices = window.speechSynthesis.getVoices();
  const idVoices = allVoices.filter((v) => v.lang.startsWith('id'));

  if (idVoices.length > 0) {
    // Prioritize natural neural voices (e.g. Microsoft Gadis Natural, Microsoft Ardi Natural, Google Bahasa Indonesia)
    const naturalVoice = idVoices.find(
      (v) =>
        v.name.toLowerCase().includes('natural') ||
        v.name.toLowerCase().includes('online') ||
        v.name.toLowerCase().includes('google')
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    } else {
      utterance.voice = idVoices[0];
    }
  }

  utterance.onstart = () => options?.onStart?.();
  utterance.onend = () => options?.onEnd?.();
  utterance.onerror = (e) => options?.onError?.(e);

  window.speechSynthesis.speak(utterance);
};
