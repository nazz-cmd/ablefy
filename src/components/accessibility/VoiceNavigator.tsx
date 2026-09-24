import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  X,
  Check,
  Sparkles
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { classifyIndonesianVoiceIntent } from '../../utils/nlpIntentClassifier';
import { RealtimeAudioWave } from '../common/RealtimeAudioWave';

interface VoiceNavigatorProps {
  onNavigateTab: (tabId: string) => void;
  activeTab?: string;
}

export const VoiceNavigator: React.FC<VoiceNavigatorProps> = ({ onNavigateTab, activeTab }) => {
  const {
    voiceNavActive,
    setVoiceNavActive,
    setContrastMode,
    setFontScale,
    setDyslexicMode,
    setReadingRuler,
    voiceCues,
    setVoiceCues,
    setIsShortcutsModalOpen,
    speakText,
    speakCue,
    isSpeaking
  } = useAccessibility();

  const [isListening, setIsListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isLiveTranscribing, setIsLiveTranscribing] = useState<boolean>(false);
  const [hintIndex, setHintIndex] = useState<number>(0);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [customCommandInput, setCustomCommandInput] = useState<string>('');

  const isSpeechSupported = typeof window !== 'undefined' && Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  const ROTATING_HINTS = [
    'Katakan: "Buka beranda"',
    'Katakan: "Mulai transkrip"',
    'Katakan: "Putar suara"',
    'Katakan: "Baca salinan"',
    'Katakan: "Kontras kuning"',
    'Katakan: "Mode disleksia"',
    'Katakan: "Bahasa isyarat"',
    'Katakan: "Perbesar teks"'
  ];

  const recognitionRef = useRef<any>(null);
  const voiceNavActiveRef = useRef<boolean>(voiceNavActive);
  const permissionErrorRef = useRef<string | null>(null);
  const lastCommandTimeRef = useRef<number>(0);
  const restartTimeoutRef = useRef<any>(null);
  const isLiveTranscribingRef = useRef<boolean>(false);

  voiceNavActiveRef.current = voiceNavActive;
  permissionErrorRef.current = permissionError;
  isLiveTranscribingRef.current = isLiveTranscribing;

  // Listen to live lecture recording status to prevent mic conflicts
  useEffect(() => {
    const handleRecordingStatus = (e: Event) => {
      const customEvent = e as CustomEvent<{ isRecording: boolean }>;
      const recording = !!customEvent.detail?.isRecording;
      setIsLiveTranscribing(recording);
      isLiveTranscribingRef.current = recording;
      if (recording) {
        // LectureCompanion is actively recording: release VoiceNavigator mic instance
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch (_) {}
          recognitionRef.current = null;
        }
        setIsListening(false);
      }
    };

    window.addEventListener('ablefy-recording-status', handleRecordingStatus);
    return () => window.removeEventListener('ablefy-recording-status', handleRecordingStatus);
  }, []);

  // Rotate helpful voice hints periodically when idle
  useEffect(() => {
    if (!isListening || liveTranscript || successMessage) return;
    const interval = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % ROTATING_HINTS.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isListening, liveTranscript, successMessage]);

  const lastSpokenResponseRef = useRef<string>('');
  const lastSpokenResponseTimeRef = useRef<number>(0);

  const dispatchAction = (action: string, payload?: any, label?: string) => {
    lastCommandTimeRef.current = Date.now();
    if (label) {
      setSuccessMessage(label);
      lastSpokenResponseRef.current = label;
      lastSpokenResponseTimeRef.current = Date.now();
      if (voiceCues) {
        speakText(label);
      }
      setTimeout(() => {
        setSuccessMessage('');
      }, 3500);
    }
    window.dispatchEvent(new CustomEvent('ablefy-action', { detail: { action, payload } }));
  };

  /**
   * Smart Semantic UI Clicker: Finds visible interactive buttons, links, or inputs
   * matching spoken phrases (e.g. "klik mulai transkrip", "klik salin", "klik kartu salam")
   */
  const attemptVoiceElementClick = (rawPhrase: string): string | null => {
    if (!rawPhrase || !rawPhrase.trim()) return null;
    const clean = rawPhrase.toLowerCase().trim();

    // Strip conversational click verbs to get the target phrase
    let target = clean
      .replace(/^(tolong|coba|bisa|mohon)?\s*(klik|tekan|pencet|pilih|buka|sentuh)\s*(tombol|menu|pilihan|kartu)?\s*/i, '')
      .trim();

    if (!target || target.length < 2) return null;

    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>(
        'button, a, [role="button"], input[type="button"], input[type="submit"], [tabindex="0"]'
      )
    );

    let bestMatch: HTMLElement | null = null;
    let bestLabel = '';
    let highestScore = 0;

    for (const el of candidates) {
      if (el.offsetParent === null && el.offsetWidth === 0 && el.offsetHeight === 0) continue;
      if (el.getAttribute('aria-hidden') === 'true') continue;

      const text = (el.innerText || '').toLowerCase().trim();
      const aria = (el.getAttribute('aria-label') || '').toLowerCase().trim();
      const title = (el.getAttribute('title') || '').toLowerCase().trim();
      const testId = (el.getAttribute('data-voice-target') || '').toLowerCase().trim();

      const fullLabel = aria || text || title || testId;
      if (!fullLabel) continue;

      // Exact match
      if (fullLabel === target || text === target || aria === target) {
        bestMatch = el;
        bestLabel = el.getAttribute('aria-label') || el.innerText || target;
        highestScore = 100;
        break;
      }

      // Target contained in element label
      if (fullLabel.includes(target) || (target.length >= 4 && fullLabel.split(/\s+/).some((w) => w.startsWith(target)))) {
        const score = (target.length / fullLabel.length) * 50 + 40;
        if (score > highestScore) {
          highestScore = score;
          bestMatch = el;
          bestLabel = el.getAttribute('aria-label') || el.innerText || target;
        }
      }

      // Element text contained in target
      if (text.length >= 3 && target.includes(text)) {
        const score = (text.length / target.length) * 40 + 30;
        if (score > highestScore) {
          highestScore = score;
          bestMatch = el;
          bestLabel = el.getAttribute('aria-label') || el.innerText || target;
        }
      }
    }

    if (bestMatch && highestScore >= 35) {
      try {
        bestMatch.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        bestMatch.classList.add('ring-4', 'ring-blue-500', 'ring-offset-2');
        setTimeout(() => {
          bestMatch?.classList.remove('ring-4', 'ring-blue-500', 'ring-offset-2');
        }, 1500);

        bestMatch.click();
        return bestLabel.slice(0, 30);
      } catch (_) {}
    }

    return null;
  };

  const processCommand = (phrase: string): boolean => {
    const phraseLower = phrase.toLowerCase().trim();

    // 1. Two-way echo suppression: filter audio feedback ONLY if Ablefy is currently speaking right now
    const now = Date.now();
    const isCurrentlySpeaking = isSpeaking || (now - lastSpokenResponseTimeRef.current < 1800);
    if (isCurrentlySpeaking && lastSpokenResponseRef.current) {
      const spokenLower = lastSpokenResponseRef.current.toLowerCase();
      if (phraseLower === spokenLower || (phraseLower.length > 5 && spokenLower.includes(phraseLower))) {
        return false;
      }
    }

    // 2. High-level NLP Intent Classification (Indonesian Conversational AI)
    const intent = classifyIndonesianVoiceIntent(phrase, {
      isRecording: isLiveTranscribingRef.current
    });
    if (intent) {
      lastSpokenResponseRef.current = intent.label;

      // Module navigation
      if (intent.targetTab) {
        onNavigateTab(intent.targetTab);
      }

      // Direct accessibility updates
      if (intent.action === 'SET_CONTRAST' && intent.payload) {
        setContrastMode(intent.payload);
      } else if (intent.action === 'SET_DYSLEXIC' && typeof intent.payload === 'boolean') {
        setDyslexicMode(intent.payload);
      } else if (intent.action === 'SET_RULER' && typeof intent.payload === 'boolean') {
        setReadingRuler(intent.payload);
      } else if (intent.action === 'SET_FONT_SCALE' && intent.payload) {
        setFontScale(intent.payload);
      } else if (intent.action === 'SET_VOICE_CUES' && typeof intent.payload === 'boolean') {
        setVoiceCues(intent.payload);
      } else if (intent.action === 'OPEN_SHORTCUTS') {
        setIsShortcutsModalOpen(true);
      } else if (intent.action === 'CLOSE_MODAL') {
        setIsShortcutsModalOpen(false);
      } else if (intent.action === 'STOP_VOICE_NAV') {
        setVoiceNavActive(false);
      }

      dispatchAction(intent.action, intent.payload, intent.label);
      return true;
    }

    // 3. Fallback: Semantic UI Clicker ("klik [nama tombol]", "tekan [opsi]")
    // When live recording is active, ONLY click if user explicitly used click verbs like "klik", "tekan", "pencet"
    const isExplicitClickPrefix = /^(tolong|coba|bisa|mohon)?\s*(klik|tekan|pencet)\b/i.test(phrase.trim());
    if (!isLiveTranscribingRef.current || isExplicitClickPrefix) {
      const clickedLabel = attemptVoiceElementClick(phrase);
      if (clickedLabel) {
        const msg = `Mengklik ${clickedLabel}`;
        lastSpokenResponseRef.current = msg;
        dispatchAction('CLICK_ELEMENT', { label: clickedLabel }, msg);
        return true;
      }
    }

    return false;
  };

  const startRecognition = () => {
    if (!voiceNavActiveRef.current || permissionErrorRef.current) return;

    const SpeechAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechAPI) {
      // Browser like Firefox without Web Speech Recognition enabled
      setIsListening(false);
      return;
    }

    // Completely abort and unbind previous instance to prevent deadlocks and leaks
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (_) {}
      recognitionRef.current = null;
    }

    try {
      const recognition = new SpeechAPI();
      // On mobile, continuous MUST be false for reliable utterance recognition on Android Chrome
      recognition.continuous = !isMobile;
      recognition.interimResults = true;
      recognition.lang = 'id-ID';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setPermissionError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            final += (item[0]?.transcript || '') + ' ';
          } else {
            interim += (item[0]?.transcript || '') + ' ';
          }
        }

        final = final.trim();
        interim = interim.trim();

        const activeText = (final || interim).toLowerCase().trim();
        if (!activeText) return;

        setLiveTranscript(activeText);

        const now = Date.now();
        if (now - lastCommandTimeRef.current < 600) return;

        const isCommand = processCommand(activeText);
        if (isCommand) {
          setLiveTranscript('');
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setPermissionError('Akses mikrofon diblokir. Klik ikon gembok di sebelah URL browser untuk mengizinkan mikrofon.');
          setIsListening(false);
          return;
        }
        // For benign browser errors ('audio-capture', 'no-speech', 'aborted', 'network'):
        // Do NOT permanently lock permissionError! onend handles clean seamless restart.
      };

      recognition.onend = () => {
        setIsListening(false);

        // On desktop: auto-restart seamlessly
        // On mobile: return to quiet standby ("Ketuk untuk bicara") unless user gave a command recently
        const shouldAutoRestart = voiceNavActiveRef.current && !permissionErrorRef.current && typeof document !== 'undefined' && document.visibilityState !== 'hidden';

        if (shouldAutoRestart && !isMobile && !isLiveTranscribingRef.current) {
          clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            if (voiceNavActiveRef.current && !permissionErrorRef.current && !isLiveTranscribingRef.current) {
              startRecognition();
            }
          }, 600);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Start recognition instance error, will retry in 1s:', err);
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = setTimeout(() => {
        if (voiceNavActiveRef.current && !permissionErrorRef.current && typeof document !== 'undefined' && document.visibilityState !== 'hidden') {
          startRecognition();
        }
      }, 1000);
    }
  };

  const toggleListening = () => {
    setPermissionError(null);
    if (activeTab === 'lecture') {
      // In lecture mode: tapping the mic starts/stops lecture recording directly!
      if (isLiveTranscribingRef.current) {
        dispatchAction('STOP_RECORDING');
      } else {
        dispatchAction('START_RECORDING');
      }
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
      setIsListening(false);
    } else {
      startRecognition();
    }
  };

  const requestMicrophoneAccess = () => {
    toggleListening();
  };

  // Re-engage voice recognition automatically when desktop app returns to foreground
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!isMobile && document.visibilityState === 'visible' && voiceNavActiveRef.current && !permissionErrorRef.current && !isLiveTranscribingRef.current) {
        startRecognition();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isMobile]);

  useEffect(() => {
    if (voiceNavActive) {
      // On desktop, auto-start hands-free; on mobile, wait for user gesture tap
      if (!isMobile) {
        requestMicrophoneAccess();
      }
    } else {
      clearTimeout(restartTimeoutRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
        recognitionRef.current = null;
      }
      setIsListening(false);
      setLiveTranscript('');
      setSuccessMessage('');
      setPermissionError(null);
    }

    return () => {
      clearTimeout(restartTimeoutRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
        recognitionRef.current = null;
      }
    };
  }, [voiceNavActive]);

  if (!voiceNavActive) {
    return (
      <div className="fixed bottom-20 lg:bottom-6 right-3 sm:right-6 z-40 select-none animate-in fade-in">
        <button
          onClick={() => {
            setVoiceNavActive(true);
            speakCue('Navigasi suara diaktifkan');
          }}
          className="flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-950 text-white border border-slate-700/80 shadow-2xl backdrop-blur-md active:scale-95 transition-all group"
          title="Nyalakan Kontrol Suara (V)"
          aria-label="Nyalakan Kontrol Suara (V)"
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-rose-600 text-white shadow-xs group-hover:scale-105 transition-transform">
            <Mic className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-200 group-hover:text-white pr-0.5">
            Kontrol Suara
          </span>
          <kbd className="hidden sm:inline text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">
            V
          </kbd>
        </button>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Kontrol Navigasi Suara Bebas Tangan"
      className="fixed bottom-20 lg:bottom-6 right-3 sm:right-6 z-50 flex flex-col items-end select-none"
    >
      {/* Optional Interactive Command Palette Popover (Shown when Sparkles icon or Pilih Aksi is clicked) */}
      {showHelp && (
        <div className="mb-2.5 w-76 sm:w-84 p-3.5 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-white/10 shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1.5 border-b border-slate-800">
            <span className="font-bold flex items-center gap-1.5 text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Daftar Perintah Suara & Pintasan</span>
            </span>
            <button
              onClick={() => setShowHelp(false)}
              className="text-slate-400 hover:text-white text-xs font-semibold px-1 rounded hover:bg-slate-800"
            >
              ✕
            </button>
          </div>

          {/* Quick 1-Tap Command Action Chips (Works in 100% of browsers including Firefox & Safari) */}
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: '🎙️ Transkrip Live', text: 'mulai transkrip' },
              { label: '⏹️ Hentikan', text: 'hentikan transkrip' },
              { label: '🔊 Putar Suara', text: 'putar suara' },
              { label: '⏸️ Jeda Suara', text: 'jeda suara' },
              { label: '📋 Baca Salinan', text: 'baca salinan' },
              { label: '☀️ Kontras Kuning', text: 'kontras kuning' },
              { label: '📖 Font Disleksia', text: 'mode disleksia' },
              { label: '🏠 Beranda', text: 'beranda' },
              { label: '🤟 Bahasa Isyarat', text: 'bahasa isyarat' },
              { label: '🔍 Perbesar Teks', text: 'perbesar teks' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  processCommand(item.text);
                  setShowHelp(false);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-800 hover:border-slate-700 transition text-left truncate active:scale-95"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Fallback Text Command Form: Type any command manually */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customCommandInput.trim()) {
                processCommand(customCommandInput.trim());
                setCustomCommandInput('');
                setShowHelp(false);
              }
            }}
            className="flex items-center gap-1.5 pt-2 border-t border-slate-800"
          >
            <input
              type="text"
              value={customCommandInput}
              onChange={(e) => setCustomCommandInput(e.target.value)}
              placeholder="Ketik perintah (cth: buka beranda)..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition shrink-0 active:scale-95"
            >
              Kirim
            </button>
          </form>
        </div>
      )}

      {/* Sleek Floating Dynamic Island Pill */}
      <div className={`flex items-center gap-2.5 sm:gap-3 px-3 py-2 rounded-full backdrop-blur-xl bg-slate-950/90 text-white border transition-all duration-300 shadow-2xl ${
        !isSpeechSupported
          ? 'border-amber-500/60 ring-1 ring-amber-500/30'
          : permissionError
          ? 'border-rose-500/80 bg-rose-950/90 ring-2 ring-rose-500/40'
          : isLiveTranscribing
          ? 'border-rose-500/70 ring-2 ring-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.4)]'
          : isListening
          ? 'border-cyan-500/50 ring-2 ring-cyan-500/25 shadow-[0_0_25px_rgba(6,182,212,0.35)]'
          : 'border-slate-800'
      }`}>
        {/* Glowing Animated Microphone Orb */}
        <button
          onClick={toggleListening}
          className="relative flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white shadow-md active:scale-95 transition-transform"
          title={isLiveTranscribing ? "Hentikan perekaman" : isListening ? "Klik untuk jeda mendengar" : activeTab === 'lecture' ? "Mulai rekam transkrip" : "Klik untuk bicara"}
        >
          {(isListening || isLiveTranscribing) && (
            <span className={`absolute -inset-1 rounded-full ${
              isLiveTranscribing
                ? 'bg-rose-500 opacity-60 animate-ping'
                : 'bg-cyan-400 opacity-50 animate-pulse'
            } blur-[2px]`} />
          )}
          <Mic className="w-4 h-4 relative z-10" />
        </button>

        {/* Dynamic Center Stage: Living animations & zero text clutter */}
        <div
          onClick={!isListening ? toggleListening : undefined}
          className={`min-w-0 pr-1 ${!isListening ? 'cursor-pointer' : ''}`}
        >
          {!isSpeechSupported ? (
            <div className="flex items-center gap-2 text-xs text-amber-300">
              <span className="truncate max-w-[125px] sm:max-w-[170px]">Mode Aksi Suara</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHelp(true);
                }}
                className="px-2.5 py-0.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-bold shrink-0 transition shadow-xs"
              >
                Pilih Aksi
              </button>
            </div>
          ) : permissionError ? (
            <div className="flex items-center gap-2 text-xs text-rose-300">
              <span className="truncate max-w-[140px] sm:max-w-[180px]">Izin mikrofon diperlukan</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startRecognition();
                }}
                className="px-2.5 py-0.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold shrink-0 transition"
              >
                Izinkan
              </button>
            </div>
          ) : successMessage ? (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold animate-in fade-in duration-150">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="truncate max-w-[160px] sm:max-w-[220px]">{successMessage}</span>
            </div>
          ) : liveTranscript ? (
            <div className="flex items-center gap-2 max-w-[160px] sm:max-w-[220px] animate-in fade-in duration-100">
              <span className="text-xs font-semibold text-cyan-300 italic truncate">
                "{liveTranscript}"
              </span>
              <span className="w-1.5 h-3 bg-cyan-400 rounded-full animate-ping shrink-0" />
            </div>
          ) : isLiveTranscribing ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-800">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Merekam Transkrip</span>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  processCommand('hentikan transkrip');
                }}
                className="px-2.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-full text-[10px] transition active:scale-95 shadow-xs"
              >
                Berhenti
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <RealtimeAudioWave
                isActive={isListening}
                barCount={7}
                minHeight={3}
                maxHeight={15}
                barWidth="w-1"
                gap="gap-0.5"
                variant="cyan"
              />
              <span className="text-[11px] text-slate-300 font-medium transition-opacity duration-300 truncate max-w-[130px] sm:max-w-[170px]">
                {isListening ? (isMobile ? 'Mendengarkan...' : ROTATING_HINTS[hintIndex]) : (activeTab === 'lecture' ? 'Ketuk untuk rekam' : 'Ketuk untuk bicara')}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons: Help & Close */}
        <div className="flex items-center gap-1 shrink-0 pl-1 border-l border-white/10">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className={`p-1.5 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-white/10 transition ${
              showHelp ? 'text-cyan-400 bg-white/10' : ''
            }`}
            title="Lihat contoh perintah"
            aria-label="Lihat contoh perintah suara"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setVoiceNavActive(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
            title="Sembunyikan navigasi suara (V)"
            aria-label="Sembunyikan navigasi suara"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
