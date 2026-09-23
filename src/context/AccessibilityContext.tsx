import React, { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import {
  type VoicePersona,
  type GoogleVoiceId,
  getGoogleTtsApiKey,
  setGoogleTtsApiKey as saveGoogleApiKey,
  synthesizeGoogleTts,
  playBase64Audio,
  stopAllAudio as stopGoogleAudio
} from '../services/googleTtsService';
import {
  type AzureVoiceId,
  synthesizeMicrosoftTts,
  playAudioUrl,
  stopAllAudio as stopMicrosoftAudio,
  speakWithBrowserAzureFallback,
  getAudioGeneration,
  incrementAudioGeneration
} from '../services/microsoftTtsService';

export type ContrastMode = 'normal' | 'yellow-black' | 'high-dark' | 'monochrome';
export type FontScale = 'normal' | 'lg' | 'xl';
export type UserPersona = 'none' | 'vision' | 'hearing' | 'dyslexia' | 'motor' | 'educator';
export type VoiceEngineMode = 'microsoft-azure' | 'google-cloud' | 'browser-smart';
export type { VoicePersona, GoogleVoiceId, AzureVoiceId };

interface AccessibilityContextType {
  activePersona: UserPersona;
  applyPersona: (persona: UserPersona) => void;
  contrastMode: ContrastMode;
  setContrastMode: (mode: ContrastMode) => void;
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
  dyslexicMode: boolean;
  setDyslexicMode: (enabled: boolean) => void;
  readingRuler: boolean;
  setReadingRuler: (enabled: boolean) => void;
  voiceCues: boolean;
  setVoiceCues: (enabled: boolean) => void;
  tremorShield: boolean;
  setTremorShield: (enabled: boolean) => void;
  largeTargetMode: boolean;
  setLargeTargetMode: (enabled: boolean) => void;
  voiceNavActive: boolean;
  setVoiceNavActive: (enabled: boolean) => void;
  isShortcutsModalOpen: boolean;
  setIsShortcutsModalOpen: (open: boolean) => void;
  // Global Collapsible Right Sidebar / Panel
  isRightPanelOpen: boolean;
  setIsRightPanelOpen: (open: boolean) => void;
  toggleRightPanel: () => void;
  rulerY: number;
  // Natural Voice Engine Fields
  voiceEngine: VoiceEngineMode;
  setVoiceEngine: (engine: VoiceEngineMode) => void;
  voicePersona: VoicePersona;
  setVoicePersona: (persona: VoicePersona) => void;
  azureVoiceId: AzureVoiceId;
  setAzureVoiceId: (id: AzureVoiceId) => void;
  googleVoiceId: GoogleVoiceId;
  setGoogleVoiceId: (id: GoogleVoiceId) => void;
  googleApiKey: string;
  setGoogleApiKey: (key: string) => void;
  isGoogleTtsConfigured: boolean;
  speakText: (text: string, personaOverride?: VoicePersona) => void;
  speakCue: (text: string, personaOverride?: VoicePersona) => void;
  stopSpeech: () => void;
  isSpeaking: boolean;
  resetToDefault: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePersona, setActivePersonaState] = useState<UserPersona>(() => {
    return (localStorage.getItem('ablefy_persona') as UserPersona) || 'none';
  });

  const [contrastMode, setContrastModeState] = useState<ContrastMode>(() => {
    return (localStorage.getItem('ablefy_contrast') as ContrastMode) || 'normal';
  });

  const [fontScale, setFontScaleState] = useState<FontScale>(() => {
    return (localStorage.getItem('ablefy_font_scale') as FontScale) || 'normal';
  });

  const [dyslexicMode, setDyslexicModeState] = useState<boolean>(() => {
    return localStorage.getItem('ablefy_dyslexic') === 'true';
  });

  const [readingRuler, setReadingRulerState] = useState<boolean>(() => {
    return localStorage.getItem('ablefy_ruler') === 'true';
  });

  const [voiceCues, setVoiceCuesState] = useState<boolean>(() => {
    return localStorage.getItem('ablefy_voice_cues') === 'true';
  });

  const [tremorShield, setTremorShieldState] = useState<boolean>(() => {
    return localStorage.getItem('ablefy_tremor_shield') === 'true';
  });

  const [largeTargetMode, setLargeTargetModeState] = useState<boolean>(false);

  const [voiceNavActive, setVoiceNavActiveState] = useState<boolean>(() => {
    return localStorage.getItem('ablefy_voice_nav') === 'true';
  });

  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);

  // Global Collapsible Right Sidebar / Panel
  const [isRightPanelOpen, setIsRightPanelOpenState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ablefy_right_panel_open');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const setIsRightPanelOpen = (open: boolean) => {
    setIsRightPanelOpenState(open);
    try {
      localStorage.setItem('ablefy_right_panel_open', String(open));
    } catch (_) {}
  };

  const toggleRightPanel = () => {
    setIsRightPanelOpenState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ablefy_right_panel_open', String(next));
      } catch (_) {}
      speakCue(next ? 'Panel kanan dibuka' : 'Panel kanan ditutup');
      return next;
    });
  };

  // One-time automatic reset of rogue test flags in localStorage so users always return to clean standard
  useEffect(() => {
    try {
      if (localStorage.getItem('ablefy_v4_reset') !== 'true') {
        localStorage.removeItem('ablefy_large_targets');
        localStorage.removeItem('ablefy_font_scale');
        localStorage.removeItem('ablefy_persona');
        localStorage.setItem('ablefy_v4_reset', 'true');
        setLargeTargetModeState(false);
        setFontScaleState('normal');
        setActivePersonaState('none');
      }
    } catch {
      // ignore
    }
  }, []);

  // Mobile Audio Context & Web Speech Unlocker for iOS Safari and Android Chrome
  useEffect(() => {
    const unlockAudio = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          const silentUtterance = new SpeechSynthesisUtterance('');
          silentUtterance.volume = 0;
          window.speechSynthesis.speak(silentUtterance);
        } catch (_) {}
      }
    };

    window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
    window.addEventListener('click', unlockAudio, { once: true, passive: true });
    return () => {
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
  }, []);

  const [rulerY, setRulerY] = useState<number>(200);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Natural Voice Engine States (Defaults to Microsoft Azure Neural Engine - Free & Human-like)
  const [voiceEngine, setVoiceEngineState] = useState<VoiceEngineMode>(() => {
    return (localStorage.getItem('ablefy_voice_engine') as VoiceEngineMode) || 'microsoft-azure';
  });

  const [voicePersona, setVoicePersonaState] = useState<VoicePersona>(() => {
    return (localStorage.getItem('ablefy_voice_persona') as VoicePersona) || 'friendly';
  });

  const [azureVoiceId, setAzureVoiceIdState] = useState<AzureVoiceId>(() => {
    return (localStorage.getItem('ablefy_azure_voice_id') as AzureVoiceId) || 'id-ID-GadisNeural';
  });

  const [googleVoiceId, setGoogleVoiceIdState] = useState<GoogleVoiceId>(() => {
    return (localStorage.getItem('ablefy_google_voice_id') as GoogleVoiceId) || 'id-ID-Wavenet-A';
  });

  const [googleApiKey, setGoogleApiKeyState] = useState<string>(() => {
    return getGoogleTtsApiKey();
  });

  const isGoogleTtsConfigured = Boolean(googleApiKey && googleApiKey.trim());

  const setVoiceEngine = (engine: VoiceEngineMode) => {
    setVoiceEngineState(engine);
    localStorage.setItem('ablefy_voice_engine', engine);
  };

  const setAzureVoiceId = (id: AzureVoiceId) => {
    setAzureVoiceIdState(id);
    localStorage.setItem('ablefy_azure_voice_id', id);
  };

  const setVoicePersona = (persona: VoicePersona) => {
    setVoicePersonaState(persona);
    localStorage.setItem('ablefy_voice_persona', persona);
    if (persona === 'educator') {
      setAzureVoiceIdState('id-ID-ArdiNeural');
      setGoogleVoiceIdState('id-ID-Wavenet-B');
      localStorage.setItem('ablefy_azure_voice_id', 'id-ID-ArdiNeural');
      localStorage.setItem('ablefy_google_voice_id', 'id-ID-Wavenet-B');
    } else if (persona === 'casual') {
      setAzureVoiceIdState('id-ID-GadisNeural');
      setGoogleVoiceIdState('id-ID-Wavenet-D');
      localStorage.setItem('ablefy_azure_voice_id', 'id-ID-GadisNeural');
      localStorage.setItem('ablefy_google_voice_id', 'id-ID-Wavenet-D');
    } else {
      setAzureVoiceIdState('id-ID-GadisNeural');
      setGoogleVoiceIdState('id-ID-Wavenet-A');
      localStorage.setItem('ablefy_azure_voice_id', 'id-ID-GadisNeural');
      localStorage.setItem('ablefy_google_voice_id', 'id-ID-Wavenet-A');
    }
  };

  const setGoogleVoiceId = (id: GoogleVoiceId) => {
    setGoogleVoiceIdState(id);
    localStorage.setItem('ablefy_google_voice_id', id);
  };

  const setGoogleApiKey = (key: string) => {
    setGoogleApiKeyState(key);
    saveGoogleApiKey(key);
  };

  // Helper for voice feedback (Text-to-Speech)
  const speakText = async (text: string, personaOverride?: VoicePersona) => {
    if (!text || !text.trim()) return;
    const personaToUse = personaOverride || voicePersona;

    stopMicrosoftAudio();
    stopGoogleAudio();

    const requestGen = incrementAudioGeneration();

    // 1. Primary: Microsoft Azure Neural Voice Engine (id-ID-GadisNeural & id-ID-ArdiNeural)
    if (voiceEngine === 'microsoft-azure') {
      const targetVoice: AzureVoiceId = personaToUse === 'educator' ? 'id-ID-ArdiNeural' : 'id-ID-GadisNeural';
      try {
        setIsSpeaking(true);
        const audioUrl = await synthesizeMicrosoftTts(text, {
          voice: targetVoice,
          rate: 1.0
        });

        // Cancel if user clicked stop or disabled voice cues during fetch
        if (requestGen !== getAudioGeneration()) {
          setIsSpeaking(false);
          return;
        }

        await playAudioUrl(audioUrl, {
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false)
        });
        return;
      } catch (err) {
        console.warn('Microsoft Azure TTS failed, falling back to browser neural:', err);
      }
    }

    // 2. Secondary: Google Cloud WaveNet (if selected)
    if (voiceEngine === 'google-cloud' && isGoogleTtsConfigured) {
      try {
        setIsSpeaking(true);
        const base64Audio = await synthesizeGoogleTts(text, {
          apiKey: googleApiKey,
          voiceId: googleVoiceId,
          persona: personaToUse
        });

        // Cancel if user clicked stop or disabled voice cues during fetch
        if (requestGen !== getAudioGeneration()) {
          setIsSpeaking(false);
          return;
        }

        await playBase64Audio(base64Audio, {
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false)
        });
        return;
      } catch (err) {
        console.warn('Google Cloud TTS failed, seamlessly falling back to browser:', err);
      }
    }

    // 3. Fallback: Browser Native Azure / Neural Voice Engine
    if (requestGen !== getAudioGeneration()) {
      setIsSpeaking(false);
      return;
    }

    speakWithBrowserAzureFallback(text, personaToUse === 'educator' ? 'id-ID-ArdiNeural' : 'id-ID-GadisNeural', {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const voiceCuesRef = useRef<boolean>(voiceCues);
  voiceCuesRef.current = voiceCues;

  const stopSpeech = () => {
    incrementAudioGeneration();
    stopMicrosoftAudio();
    stopGoogleAudio();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
    setIsSpeaking(false);
  };

  // Zero-latency local Web Speech synthesis for instant UI navigation cues (0-10ms delay, no network lag)
  const speakInstantCue = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 1.15; // slightly faster for snappy responsive UI feedback

      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find((v) => v.lang.startsWith('id') || v.lang.includes('ID'));
      if (idVoice) {
        utterance.voice = idVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('speakInstantCue error:', err);
    }
  };

  // Safe voice cue helper: Instant zero-latency speech for UI navigation cues (0ms delay)
  const speakCue = (text: string, _personaOverride?: VoicePersona) => {
    if (!voiceCuesRef.current) return;
    speakInstantCue(text);
  };

  const applyPersona = (persona: UserPersona) => {
    setActivePersonaState(persona);
    localStorage.setItem('ablefy_persona', persona);

    if (persona === 'vision') {
      setContrastModeState('yellow-black');
      setFontScaleState('lg');
      setDyslexicModeState(false);
      setReadingRulerState(false);
      setVoiceCuesState(true);
      voiceCuesRef.current = true;
      setLargeTargetModeState(false);
      setTremorShieldState(false);
      localStorage.setItem('ablefy_contrast', 'yellow-black');
      localStorage.setItem('ablefy_font_scale', 'lg');
      localStorage.setItem('ablefy_dyslexic', 'false');
      localStorage.setItem('ablefy_ruler', 'false');
      localStorage.setItem('ablefy_voice_cues', 'true');
      speakText('Profil Penglihatan Rendah dan Tunanetra aktif. Kontras tinggi kuning di atas hitam dan panduan suara diaktifkan.');
    } else if (persona === 'hearing') {
      setContrastModeState('normal');
      setFontScaleState('normal');
      setDyslexicModeState(false);
      setReadingRulerState(false);
      setVoiceCuesState(false);
      voiceCuesRef.current = false;
      setLargeTargetModeState(false);
      setTremorShieldState(false);
      localStorage.setItem('ablefy_contrast', 'normal');
      localStorage.setItem('ablefy_font_scale', 'normal');
      localStorage.setItem('ablefy_dyslexic', 'false');
      localStorage.setItem('ablefy_ruler', 'false');
      localStorage.setItem('ablefy_voice_cues', 'false');
    } else if (persona === 'dyslexia') {
      setContrastModeState('normal');
      setFontScaleState('normal');
      setDyslexicModeState(true);
      setReadingRulerState(true);
      setVoiceCuesState(false);
      voiceCuesRef.current = false;
      setLargeTargetModeState(false);
      setTremorShieldState(false);
      localStorage.setItem('ablefy_contrast', 'normal');
      localStorage.setItem('ablefy_font_scale', 'normal');
      localStorage.setItem('ablefy_dyslexic', 'true');
      localStorage.setItem('ablefy_ruler', 'true');
      localStorage.setItem('ablefy_voice_cues', 'false');
      speakText('Profil Disleksia dan Fokus aktif. Tipografi OpenDyslexic dan garis pemandu membaca telah diaktifkan.');
    } else if (persona === 'motor') {
      setContrastModeState('normal');
      setFontScaleState('lg');
      setDyslexicModeState(false);
      setReadingRulerState(false);
      setVoiceCuesState(true);
      voiceCuesRef.current = true;
      setLargeTargetModeState(true);
      setTremorShieldState(true);
      setVoiceNavActiveState(true);
      localStorage.setItem('ablefy_contrast', 'normal');
      localStorage.setItem('ablefy_font_scale', 'lg');
      localStorage.setItem('ablefy_dyslexic', 'false');
      localStorage.setItem('ablefy_ruler', 'false');
      localStorage.setItem('ablefy_voice_cues', 'true');
      localStorage.setItem('ablefy_large_targets', 'true');
      localStorage.setItem('ablefy_tremor_shield', 'true');
      localStorage.setItem('ablefy_voice_nav', 'true');
      speakText('Profil Keterbatasan Fisik dan Motorik aktif. Navigasi suara bebas tangan, target tombol besar, dan pelindung tremor diaktifkan.');
    } else if (persona === 'educator') {
      resetToDefault();
      speakText('Profil Pendidik dan Auditor diaktifkan.');
    }
  };

  const setTremorShield = (enabled: boolean) => {
    setTremorShieldState(enabled);
    localStorage.setItem('ablefy_tremor_shield', String(enabled));
    speakCue(enabled ? 'Pelindung tremor diaktifkan' : 'Pelindung tremor dinonaktifkan');
  };

  const setLargeTargetMode = (enabled: boolean) => {
    setLargeTargetModeState(enabled);
    localStorage.setItem('ablefy_large_targets', String(enabled));
    speakCue(enabled ? 'Target tombol besar diaktifkan' : 'Target tombol kembali normal');
  };

  const setVoiceNavActive = (enabled: boolean) => {
    setVoiceNavActiveState(enabled);
    localStorage.setItem('ablefy_voice_nav', String(enabled));
    speakCue(enabled ? 'Navigasi suara bebas tangan aktif' : 'Navigasi suara dinonaktifkan');
  };

  const setContrastMode = (mode: ContrastMode) => {
    setContrastModeState(mode);
    localStorage.setItem('ablefy_contrast', mode);
    const labels: Record<ContrastMode, string> = {
      'normal': 'Mode kontras standar diaktifkan',
      'yellow-black': 'Mode kontras tinggi kuning di atas hitam diaktifkan',
      'high-dark': 'Mode kontras gelap pekat diaktifkan',
      'monochrome': 'Mode monokrom diaktifkan'
    };
    speakCue(labels[mode]);
  };

  const setFontScale = (scale: FontScale) => {
    setFontScaleState(scale);
    localStorage.setItem('ablefy_font_scale', scale);
    const labels: Record<FontScale, string> = {
      'normal': 'Ukuran teks normal',
      'lg': 'Ukuran teks besar',
      'xl': 'Ukuran teks sangat besar'
    };
    speakCue(labels[scale]);
  };

  const setDyslexicMode = (enabled: boolean) => {
    setDyslexicModeState(enabled);
    localStorage.setItem('ablefy_dyslexic', String(enabled));
    speakCue(enabled ? 'Font ramah disleksia diaktifkan' : 'Font disleksia dimatikan');
  };

  const setReadingRuler = (enabled: boolean) => {
    setReadingRulerState(enabled);
    localStorage.setItem('ablefy_ruler', String(enabled));
    speakCue(enabled ? 'Garis panduan membaca diaktifkan' : 'Garis panduan membaca dimatikan');
  };

  const setVoiceCues = (enabled: boolean) => {
    setVoiceCuesState(enabled);
    voiceCuesRef.current = enabled;
    try {
      localStorage.setItem('ablefy_voice_cues', String(enabled));
    } catch (_) {}
    if (enabled) {
      speakText('Panduan suara layar diaktifkan');
    } else {
      // Immediately silence any playing audio and cancel any queued synthesis
      stopSpeech();
    }
  };

  const resetToDefault = () => {
    stopSpeech();
    setActivePersonaState('none');
    setContrastModeState('normal');
    setFontScaleState('normal');
    setDyslexicModeState(false);
    setReadingRulerState(false);
    setVoiceCuesState(false);
    voiceCuesRef.current = false;
    setTremorShieldState(false);
    setLargeTargetModeState(false);
    setVoiceNavActiveState(false);
    localStorage.removeItem('ablefy_persona');
    localStorage.removeItem('ablefy_contrast');
    localStorage.removeItem('ablefy_font_scale');
    localStorage.removeItem('ablefy_dyslexic');
    localStorage.removeItem('ablefy_ruler');
    localStorage.setItem('ablefy_voice_cues', 'false');
    localStorage.removeItem('ablefy_tremor_shield');
    localStorage.removeItem('ablefy_large_targets');
    localStorage.removeItem('ablefy_voice_nav');
  };

  // Tremor Shield: Global click debounce buffer (prevents involuntary jitter double-clicks < 450ms)
  useEffect(() => {
    if (!tremorShield) return;

    let lastClickTime = 0;
    const handleGlobalClick = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastClickTime < 450) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return;
      }
      lastClickTime = now;
    };

    window.addEventListener('click', handleGlobalClick, true);
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, [tremorShield]);

  // Update body classes whenever state changes
  useEffect(() => {
    const classList: string[] = [];

    if (contrastMode === 'yellow-black') classList.push('mode-yellow-black');
    else if (contrastMode === 'high-dark') classList.push('mode-high-dark');
    else if (contrastMode === 'monochrome') classList.push('mode-monochrome');

    if (fontScale === 'lg') classList.push('font-scale-lg');
    else if (fontScale === 'xl') classList.push('font-scale-xl');

    if (dyslexicMode) classList.push('mode-dyslexic');

    // Synchronize html root for global rem font scaling (WCAG 1.4.4)
    document.documentElement.classList.remove('font-scale-normal', 'font-scale-lg', 'font-scale-xl');
    if (fontScale === 'lg') document.documentElement.classList.add('font-scale-lg');
    else if (fontScale === 'xl') document.documentElement.classList.add('font-scale-xl');
    else document.documentElement.classList.add('font-scale-normal');

    document.body.className = `bg-slate-50 text-slate-900 transition-colors duration-200 antialiased ${classList.join(' ')}`;
  }, [contrastMode, fontScale, dyslexicMode]);

  // Track mouse position for Reading Ruler
  useEffect(() => {
    if (!readingRuler) return;

    const handleMouseMove = (e: MouseEvent) => {
      setRulerY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingRuler]);

  return (
    <AccessibilityContext.Provider
      value={{
        activePersona,
        applyPersona,
        contrastMode,
        setContrastMode,
        fontScale,
        setFontScale,
        dyslexicMode,
        setDyslexicMode,
        readingRuler,
        setReadingRuler,
        voiceCues,
        setVoiceCues,
        tremorShield,
        setTremorShield,
        largeTargetMode,
        setLargeTargetMode,
        voiceNavActive,
        setVoiceNavActive,
        isShortcutsModalOpen,
        setIsShortcutsModalOpen,
        isRightPanelOpen,
        setIsRightPanelOpen,
        toggleRightPanel,
        rulerY,
        // Natural Voice Engine Fields
        voiceEngine,
        setVoiceEngine,
        voicePersona,
        setVoicePersona,
        azureVoiceId,
        setAzureVoiceId,
        googleVoiceId,
        setGoogleVoiceId,
        googleApiKey,
        setGoogleApiKey,
        isGoogleTtsConfigured,
        speakText,
        speakCue,
        stopSpeech,
        isSpeaking,
        resetToDefault,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
