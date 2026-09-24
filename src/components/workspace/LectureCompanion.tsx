import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Mic,
  Square,
  Copy,
  Check,
  Download,
  Music,
  Video,
  Play,
  Pause,
  Upload,
  RotateCcw,
  Volume2,
  Key,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  X,
  Radio,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { type VideoCaption, normalizeVideoCaptions, BUSINESS_VIDEO_CAPTIONS } from '../../data/videoCaptions';
import { transcribeVideoWithGemini } from '../../services/geminiVideoTranscribeService';
import { RealtimeAudioWave } from '../common/RealtimeAudioWave';
import {
  enhanceIndonesianSpeechText,
  detectIntonationPunctuation,
  smartJoinSpeechChunks,
  shouldPreserveCapitalization
} from '../../utils/speechTextEnhancer';
import {
  transcribeAudioWithGemini,
  getGeminiApiKey,
  setGeminiApiKey
} from '../../services/geminiAudioTranscribeService';
export type { VideoCaption };

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

type TranscribeSource = 'mic' | 'audio' | 'video';

interface SpeechBubble {
  id: string;
  speaker: string;
  time: string;
  seconds?: number;
  text: string;
  isImportant?: boolean;
}

export interface AudioTranscriptItem {
  id: string;
  speaker: string;
  time: string;
  seconds: number;
  endSeconds: number;
  text: string;
  isImportant?: boolean;
}

const SAMPLE_SPEECH_BUBBLES: SpeechBubble[] = [
  {
    id: 'b-1',
    speaker: 'Pemateri',
    time: '09:30',
    text: 'Selamat pagi semuanya. Sesi belajar hari ini membahas prinsip universal design dalam aksesibilitas digital dan teknologi inklusif.',
    isImportant: false,
  },
  {
    id: 'b-2',
    speaker: 'Pemateri',
    time: '09:32',
    text: 'Ingat empat pilar utama aksesibilitas: Perceivable, Operable, Understandable, dan Robust agar materi dapat dipahami oleh semua orang tanpa hambatan.',
    isImportant: true,
  }
];

const SAMPLE_AUDIO_TRANSCRIPT: AudioTranscriptItem[] = [
  {
    id: 'a-1',
    speaker: 'Narasumber',
    time: '00:00',
    seconds: 0,
    endSeconds: 10,
    text: 'Halo semuanya, ini rekaman pembahasan hari ini mengenai literasi digital dan komunikasi ramah disabilitas.',
    isImportant: false,
  },
  {
    id: 'a-2',
    speaker: 'Narasumber',
    time: '00:10',
    seconds: 10,
    endSeconds: 20,
    text: 'Poin paling penting: setiap materi dan percakapan lisan wajib disediakan transkripsi teks terstruktur agar Teman Tuli dapat membaca dan tidak tertinggal informasi.',
    isImportant: true,
  },
  {
    id: 'a-3',
    speaker: 'Narasumber',
    time: '00:20',
    seconds: 20,
    endSeconds: 30,
    text: 'Pastikan kalian mencatat tiga prinsip utama: kesederhanaan bahasa, penyorotan kata kunci, dan keterbacaan kontras tinggi.',
    isImportant: false,
  },
];

export const LectureCompanion: React.FC = () => {
  const {
    speakText,
    speakCue,
    stopSpeech,
    voiceNavActive,
    isRightPanelOpen,
    setIsRightPanelOpen,
    toggleRightPanel,
  } = useAccessibility();

  // Multi-Source Selector: 'mic' | 'audio' | 'video'
  const [sourceMode, setSourceMode] = useState<TranscribeSource>('mic');
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  // Live Mic State
  const [isListening, setIsListening] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [copied, setCopied] = useState(false);
  const [interimSpeech, setInterimSpeech] = useState('');

  // Bubbles of session conversation (Option A: Start with clean empty state)
  const [bubbles, setBubbles] = useState<SpeechBubble[]>([]);

  // Audio File State (Option A: Start with clean empty state)
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [audioFileUrl, setAudioFileUrl] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioTranscript, setAudioTranscript] = useState<AudioTranscriptItem[]>([]);
  const [audioCopied, setAudioCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioItemRef = useRef<HTMLDivElement | null>(null);
  const lastSpokenAudioId = useRef<string | null>(null);
  const wasPlayingAudioSampleRef = useRef(false);

  // Audio AI Transcription State
  const [isTranscribingAudio, setIsTranscribingAudio] = useState(false);
  const [transcribeAudioError, setTranscribeAudioError] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState('');
  const pendingAudioFileRef = useRef<File | null>(null);

  // Video State
  // Video State (Option A: Clean initial state + Gemini AI Transcription)
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loadedVideoId, setLoadedVideoId] = useState<string | null>(null);
  const [videoCaptions, setVideoCaptions] = useState<VideoCaption[]>([]);
  const [isTranscribingVideo, setIsTranscribingVideo] = useState(false);
  const [transcribeVideoError, setTranscribeVideoError] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoCopied, setVideoCopied] = useState(false);
  const youtubeIframeRef = useRef<HTMLIFrameElement | null>(null);
  const activeTranscriptItemRef = useRef<HTMLDivElement | null>(null);
  const savedVideoTimeRef = useRef(0);
  const isSwitchingTabRef = useRef(false);
  const lastYouTubeUpdateRef = useRef<number>(Date.now());
  const lastReportedTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };
  const currentYouTubeId = loadedVideoId;

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(isListening);
  const voiceNavActiveRef = useRef<boolean>(voiceNavActive);
  const restartTimerRef = useRef<any>(null);

  isListeningRef.current = isListening;
  voiceNavActiveRef.current = voiceNavActive;

  const streamEndRef = useRef<HTMLDivElement>(null);

  // Send postMessage commands to YouTube Iframe
  const postToYouTube = (func: string, args: any[] = []) => {
    if (youtubeIframeRef.current && youtubeIframeRef.current.contentWindow) {
      try {
        youtubeIframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: func,
            args: args,
          }),
          '*'
        );
      } catch (err) {
        console.warn('postMessage to YouTube failed:', err);
      }
    }
  };

  // Register two-way listening on YouTube iframe
  const registerYouTubeListening = () => {
    if (youtubeIframeRef.current && youtubeIframeRef.current.contentWindow) {
      try {
        youtubeIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'listening' }),
          '*'
        );
      } catch (_) {}
    }
  };

  // Two-way listener for YouTube player state and time updates
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.currentTime === 'number') {
            lastYouTubeUpdateRef.current = Date.now();
            if (!isSwitchingTabRef.current) {
              const cur = Math.floor(data.info.currentTime);
              // Suppress 1s backward rounding jitter during normal forward playback
              if (!isSeekingRef.current && isVideoPlaying) {
                if (cur < lastReportedTimeRef.current && (lastReportedTimeRef.current - cur) <= 1) {
                  return;
                }
              }
              lastReportedTimeRef.current = cur;
              setVideoCurrentTime(cur);
              if (cur > 0) {
                savedVideoTimeRef.current = cur;
              }
            }
          }
          if (data.info.playerState !== undefined) {
            // 1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING
            if (data.info.playerState === 1) {
              setIsVideoPlaying(true);
            } else if (data.info.playerState === 2 || data.info.playerState === 0) {
              setIsVideoPlaying(false);
            }
          }
        }
      } catch (_) {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isVideoPlaying]);

  // Synchronize recording status with VoiceNavigator and global app
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('ablefy-recording-status', {
        detail: { isRecording: isListening }
      })
    );
  }, [isListening]);

  // Live timer when recording mic
  useEffect(() => {
    let interval: any;
    if (isListening) {
      interval = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  // Audio File playback simulator / real timer
  useEffect(() => {
    let interval: any;
    if (isAudioPlaying && !audioFileUrl) {
      interval = setInterval(() => {
        setAudioCurrentTime((t) => {
          if (t >= audioDuration) {
            setIsAudioPlaying(false);
            stopSpeech();
            return 0;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAudioPlaying, audioDuration, audioFileUrl, stopSpeech]);

  // Audio Speech Synthesis / Output when playing default sample
  const activeAudioItem = audioTranscript.find(
    (item) => audioCurrentTime >= item.seconds && audioCurrentTime < item.endSeconds
  ) || audioTranscript[0] || null;

  useEffect(() => {
    if (isAudioPlaying && !audioFileUrl && activeAudioItem) {
      wasPlayingAudioSampleRef.current = true;
      if (activeAudioItem && activeAudioItem.id !== lastSpokenAudioId.current) {
        lastSpokenAudioId.current = activeAudioItem.id;
        speakText(activeAudioItem.text);
      }
    } else if (!isAudioPlaying && wasPlayingAudioSampleRef.current) {
      wasPlayingAudioSampleRef.current = false;
      lastSpokenAudioId.current = null;
      stopSpeech();
    }
  }, [isAudioPlaying, activeAudioItem, audioFileUrl, speakText, stopSpeech]);

  // Auto-scroll active audio card
  useEffect(() => {
    if (activeAudioItemRef.current) {
      activeAudioItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeAudioItem]);

  // Real audio element controller
  useEffect(() => {
    if (audioRef.current && audioFileUrl) {
      if (isAudioPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isAudioPlaying, audioFileUrl]);

  // Video playback timer - keeps YouTube listening active and serves as fallback watchdog only if YouTube messages cease
  useEffect(() => {
    let interval: any;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        registerYouTubeListening();
        // Fallback watchdog: Only advance timer manually if no YouTube message received for > 2 seconds
        if (Date.now() - lastYouTubeUpdateRef.current > 2000) {
          setVideoCurrentTime((t) => {
            const next = t + 1;
            lastReportedTimeRef.current = next;
            savedVideoTimeRef.current = next;
            return next;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  // Video seek & control handlers
  const handleSeekVideo = (seconds: number) => {
    isSeekingRef.current = true;
    lastReportedTimeRef.current = seconds;
    setVideoCurrentTime(seconds);
    savedVideoTimeRef.current = seconds;
    setIsVideoPlaying(true);
    postToYouTube('seekTo', [seconds, true]);
    postToYouTube('playVideo');
    setTimeout(() => {
      isSeekingRef.current = false;
    }, 800);
  };

  const toggleVideoPlay = () => {
    if (isVideoPlaying) {
      setIsVideoPlaying(false);
      postToYouTube('pauseVideo');
    } else {
      setIsVideoPlaying(true);
      postToYouTube('playVideo');
    }
  };

  const handleResetVideo = () => {
    isSeekingRef.current = true;
    lastReportedTimeRef.current = 0;
    setVideoCurrentTime(0);
    savedVideoTimeRef.current = 0;
    postToYouTube('seekTo', [0, true]);
    postToYouTube('playVideo');
    setIsVideoPlaying(true);
    setTimeout(() => {
      isSeekingRef.current = false;
    }, 800);
  };

  const handleLoadVideo = async (url: string) => {
    const trimmed = (url || '').trim();
    if (!trimmed) return;
    const extractedId = getYouTubeId(trimmed);
    if (!extractedId) {
      speakCue('Tautan video tidak valid. Pastikan tautan YouTube.');
      return;
    }

    // Stop previous video if playing
    setIsVideoPlaying(false);
    postToYouTube('pauseVideo');

    // Enter loading state - do NOT render video or old captions yet!
    setIsTranscribingVideo(true);
    setTranscribeVideoError(null);
    setLoadedVideoId(null);
    setVideoCaptions([]);
    speakCue('AI sedang mentranskripsikan percakapan video...');

    try {
      const caps = await transcribeVideoWithGemini(extractedId, trimmed);
      // Reveal video AND real transcript together simultaneously!
      setVideoCaptions(caps);
      setLoadedVideoId(extractedId);
      setVideoUrl(trimmed);
      setVideoCurrentTime(0);
      savedVideoTimeRef.current = 0;
      setIsTranscribingVideo(false);
      setIsVideoPlaying(true);
      speakCue(`Transkripsi video berhasil diselesaikan. Memuat ${caps.length} bagian percakapan.`);

      setTimeout(() => {
        registerYouTubeListening();
        postToYouTube('seekTo', [0, true]);
        postToYouTube('playVideo');
      }, 600);
    } catch (err: any) {
      console.error('Video transcription error:', err);
      setIsTranscribingVideo(false);
      const errMsg = err?.message || 'Gagal mentranskripsikan video YouTube.';
      setTranscribeVideoError(errMsg);
      speakCue('Gagal mentranskripsikan video. Silakan coba lagi.');
    }
  };

  const handleLoadSampleVideo = () => {
    const sampleId = '-858AOZjY9M';
    const sampleUrl = 'https://www.youtube.com/watch?v=-858AOZjY9M';
    setVideoUrl(sampleUrl);
    setLoadedVideoId(sampleId);
    setVideoCaptions(BUSINESS_VIDEO_CAPTIONS);
    setVideoCurrentTime(0);
    savedVideoTimeRef.current = 0;
    setIsVideoPlaying(true);
    speakCue('Contoh video materi dan subtitle dimuat');
    setTimeout(() => {
      registerYouTubeListening();
      postToYouTube('seekTo', [0, true]);
      postToYouTube('playVideo');
    }, 600);
  };

  const handleClearVideo = () => {
    setIsVideoPlaying(false);
    postToYouTube('pauseVideo');
    setLoadedVideoId(null);
    setVideoCaptions([]);
    setVideoUrl('');
    setVideoCurrentTime(0);
    savedVideoTimeRef.current = 0;
    setTranscribeVideoError(null);
    speakCue('Tampilan video dibersihkan');
  };

  // Safe tab switching that preserves video and audio playback timestamps
  const handleSwitchSourceMode = (newMode: TranscribeSource) => {
    if (newMode === sourceMode) return;

    if (sourceMode === 'video' && newMode !== 'video') {
      if (isVideoPlaying) {
        setIsVideoPlaying(false);
        postToYouTube('pauseVideo');
      }
    }

    if (sourceMode === 'audio' && newMode !== 'audio') {
      if (isAudioPlaying) {
        setIsAudioPlaying(false);
        if (audioRef.current && audioFileUrl) {
          audioRef.current.pause();
        }
        if (!audioFileUrl && wasPlayingAudioSampleRef.current) {
          wasPlayingAudioSampleRef.current = false;
          lastSpokenAudioId.current = null;
          stopSpeech();
        }
      }
    }

    setSourceMode(newMode);

    if (newMode === 'video') {
      speakCue('Beralih ke mode video dan YouTube');
      if (savedVideoTimeRef.current > 0) {
        isSwitchingTabRef.current = true;
        setVideoCurrentTime(savedVideoTimeRef.current);
        setTimeout(() => {
          postToYouTube('seekTo', [savedVideoTimeRef.current, true]);
          setTimeout(() => {
            isSwitchingTabRef.current = false;
          }, 800);
        }, 300);
      }
    } else if (newMode === 'audio') {
      speakCue('Beralih ke mode rekaman audio');
    } else {
      speakCue('Beralih ke mode mikrofon langsung');
    }
  };

  // Format seconds to mm:ss
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Auto-scroll stream
  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [bubbles, interimSpeech]);

  const [activeBubbleId, setActiveBubbleId] = useState<string | null>(null);
  const activeBubbleIdRef = useRef<string | null>(null);
  const pauseTimerRef = useRef<any>(null);
  const lastChunkTimeRef = useRef<number>(Date.now());
  const pendingStandaloneInterimRef = useRef<string>('');
  const interimPromotionTimerRef = useRef<any>(null);

  /**
   * Formats interim real-time speech preview so continuation words naturally match casing
   */
  const formatStreamingInterim = (interim: string, hasBaseText: boolean): string => {
    if (!interim) return '';
    let trimmed = interim.trim();
    if (!trimmed) return '';
    if (hasBaseText) {
      const firstWord = trimmed.split(/\s+/)[0];
      if (!shouldPreserveCapitalization(firstWord)) {
        trimmed = trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
      }
    }
    return trimmed;
  };

  /**
   * Finalizes the current active bubble with proper terminal intonation (? or .)
   */
  const finalizeActiveBubble = () => {
    if (!activeBubbleIdRef.current) return;
    const targetId = activeBubbleIdRef.current;
    activeBubbleIdRef.current = null;
    setActiveBubbleId(null);

    setBubbles((prev) => {
      const idx = prev.findIndex((b) => b.id === targetId);
      if (idx === -1) return prev;

      const target = prev[idx];
      let txt = target.text.trim();
      txt = txt.replace(/[,;:]+$/, '');
      const punctuation = detectIntonationPunctuation(txt);
      if (!/[.?!]$/.test(txt)) {
        txt += punctuation;
      }

      const updated = [...prev];
      updated[idx] = {
        ...target,
        text: txt,
      };
      return updated;
    });
  };

  /**
   * Predictable Silence-Timer Speech Segmentation & Intonation Processing:
   * 1. Short pauses (< 6.5s - 7s) like a breath or comma: stays 100% in CURRENT column/card.
   * 2. When silent for >= 6.5 seconds (6-7 detik): the current column finalizes with proper intonation (? or .).
   *    Next speech automatically enters the NEXT column/card!
   */
  const appendSmartSpeechTranscript = (rawText: string, speaker: string = 'Pembicara') => {
    const cleanedChunk = enhanceIndonesianSpeechText(rawText);
    if (!cleanedChunk) return;

    // Reset silence timer on incoming speech
    clearTimeout(pauseTimerRef.current);

    const now = Date.now();
    const pauseDuration = now - lastChunkTimeRef.current;
    lastChunkTimeRef.current = now;

    const dateObj = new Date();
    const timeStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

    setBubbles((prev) => {
      const activeId = activeBubbleIdRef.current;
      const existingIdx = activeId ? prev.findIndex((b) => b.id === activeId) : -1;

      if (existingIdx !== -1) {
        // MERGE INTO CURRENT ACTIVE BUBBLE (jeda di bawah 6-7 detik tetap di baris/kolom yang sama)
        const currentBubble = prev[existingIdx];
        const combined = smartJoinSpeechChunks(currentBubble.text, cleanedChunk, pauseDuration);

        // Generous limit (> 650 chars or ~100 words) so continuous speech does not prematurely break before 6-7 seconds
        const shouldCloseEarly = combined.length > 650;

        let finalizedText = combined;
        if (shouldCloseEarly && !/[.?!]$/.test(finalizedText)) {
          finalizedText += detectIntonationPunctuation(finalizedText);
        }

        const updated = [...prev];
        updated[existingIdx] = {
          ...currentBubble,
          text: finalizedText,
        };

        if (shouldCloseEarly) {
          activeBubbleIdRef.current = null;
          setActiveBubbleId(null);
        }

        return updated;
      } else {
        // CREATE A NEW BUBBLE (setelah jeda 6-7 detik)
        const newId = `b-${now}`;
        activeBubbleIdRef.current = newId;
        setActiveBubbleId(newId);

        // Capitalize first character
        let initialText = cleanedChunk.replace(/^[.,]+/, '').trim();
        if (initialText) {
          initialText = initialText.charAt(0).toUpperCase() + initialText.slice(1);
        }

        return [
          ...prev,
          {
            id: newId,
            speaker,
            time: timeStr,
            text: initialText,
            isImportant: false,
          }
        ];
      }
    });

    // Start 6.5s silence timer: if no speech arrives for 6.5s (6-7 detik), finalize current bubble!
    pauseTimerRef.current = setTimeout(() => {
      finalizeActiveBubble();
    }, 6500);
  };

  // Stream speech from VoiceNavigator when Hands-Free Voice Navigation is active
  useEffect(() => {
    const handleLiveTranscribe = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string }>;
      const text = customEvent.detail?.text;
      if (!text || !isListeningRef.current) return;

      appendSmartSpeechTranscript(text, 'Pembicara');
      setInterimSpeech('');
    };

    const handleLiveTranscribeInterim = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string }>;
      const text = customEvent.detail?.text;
      if (!isListeningRef.current) return;
      setInterimSpeech(text || '');
    };

    window.addEventListener('ablefy-live-transcribe', handleLiveTranscribe);
    window.addEventListener('ablefy-live-transcribe-interim', handleLiveTranscribeInterim);

    return () => {
      window.removeEventListener('ablefy-live-transcribe', handleLiveTranscribe);
      window.removeEventListener('ablefy-live-transcribe-interim', handleLiveTranscribeInterim);
    };
  }, []);

  const stopStandaloneRecognition = () => {
    clearTimeout(restartTimerRef.current);
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
  };

  const startStandaloneRecognition = async () => {
    const SpeechAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechAPI) {
      simulateLiveTranscription();
      return;
    }

    stopStandaloneRecognition();

    try {
      const recognition = new SpeechAPI();
      // On mobile, continuous MUST be false because Chromium Android does not support continuous: true
      recognition.continuous = !isMobile;
      recognition.interimResults = true;
      recognition.lang = 'id-ID';

      recognition.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += (item[0]?.transcript || '') + ' ';
          } else {
            interimTranscript += (item[0]?.transcript || '') + ' ';
          }
        }

        finalTranscript = finalTranscript.trim();
        interimTranscript = interimTranscript.trim();

        clearTimeout(interimPromotionTimerRef.current);

        if (finalTranscript) {
          pendingStandaloneInterimRef.current = '';
          appendSmartSpeechTranscript(finalTranscript, 'Pembicara');
          setInterimSpeech(interimTranscript);
        } else if (interimTranscript) {
          pendingStandaloneInterimRef.current = interimTranscript;
          setInterimSpeech(interimTranscript);

          // Auto-promote interim to final after 1.3s if Chrome delays isFinal
          interimPromotionTimerRef.current = setTimeout(() => {
            if (pendingStandaloneInterimRef.current.trim() && isListeningRef.current) {
              appendSmartSpeechTranscript(pendingStandaloneInterimRef.current.trim(), 'Pembicara');
              pendingStandaloneInterimRef.current = '';
              setInterimSpeech('');
            }
          }, 1300);
        }
      };

      recognition.onerror = (e: any) => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          speakCue('Akses mikrofon diblokir. Izinkan mikrofon di pengaturan browser Anda.');
          setIsListening(false);
          isListeningRef.current = false;
        }
        // Non-fatal errors ('no-speech', 'audio-capture', 'network', 'aborted') are handled cleanly by onend
      };

      recognition.onend = () => {
        clearTimeout(interimPromotionTimerRef.current);
        // Flush any unfinalized speech before restarting recognition
        if (pendingStandaloneInterimRef.current.trim() && isListeningRef.current) {
          appendSmartSpeechTranscript(pendingStandaloneInterimRef.current.trim(), 'Pembicara');
          pendingStandaloneInterimRef.current = '';
          setInterimSpeech('');
        }

        // Automatically restart seamlessly if user hasn't stopped recording
        if (isListeningRef.current && typeof document !== 'undefined' && document.visibilityState !== 'hidden') {
          clearTimeout(restartTimerRef.current);
          restartTimerRef.current = setTimeout(() => {
            if (isListeningRef.current) {
              startStandaloneRecognition();
            }
          }, isMobile ? 300 : 500);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Recognition start error, running live demo fallback:', err);
      simulateLiveTranscription();
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(pauseTimerRef.current);
      finalizeActiveBubble();
      stopStandaloneRecognition();
      window.dispatchEvent(
        new CustomEvent('ablefy-recording-status', {
          detail: { isRecording: false }
        })
      );
    };
  }, []);

  const simulateLiveTranscription = () => {
    if (isListening) {
      clearTimeout(pauseTimerRef.current);
      finalizeActiveBubble();
      setIsListening(false);
      isListeningRef.current = false;
      speakCue('Perekaman suara dihentikan');
      return;
    }

    setIsListening(true);
    isListeningRef.current = true;
    speakCue('Perekaman aktif');
    setInterimSpeech('Mendengarkan ucapan pemateri...');

    const demoPhrases = [
      'Selamat pagi semuanya, terima kasih telah bergabung dalam sesi inklusi digital hari ini.',
      'Aksesibilitas bukan sekadar fitur tambahan, melainkan hak asasi bagi setiap orang dan pengguna.',
      'Dengan Ablefy, teman tuli dapat membaca transkripsi seketika secara mandiri dan akurat.',
      'Seluruh teks yang diucapkan otomatis tersimpan dan dapat disalin ke catatan.'
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < demoPhrases.length) {
        appendSmartSpeechTranscript(demoPhrases[idx], 'Pembicara');
        idx++;
      } else {
        clearInterval(interval);
        setInterimSpeech('');
        clearTimeout(pauseTimerRef.current);
        finalizeActiveBubble();
        setIsListening(false);
        isListeningRef.current = false;
      }
    }, 2800);
  };

  const toggleRecording = () => {
    clearTimeout(pauseTimerRef.current);
    clearTimeout(interimPromotionTimerRef.current);

    // Flush any pending uncommitted speech before stopping/toggling
    if (pendingStandaloneInterimRef.current.trim()) {
      appendSmartSpeechTranscript(pendingStandaloneInterimRef.current.trim(), 'Pembicara');
      pendingStandaloneInterimRef.current = '';
    }

    finalizeActiveBubble();

    const willRecord = !isListening;

    if (!willRecord) {
      setIsListening(false);
      isListeningRef.current = false;
      stopStandaloneRecognition();
      setInterimSpeech('');
      speakCue('Perekaman suara dihentikan');
      window.dispatchEvent(
        new CustomEvent('ablefy-recording-status', {
          detail: { isRecording: false }
        })
      );
    } else {
      setIsListening(true);
      isListeningRef.current = true;
      setInterimSpeech('');
      speakCue('Perekaman aktif');
      window.dispatchEvent(
        new CustomEvent('ablefy-recording-status', {
          detail: { isRecording: true }
        })
      );
      startStandaloneRecognition();
    }
  };

  const triggerAudioTranscription = async (file: File) => {
    const key = getGeminiApiKey();
    if (!key) {
      pendingAudioFileRef.current = file;
      setGeminiApiKeyInput('');
      setIsApiKeyModalOpen(true);
      return;
    }

    setIsTranscribingAudio(true);
    setTranscribeAudioError(null);
    speakCue(`Memulai transkripsi berkas audio ${file.name}...`);

    try {
      const segments = await transcribeAudioWithGemini(file, key);
      setAudioTranscript(segments);
      setIsTranscribingAudio(false);
      speakCue(`Transkripsi audio berhasil diselesaikan. Mengenali ${segments.length} baris naskah.`);
    } catch (err: any) {
      console.error('Audio transcription error:', err);
      setIsTranscribingAudio(false);
      const errMsg = err?.message || 'Gagal mentranskripsikan berkas audio';
      setTranscribeAudioError(errMsg);
      speakCue('Gagal mentranskripsikan berkas audio. Silakan coba lagi.');
    }
  };

  const handleSaveApiKey = () => {
    const trimmed = geminiApiKeyInput.trim();
    if (!trimmed) return;
    setGeminiApiKey(trimmed);
    setIsApiKeyModalOpen(false);
    speakCue('Kunci API berhasil disimpan');

    if (pendingAudioFileRef.current && !isTranscribingAudio) {
      triggerAudioTranscription(pendingAudioFileRef.current);
    }
  };

  const handleRetryTranscription = () => {
    if (pendingAudioFileRef.current) {
      triggerAudioTranscription(pendingAudioFileRef.current);
    } else {
      setIsApiKeyModalOpen(true);
    }
  };

  // Audio upload handler
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (audioFileUrl) URL.revokeObjectURL(audioFileUrl);
      const url = URL.createObjectURL(file);
      setAudioFileUrl(url);
      setAudioFileName(file.name);
      setIsAudioPlaying(false);
      setAudioCurrentTime(0);
      pendingAudioFileRef.current = file;

      // Start AI transcription on the actual file!
      triggerAudioTranscription(file);

      e.target.value = '';
    }
  };

  const handleLoadSampleMicBubbles = () => {
    setBubbles(SAMPLE_SPEECH_BUBBLES);
    speakCue('Contoh transkripsi percakapan dimuat');
  };

  const handleClearMicBubbles = () => {
    setBubbles([]);
    clearTimeout(pauseTimerRef.current);
    finalizeActiveBubble();
    speakCue('Transkrip wicara dibersihkan');
  };

  const handleLoadSampleAudio = () => {
    setAudioFileName('Contoh_Diskusi_Aksesibilitas.mp3');
    setAudioDuration(30);
    setAudioCurrentTime(0);
    setAudioTranscript(SAMPLE_AUDIO_TRANSCRIPT);
    speakCue('Contoh rekaman audio dimuat');
  };

  const handleClearAudio = () => {
    if (audioFileUrl) {
      URL.revokeObjectURL(audioFileUrl);
    }
    setAudioFileUrl(null);
    setAudioFileName('');
    setIsAudioPlaying(false);
    setAudioCurrentTime(0);
    setAudioDuration(0);
    setAudioTranscript([]);
    pendingAudioFileRef.current = null;
    speakCue('Transkrip audio dibersihkan');
  };

  const toggleAudioPlay = () => {
    if (!audioFileUrl && audioTranscript.length === 0) {
      speakCue('Pilih atau unggah berkas audio terlebih dahulu');
      return;
    }

    if (isAudioPlaying) {
      setIsAudioPlaying(false);
      if (audioRef.current && audioFileUrl) {
        audioRef.current.pause();
      }
      if (!audioFileUrl) {
        stopSpeech();
      }
    } else {
      setIsAudioPlaying(true);
      if (audioRef.current && audioFileUrl) {
        audioRef.current.play().catch(() => {});
      } else {
        lastSpokenAudioId.current = null;
      }
    }
  };

  const handleSeekAudio = (seconds: number) => {
    if (!audioFileUrl && audioTranscript.length === 0) return;
    setAudioCurrentTime(seconds);
    setIsAudioPlaying(true);
    if (audioRef.current && audioFileUrl) {
      audioRef.current.currentTime = seconds;
      audioRef.current.play().catch(() => {});
    }
    if (!audioFileUrl) {
      const target = audioTranscript.find(
        (item) => seconds >= item.seconds && seconds < item.endSeconds
      );
      if (target) {
        lastSpokenAudioId.current = target.id;
        speakText(target.text);
      }
    }
  };

  const handleResetAudio = () => {
    if (!audioFileUrl && audioTranscript.length === 0) return;
    setAudioCurrentTime(0);
    if (audioRef.current && audioFileUrl) {
      audioRef.current.currentTime = 0;
    }
    if (!audioFileUrl) {
      stopSpeech();
      lastSpokenAudioId.current = null;
    }
  };

  const handleCopyAudioTranscript = () => {
    const fullText = audioTranscript
      .map((b) => `[${b.time}] ${b.speaker}: ${b.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(fullText);
    setAudioCopied(true);
    speakCue('Transkrip audio disalin');
    setTimeout(() => setAudioCopied(false), 2000);
  };

  const handleExportAudioTxt = () => {
    const fullText = `TRANSKRIP REKAMAN AUDIO ABLEFY\nBerkas: ${audioFileName}\nTanggal: ${new Date().toLocaleDateString('id-ID')}\n\n` +
      audioTranscript.map((b) => `[${b.time}] ${b.speaker}:\n${b.text}`).join('\n\n');

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transkrip-audio-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    speakCue('Berkas transkrip audio berhasil diunduh');
  };

  const handleCopyAll = (itemsToCopy = bubbles) => {
    const fullText = itemsToCopy.map((b) => `[${b.time}] ${b.speaker}: ${b.text}`).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    speakCue('Transkrip disalin');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportTxt = (itemsToExport = bubbles) => {
    const fullText = `TRANSKRIP SESI ABLEFY\nTanggal: ${new Date().toLocaleDateString('id-ID')}\nSumber: ${sourceMode.toUpperCase()}\n\n` +
      itemsToExport.map((b) => `[${b.time}] ${b.speaker}:\n${b.text}`).join('\n\n');

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transkrip-${sourceMode}-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    speakCue('Berkas transkrip berhasil diunduh');
  };

  // Active video captions & list (normalized to eliminate overlapping intervals)
  const currentCaptions = useMemo(() => normalizeVideoCaptions(videoCaptions), [videoCaptions]);

  const activeCaption = useMemo(() => {
    if (!currentCaptions || currentCaptions.length === 0) return null;
    const exact = currentCaptions.find(
      (c) => videoCurrentTime >= c.start && videoCurrentTime < c.end
    );
    if (exact) return exact;
    // If between segments (speech pause), keep the most recent past caption
    const past = currentCaptions.filter((c) => c.start <= videoCurrentTime);
    if (past.length > 0) {
      return past[past.length - 1];
    }
    return currentCaptions[0];
  }, [currentCaptions, videoCurrentTime]);

  // Action event listener for Hands-Free Voice Commands
  useEffect(() => {
    const handleVoiceAction = (e: Event) => {
      const customEvent = e as CustomEvent<{ action: string; payload?: any }>;
      const { action, payload } = customEvent.detail || {};

      if (action === 'START_RECORDING') {
        clearTimeout(pauseTimerRef.current);
        finalizeActiveBubble();
        if (sourceMode !== 'mic') {
          handleSwitchSourceMode('mic');
        }
        if (!isListeningRef.current) {
          setIsListening(true);
          isListeningRef.current = true;
          speakCue('Perekaman aktif');
          window.dispatchEvent(
            new CustomEvent('ablefy-recording-status', {
              detail: { isRecording: true }
            })
          );
          startStandaloneRecognition();
        }
      } else if (action === 'STOP_RECORDING') {
        clearTimeout(pauseTimerRef.current);
        finalizeActiveBubble();
        if (isListeningRef.current || isListening) {
          setIsListening(false);
          isListeningRef.current = false;
          setInterimSpeech('');
          speakCue('Perekaman suara dihentikan');
          stopStandaloneRecognition();
        }
      } else if (action === 'CLEAR_TRANSCRIPT') {
        clearTimeout(pauseTimerRef.current);
        activeBubbleIdRef.current = null;
        setBubbles([]);
        speakCue('Transkrip wicara dibersihkan');
      } else if (action === 'COPY_TRANSCRIPT') {
        if (sourceMode === 'audio') {
          handleCopyAudioTranscript();
        } else if (sourceMode === 'video') {
          handleCopyVideoTranscript();
        } else {
          handleCopyAll();
        }
      } else if (action === 'DOWNLOAD_TRANSCRIPT') {
        if (sourceMode === 'audio') {
          handleExportAudioTxt();
        } else if (sourceMode === 'video') {
          handleExportVideoTranscript();
        } else {
          handleExportTxt();
        }
      } else if (action === 'SET_INPUT_SOURCE') {
        if (payload === 'mic' || payload === 'audio' || payload === 'video') {
          handleSwitchSourceMode(payload);
        }
      }
    };

    window.addEventListener('ablefy-action', handleVoiceAction);
    return () => window.removeEventListener('ablefy-action', handleVoiceAction);
  }, [sourceMode, bubbles, audioTranscript, currentCaptions, videoUrl]);

  // Auto-scroll active caption in transcript list
  const lastScrolledCaptionRef = useRef<VideoCaption | null>(null);
  useEffect(() => {
    if (activeCaption && activeTranscriptItemRef.current) {
      if (lastScrolledCaptionRef.current !== activeCaption) {
        lastScrolledCaptionRef.current = activeCaption;
        activeTranscriptItemRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [activeCaption]);

  const handleCopyVideoTranscript = () => {
    const fullText = currentCaptions
      .map((c) => `[${formatTimer(c.start)} - ${formatTimer(c.end)}] ${c.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(fullText);
    setVideoCopied(true);
    speakText('Naskah video disalin');
    setTimeout(() => setVideoCopied(false), 2000);
  };

  const handleExportVideoTranscript = () => {
    const fullText = `TRANSKRIP VIDEO ABLEFY\nTautan Video: ${videoUrl}\nTanggal: ${new Date().toLocaleDateString('id-ID')}\n\n` +
      currentCaptions.map((c) => `[${formatTimer(c.start)} - ${formatTimer(c.end)}]\n${c.text}`).join('\n\n');

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `subtitle-video-${currentYouTubeId || 'ablefy'}-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    speakText('Subtitle video berhasil diunduh');
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 py-6 pb-20 overflow-x-hidden">
      {/* 2-Column Responsive Layout Matching HomeWorkspace & Otter.ai */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full min-w-0">

        {/* ======================================================== */}
        {/* LEFT / CENTER COLUMN: Transcript & Media Canvas          */}
        {/* ======================================================== */}
        <div className="flex-1 min-w-0 space-y-6 w-full max-w-full">

          {/* ======================================================== */}
          {/* SOURCE MODE 1: LIVE MIC RECORDER                         */}
          {/* ======================================================== */}
          <div className={`space-y-4 ${sourceMode === 'mic' ? 'block' : 'hidden'}`}>
            {/* Live Status Indicator for Mic */}
            {isListening && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs transition-all">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                      {formatTimer(recordingSeconds)}
                    </span>
                  </div>
                  <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                  <div className="flex items-center gap-2">
                    <RealtimeAudioWave
                      isActive={isListening}
                      barCount={6}
                      minHeight={3}
                      maxHeight={14}
                      variant="blue"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic truncate">
                      {interimSpeech ? `"${interimSpeech}"` : 'Mendengarkan...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Transcript Document Stream */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Transkripsi Suara Langsung
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Setiap ucapan dipilah secara cerdas berdasarkan jeda hening percakapan dan keutuhan kalimat pembicaraan.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg shrink-0">
                    {bubbles.length} Bagian
                  </span>
                </div>
              </div>

              {bubbles.length === 0 && !isListening ? (
                /* Clean Empty State with Direct Record trigger & Sample Demo trigger */
                <div className="p-8 sm:p-10 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
                    <Mic className="w-7 h-7" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Mikrofon Siap Digunakan
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Tekan tombol <strong>Mulai Rekam Suara</strong> untuk mentranskripsikan pembicaraan atau percakapan secara langsung.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Mulai Rekam Suara</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleLoadSampleMicBubbles}
                      className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition shadow-2xs active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      <span>Coba Contoh Percakapan</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {bubbles.map((b) => {
                    const isActive = b.id === activeBubbleId && isListening;
                    return (
                      <div
                        key={b.id}
                        className={`p-4 sm:p-5 transition flex items-start justify-between gap-3 ${
                          isActive
                            ? 'bg-blue-50/40 dark:bg-blue-950/20 border-l-4 border-blue-500'
                            : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900 dark:text-white">{b.speaker}</span>
                              {isActive && (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                  <span>Sedang Berbicara</span>
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">[{b.time}]</span>
                          </div>
                          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                            {b.text}
                            {isActive && interimSpeech && (
                              <span className="text-blue-600 dark:text-blue-400 italic opacity-95 ml-1 transition-all">
                                {' '}{formatStreamingInterim(interimSpeech, Boolean(b.text))}
                                <span className="inline-block w-1.5 h-3.5 bg-blue-500 ml-1 animate-pulse align-middle rounded-full" />
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 self-center">
                          <button
                            type="button"
                            onClick={() => speakText(b.text)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Dengarkan Ulang Suara"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(b.text);
                              speakText('Bagian disalin');
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Salin Kalimat Ini"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* If listening and NO active bubble yet, stream directly in a card */}
                  {isListening && interimSpeech && !activeBubbleId && (
                    <div className="p-4 sm:p-5 bg-blue-50/40 dark:bg-blue-950/20 border-l-4 border-blue-500 transition flex items-start justify-between gap-3 animate-in fade-in duration-150">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">Pembicara</span>
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                              <span>Mendengarkan...</span>
                            </span>
                          </div>
                          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">[Sekarang]</span>
                        </div>
                        <p className="text-sm sm:text-base text-blue-600 dark:text-blue-400 italic leading-relaxed">
                          {formatStreamingInterim(interimSpeech, false)}
                          <span className="inline-block w-1.5 h-3.5 bg-blue-500 ml-1 animate-pulse align-middle rounded-full" />
                        </p>
                      </div>
                    </div>
                  )}
                  <div ref={streamEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* SOURCE MODE 2: AUDIO FILE / VOICE NOTE (.mp3 / .wav)     */}
          {/* ======================================================== */}
          <div className={`space-y-4 animate-in fade-in duration-150 ${sourceMode === 'audio' ? 'block' : 'hidden'}`}>
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Transkripsi Rekaman Audio
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Berkas rekaman suara (.m4a/.mp3/.wav) ditranskripsikan secara otomatis dengan AI berstempel waktu.
                </p>
              </div>

              {/* Real Audio Player Element */}
              <audio
                ref={audioRef}
                src={audioFileUrl || undefined}
                onTimeUpdate={(e) => setAudioCurrentTime(Math.floor(e.currentTarget.currentTime))}
                onLoadedMetadata={(e) => {
                  const dur = Math.floor(e.currentTarget.duration) || 30;
                  setAudioDuration(dur);
                }}
                onEnded={() => {
                  setIsAudioPlaying(false);
                  setAudioCurrentTime(0);
                }}
                className="hidden"
              />

              {/* Interactive Audio Player Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={toggleAudioPlay}
                      disabled={!audioFileUrl && audioTranscript.length === 0}
                      className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition shrink-0 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      title={isAudioPlaying ? 'Jeda Audio' : 'Putar Audio'}
                    >
                      {isAudioPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    <button
                      onClick={handleResetAudio}
                      disabled={!audioFileUrl && audioTranscript.length === 0}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Mulai kembali dari detik 00:00"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>00:00</span>
                    </button>

                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                        <Music className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate">{audioFileName || 'Belum ada berkas dipilih'}</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {formatTimer(audioCurrentTime)} / {formatTimer(audioDuration)}
                      </div>
                    </div>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60">
                    <span className={`w-2 h-2 rounded-full ${isAudioPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span>{isAudioPlaying ? 'Sedang Memutar' : 'Subtitle Siap'}</span>
                  </span>
                </div>

                {/* Interactive Timeline Progress Scrubber */}
                <div
                  className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden cursor-pointer relative"
                  onClick={(e) => {
                    if (audioDuration <= 0) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    handleSeekAudio(Math.floor(pos * audioDuration));
                  }}
                  title="Klik timeline untuk melompat ke detik yang diinginkan"
                >
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-150"
                    style={{ width: `${audioDuration > 0 ? Math.min(100, (audioCurrentTime / audioDuration) * 100) : 0}%` }}
                  />
                </div>
              </div>

              {/* LIVE SYNCHRONIZED CAPTION BAR FOR AUDIO */}
              <div className="bg-slate-900 dark:bg-slate-950 border border-slate-700/80 p-4 sm:p-5 rounded-2xl text-center shadow-lg transition-all">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5 flex items-center justify-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isAudioPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                  <span>
                    {activeAudioItem
                      ? `Subtitle Rekaman Suara [${activeAudioItem.time} - ${formatTimer(activeAudioItem.endSeconds)}]`
                      : 'Subtitle Rekaman Suara'}
                  </span>
                </div>
                <p className="text-base sm:text-lg font-bold text-white leading-relaxed max-w-3xl mx-auto">
                  {activeAudioItem
                    ? `"${activeAudioItem.text}"`
                    : 'Unggah berkas audio (.mp3/.m4a) pada panel kanan untuk menampilkan subtitle dan teks berstempel waktu.'}
                </p>
              </div>

              {/* AI TRANSCRIPTION IN-PROGRESS CARD */}
              {isTranscribingAudio && (
                <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-50/80 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 text-center space-y-3.5 shadow-sm">
                  <div className="flex items-center justify-center gap-1.5 h-10">
                    <span className="w-1.5 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-full animate-audio-bar-1" />
                    <span className="w-1.5 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-full animate-audio-bar-2" />
                    <span className="w-1.5 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-full animate-audio-bar-3" />
                    <span className="w-1.5 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-full animate-audio-bar-4" />
                    <span className="w-1.5 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-full animate-audio-bar-5" />
                    <span className="w-1.5 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-full animate-audio-bar-6" />
                    <span className="w-1.5 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-full animate-audio-bar-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>AI sedang mentranskripsikan audio...</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Menyelaraskan ucapan dan stempel waktu naskah
                    </p>
                  </div>
                </div>
              )}

              {/* ERROR CARD WITH RETRY OPTION */}
              {transcribeAudioError && !isTranscribingAudio && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm">Gagal Mentranskripsikan Audio</h5>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5 leading-relaxed">
                        {transcribeAudioError}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRetryTranscription}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-2xs"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

              {/* Generated Timestamped Dialogue Stream */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Hasil Transkripsi Rekaman Berstempel Waktu
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Klik baris teks mana saja untuk memutar rekaman langsung dari stempel waktu tersebut.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg shrink-0">
                    {audioTranscript.length} Bagian
                  </span>
                </div>

                {audioTranscript.length === 0 && !isTranscribingAudio ? (
                  /* Empty state when no transcript is generated yet */
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 p-8 sm:p-10 text-center flex flex-col items-center justify-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
                      <Music className="w-7 h-7" />
                    </div>
                    <div className="space-y-1 max-w-md">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Belum Ada Berkas Rekaman
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        Pilih atau unggah berkas rekaman suara (.mp3, .m4a, .wav) pada panel kanan untuk memulai transkripsi wicara otomatis.
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleLoadSampleAudio}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                        <span>Coba dengan Contoh Rekaman Diskusi</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto space-y-2 pr-1 rounded-xl">
                    {audioTranscript.map((item) => {
                      const isActive = audioCurrentTime >= item.seconds && audioCurrentTime < item.endSeconds;
                      return (
                        <div
                          key={item.id}
                          ref={isActive ? activeAudioItemRef : undefined}
                          onClick={() => handleSeekAudio(item.seconds)}
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition flex items-start gap-3 ${
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 font-semibold text-blue-950 dark:text-blue-100 shadow-xs ring-1 ring-blue-400/30'
                              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <span className={`shrink-0 font-mono text-xs px-2 py-0.5 rounded font-bold ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            [{item.time} - {formatTimer(item.endSeconds)}]
                          </span>

                          <div className="flex-1 leading-relaxed">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{item.speaker}</span>
                              {isActive && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                                  ● Sedang Berbicara
                                </span>
                              )}
                            </div>
                            <p className="text-slate-800 dark:text-slate-200 font-normal">
                              {item.text}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 self-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                speakText(item.text);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Dengarkan Ulang Suara"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(item.text);
                                speakText('Kalimat disalin');
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Salin Kalimat Ini"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SOURCE MODE 3: VIDEO & YOUTUBE STREAM (Auto Captions)    */}
          {/* ======================================================== */}
          <div className={`space-y-4 animate-in fade-in duration-150 ${sourceMode === 'video' ? 'block' : 'hidden'}`}>
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Video & Subtitle Otomatis
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Tonton video materi atau YouTube dengan subtitle otomatis dan naskah berstempel waktu yang tersinkronisasi.
                </p>
              </div>

              {/* AI VIDEO TRANSCRIPTION IN-PROGRESS CARD */}
              {isTranscribingVideo && (
                <div className="p-8 rounded-2xl bg-gradient-to-b from-blue-50/80 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 text-center space-y-4 shadow-sm animate-in fade-in duration-200">
                  <div className="flex items-center justify-center gap-1.5 h-10">
                    <span className="w-1.5 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-full animate-audio-bar-1" />
                    <span className="w-1.5 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-full animate-audio-bar-2" />
                    <span className="w-1.5 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-full animate-audio-bar-3" />
                    <span className="w-1.5 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-full animate-audio-bar-4" />
                    <span className="w-1.5 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-full animate-audio-bar-5" />
                    <span className="w-1.5 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-full animate-audio-bar-6" />
                    <span className="w-1.5 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-full animate-audio-bar-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>AI sedang mentranskripsikan video...</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Menganalisis audio wicara dan menyusun naskah percakapan video
                    </p>
                  </div>
                </div>
              )}

              {/* ERROR CARD FOR VIDEO TRANSCRIPTION */}
              {transcribeVideoError && !isTranscribingVideo && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm">Gagal Mentranskripsikan Video</h5>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5 leading-relaxed">
                        {transcribeVideoError}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLoadVideo(videoUrl)}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-2xs shrink-0"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

              {/* Active Video Player & Transcript View */}
              {currentYouTubeId && !isTranscribingVideo ? (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* YouTube Embed */}
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-md">
                    <iframe
                      ref={youtubeIframeRef}
                      key={currentYouTubeId}
                      src={`https://www.youtube.com/embed/${currentYouTubeId}?enablejsapi=1&autoplay=1&rel=0`}
                      title="YouTube video player"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      onLoad={() => {
                        registerYouTubeListening();
                        setTimeout(() => {
                          registerYouTubeListening();
                          if (savedVideoTimeRef.current > 0) {
                            postToYouTube('seekTo', [savedVideoTimeRef.current, true]);
                          }
                        }, 600);
                      }}
                    />
                  </div>

                  {/* Interactive Control & Sync Bar */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleVideoPlay}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
                      >
                        {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                        <span>{isVideoPlaying ? 'Jeda Sinkron' : 'Putar Video'}</span>
                      </button>

                      <button
                        onClick={handleResetVideo}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
                        title="Mulai kembali dari detik 00:00"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>00:00</span>
                      </button>

                      <div className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                        {formatTimer(videoCurrentTime)}
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Subtitle Tersinkronisasi</span>
                    </span>
                  </div>

                  {/* LIVE SYNCHRONIZED CAPTION BAR */}
                  <div className="bg-slate-900 dark:bg-slate-950 border border-slate-700/80 p-3.5 sm:p-4 rounded-2xl text-center shadow-md transition-all">
                    <div className="text-[11px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>
                        {activeCaption
                          ? `Subtitle Otomatis [${formatTimer(activeCaption.start)} - ${formatTimer(activeCaption.end)}]`
                          : 'Subtitle Otomatis'}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white leading-relaxed line-clamp-3">
                      {activeCaption ? `"${activeCaption.text}"` : 'Menyimak dialog video...'}
                    </p>
                  </div>

                  {/* Naskah Lengkap Percakapan Berstempel Waktu */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800 gap-2">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          Naskah Lengkap Percakapan
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Klik baris untuk melompat langsung ke waktu tersebut.
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md">
                        {currentCaptions.length} Bagian
                      </span>
                    </div>

                    <div className="overflow-y-auto space-y-2 pr-1 max-h-72 rounded-xl focus:outline-none">
                      {currentCaptions.map((cap, idx) => {
                        const isActive = cap === activeCaption;
                        return (
                          <div
                            key={`cap-${cap.start}-${idx}`}
                            ref={isActive ? activeTranscriptItemRef : undefined}
                            onClick={() => handleSeekVideo(cap.start)}
                            className={`p-2.5 sm:p-3 rounded-xl border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                              isActive
                                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 font-semibold text-blue-950 dark:text-blue-100 shadow-xs ring-1 ring-blue-400/30'
                                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <span className={`shrink-0 font-mono text-[11px] px-1.5 py-0.5 rounded font-bold ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                              [{formatTimer(cap.start)} - {formatTimer(cap.end)}]
                            </span>
                            <div className="flex-1 leading-relaxed">
                              <span>{cap.text}</span>
                              {isActive && (
                                <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                  ● Sedang Diputar
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : !isTranscribingVideo ? (
                /* Empty State saat belum ada video dimuat */
                <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                    <Video className="w-7 h-7" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                      Masukkan Tautan Video YouTube
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Tempelkan tautan video YouTube pada panel di sebelah kanan, lalu klik <strong>Muat Video</strong>. AI akan mentranskripsikan percakapan dan memunculkan video serta naskah secara bersamaan.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleLoadSampleVideo}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      <span>Coba dengan Contoh Video Edukasi</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Mode Selector, Actions & Guide (Col 4)     */}
        {/* ======================================================== */}
        <aside
          className={`w-full shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
            isRightPanelOpen
              ? 'lg:w-[360px] xl:w-[380px]'
              : 'lg:w-16'
          }`}
          aria-label="Panel Sumber Suara dan Aksi"
        >
          {/* UNIFIED CONTROL SHELL: Responsive on mobile & desktop, dynamic height */}
          <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs lg:sticky lg:top-20 h-fit max-h-none lg:max-h-[calc(100vh-6.5rem)] overflow-hidden">
            
            {/* Header: Toggle button is right on the box */}
            <div className={`shrink-0 border-b border-slate-100 dark:border-slate-800/80 transition-all ${
              isRightPanelOpen ? 'p-3.5 flex items-center justify-between' : 'p-3 flex justify-center'
            }`}>
              {isRightPanelOpen ? (
                <>
                  <div className="flex items-center gap-2 min-w-0">
                    <Radio className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      Sumber Suara & Aksi
                    </span>
                  </div>
                  <button
                    onClick={toggleRightPanel}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
                    title="Perkecil Panel Kanan (])"
                    aria-label="Perkecil Panel Kanan"
                  >
                    <PanelRightClose className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleRightPanel}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition shadow-2xs border border-transparent hover:border-blue-200 dark:hover:border-blue-800 active:scale-95"
                  title="Perluas Panel Kanan (])"
                  aria-label="Perluas Panel Kanan"
                >
                  <PanelRightOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {isRightPanelOpen ? (
                /* EXPANDED CONTENT: fixed width on desktop, full-width fluid on mobile */
                <div className="w-full lg:w-[330px] xl:w-[350px] p-4 space-y-4 animate-in fade-in duration-200">
                  {/* Section 1: Sumber Suara & Kontrol Input */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">
                      Pilih Sumber Suara
                    </span>

            {/* Mode Switcher Buttons */}
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleSwitchSourceMode('mic')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition shadow-2xs ${
                  sourceMode === 'mic'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-blue-600" />
                  <span>Mikrofon Langsung</span>
                </div>
                {sourceMode === 'mic' && (
                  <span className="text-[10px] bg-blue-200/80 text-blue-900 px-1.5 py-0.5 rounded font-bold">Aktif</span>
                )}
              </button>

              <button
                onClick={() => handleSwitchSourceMode('audio')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition shadow-2xs ${
                  sourceMode === 'audio'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-blue-600" />
                  <span>Rekaman Audio (.mp3/.m4a)</span>
                </div>
                {sourceMode === 'audio' && (
                  <span className="text-[10px] bg-blue-200/80 text-blue-900 px-1.5 py-0.5 rounded font-bold">Aktif</span>
                )}
              </button>

              <button
                onClick={() => handleSwitchSourceMode('video')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition shadow-2xs ${
                  sourceMode === 'video'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span>Video & YouTube</span>
                </div>
                {sourceMode === 'video' && (
                  <span className="text-[10px] bg-blue-200/80 text-blue-900 px-1.5 py-0.5 rounded font-bold">Aktif</span>
                )}
              </button>
            </div>

            {/* Contextual Input Area per Mode */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {sourceMode === 'mic' && (
                <div className="space-y-3">
                  <button
                    onClick={toggleRecording}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 ${
                      isListening
                        ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isListening ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
                    <span>{isListening ? 'Hentikan Perekaman' : 'Mulai Rekam Suara'}</span>
                  </button>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-slate-300 dark:bg-slate-600'}`} />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {isListening ? (interimSpeech ? 'Mendengar ucapan...' : 'Merekam...') : 'Status: Siap'}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {isListening ? formatTimer(recordingSeconds) : '00:00'}
                    </span>
                  </div>
                </div>
              )}

              {sourceMode === 'audio' && (
                <div className="space-y-2.5">
                  <label className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>Pilih Berkas Audio (.mp3/.m4a)</span>
                    <input type="file" accept="audio/*,.m4a,.mp3,.wav,.ogg,.aac" onChange={handleAudioUpload} className="hidden" />
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsApiKeyModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
                  >
                    <Key className="w-3.5 h-3.5 text-blue-600" />
                    <span>Pengaturan Kunci API Gemini</span>
                  </button>
                </div>
              )}

              {sourceMode === 'video' && (
                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleLoadVideo(videoUrl);
                      }
                    }}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-slate-900 dark:text-white focus:bg-white focus:outline-none focus:border-blue-500"
                  />

                  <button
                    onClick={() => handleLoadVideo(videoUrl)}
                    disabled={isTranscribingVideo || !videoUrl.trim()}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    {isTranscribingVideo ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>Mentranskripsikan...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Muat & Transkrip AI</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          {/* Section 2: Tindakan & Ekspor Transkrip */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 dark:text-white block">
              Tindakan Transkrip
            </span>

            <div className="space-y-2">
              {/* Copy Button */}
              <button
                onClick={() => {
                  if (sourceMode === 'audio') handleCopyAudioTranscript();
                  else if (sourceMode === 'video') handleCopyVideoTranscript();
                  else handleCopyAll(bubbles);
                }}
                disabled={sourceMode === 'audio' ? audioTranscript.length === 0 : sourceMode === 'video' ? currentCaptions.length === 0 : bubbles.length === 0}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  {(sourceMode === 'audio' ? audioCopied : sourceMode === 'video' ? videoCopied : copied) ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-500" />
                  )}
                  <span>Salin Semua Teks</span>
                </div>
                <span className="text-[10px] text-slate-400">Clipboard</span>
              </button>

              {/* Download TXT Button */}
              <button
                onClick={() => {
                  if (sourceMode === 'audio') handleExportAudioTxt();
                  else if (sourceMode === 'video') handleExportVideoTranscript();
                  else handleExportTxt(bubbles);
                }}
                disabled={sourceMode === 'audio' ? audioTranscript.length === 0 : sourceMode === 'video' ? currentCaptions.length === 0 : bubbles.length === 0}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Unduh Dokumen (.txt)</span>
                </div>
                <span className="text-[10px] text-slate-400">TXT</span>
              </button>

              {/* Clear Transcript Button */}
              <button
                onClick={() => {
                  if (sourceMode === 'audio') handleClearAudio();
                  else if (sourceMode === 'video') handleClearVideo();
                  else handleClearMicBubbles();
                }}
                disabled={sourceMode === 'audio' ? audioTranscript.length === 0 : sourceMode === 'video' ? currentCaptions.length === 0 : bubbles.length === 0}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-950/30 text-slate-600 dark:text-slate-400 text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-500" />
                  <span>Bersihkan Transkrip</span>
                </div>
                <span className="text-[10px] text-rose-500 font-bold">Reset</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          {/* Section 3: Panduan & Aksesibilitas */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-800 dark:text-white block">
              Panduan Sesi
            </span>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">🎙️</span>
                <span>Transkripsi mikrofon langsung memilah naskah secara otomatis berdasar jeda bicara alami.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">⚡</span>
                <span>Klik baris naskah audio atau video untuk melompat langsung ke detik rekaman tersebut.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">⌨️</span>
                <span>Pintasan cepat: Tekan tombol 0-3 untuk beralih ruang, tombol ? untuk bantuan keyboard.</span>
              </div>
            </div>
          </div>

                </div>
              ) : (
                /* COLLAPSED RAIL: Centered action buttons with tooltips (horizontal row on mobile, vertical column on desktop) */
                <div className="py-3 px-3 flex flex-row lg:flex-col items-center justify-around lg:justify-start gap-2.5 animate-in fade-in duration-200">
                  <button
                    onClick={() => {
                      handleSwitchSourceMode('mic');
                      toggleRecording();
                    }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition shadow-2xs active:scale-95"
                    title={isListening ? 'Hentikan Perekaman' : 'Mulai Perekaman Mikrofon'}
                  >
                    <Mic className={`w-4 h-4 ${isListening ? 'text-rose-600 animate-pulse' : 'text-rose-500'}`} />
                  </button>
                  <button
                    onClick={() => {
                      handleSwitchSourceMode('audio');
                      setIsRightPanelOpen(true);
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition shadow-2xs active:scale-95 ${
                      sourceMode === 'audio'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 border border-blue-200 dark:border-blue-800'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    title="Sumber: Rekaman Audio"
                  >
                    <Radio className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      handleSwitchSourceMode('video');
                      setIsRightPanelOpen(true);
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition shadow-2xs active:scale-95 ${
                      sourceMode === 'video'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 border border-blue-200 dark:border-blue-800'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    title="Sumber: Video & YouTube"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (sourceMode === 'audio') handleCopyAudioTranscript();
                      else if (sourceMode === 'video') handleCopyVideoTranscript();
                      else handleCopyAll(bubbles);
                    }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition shadow-2xs active:scale-95"
                    title="Salin Transkrip"
                  >
                    <Download className="w-4 h-4 text-emerald-500" />
                  </button>
                </div>
              )}
            </div>

          </div>
        </aside>

      </div>

      {/* ======================================================== */}
      {/* GEMINI AI API KEY CONFIGURATION MODAL                   */}
      {/* ======================================================== */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200/60 dark:border-blue-800/60">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Kunci AI Google Gemini
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Transkripsi berkas audio cerdas & berstempel waktu
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction box */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2.5">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Google Gemini API <strong>100% Gratis</strong> untuk penggunaan personal (15 permintaan per menit). Kunci ini digunakan untuk mendengarkan file audio (.m4a, .mp3, .wav) dan mengubahnya menjadi naskah transkripsi secara akurat.
                </p>
              </div>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>Dapatkan Kunci API Gratis di Google AI Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Input field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Kunci API Gemini (AIzaSy...)
              </label>
              <input
                type="password"
                value={geminiApiKeyInput}
                onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                placeholder="Tempelkan kunci API Gemini di sini..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Kunci disimpan secara lokal di browser Anda (LocalStorage) dan tidak dikirim ke pihak ketiga selain Google API.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                disabled={!geminiApiKeyInput.trim()}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Simpan & Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
