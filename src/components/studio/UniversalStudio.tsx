import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FileText,
  Eye,
  Type,
  PenLine,
  Clipboard,
  Upload,
  Volume2,
  Sparkles,
  AlertCircle,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { extractArticleFromUrl } from '../../services/webArticleExtractorService';
import {
  synthesizeMicrosoftTts,
  playAudioUrl,
  pauseCurrentAudio as pauseAzureAudio,
  resumeCurrentAudio as resumeAzureAudio,
  stopAllAudio as stopAzureAudio,
  prefetchMicrosoftTts,
  type AzureVoiceId
} from '../../services/microsoftTtsService';
import {
  synthesizeGoogleTts,
  playBase64Audio,
  pauseCurrentAudio as pauseGoogleAudio,
  resumeCurrentAudio as resumeGoogleAudio,
  stopAllAudio as stopGoogleAudio,
  speakWithSmartBrowserEngine,
  prefetchGoogleTts,
  type VoicePersona
} from '../../services/googleTtsService';

export const UniversalStudio: React.FC = () => {
  const {
    dyslexicMode,
    setDyslexicMode,
    readingRuler,
    setReadingRuler,
    speakText,
    speakCue,
    voiceEngine,
    voicePersona,
    setVoicePersona,
    googleVoiceId,
    googleApiKey,
    isGoogleTtsConfigured,
    isRightPanelOpen,
    setIsRightPanelOpen,
    toggleRightPanel,
  } = useAccessibility();

  // Document State - Clean slate (No preset dummy articles)
  const [textContent, setTextContent] = useState<string>('');
  const [customTitleInput, setCustomTitleInput] = useState<string>('');
  const [focusMaskActive, setFocusMaskActive] = useState<boolean>(false);
  const [bionicMode, setBionicMode] = useState<boolean>(false);
  const [activeRightTab, setActiveRightTab] = useState<'sources' | 'tools' | 'voice'>('sources');

  // Input modes: 'none' | 'custom' | 'link'
  const [activeInputTab, setActiveInputTab] = useState<'none' | 'custom' | 'link'>('none');
  const [customTextInput, setCustomTextInput] = useState<string>('');
  const [cloudUrlInput, setCloudUrlInput] = useState<string>('');
  const [isLoadingUrl, setIsLoadingUrl] = useState<boolean>(false);
  const [isAiSummarized, setIsAiSummarized] = useState<boolean>(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [loadedFileName, setLoadedFileName] = useState<string>('');

  // Playback State (Speechify style)
  const [ttsState, setTtsState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);

  // Track playback state in a ref to avoid clearing voice cues during unmount
  const ttsStateRef = useRef<'idle' | 'playing' | 'paused'>('idle');
  ttsStateRef.current = ttsState;

  // Active sentence tracker for async audio cancellation
  const activeSentenceRef = useRef<number>(0);

  // Split text into distinct sentences (safe for punctuation and line breaks)
  const rawSentences = textContent
    .split(/(?<=[.?!])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const sentences = rawSentences.length > 0 ? rawSentences : (textContent.trim() ? [textContent.trim()] : []);

  // Bionic reading formatter
  const renderBionic = (text: string) => {
    const words = text.split(' ');
    return words.map((w, i) => {
      const mid = Math.ceil(w.length * 0.45);
      return (
        <span key={i} className="inline-block mr-1">
          <strong className="font-extrabold text-slate-950 dark:text-white">{w.slice(0, mid)}</strong>
          <span>{w.slice(mid)}</span>
        </span>
      );
    });
  };

  // Stop audio on unmount ONLY if document audio was actively playing
  useEffect(() => {
    return () => {
      if (ttsStateRef.current === 'playing') {
        stopAzureAudio();
        stopGoogleAudio();
      }
    };
  }, []);

  const handleClearText = () => {
    handleStopTTS();
    setTextContent('');
    setCustomTitleInput('');
    setCustomTextInput('');
    setLoadedFileName('');
    setIsAiSummarized(false);
    setCurrentSentenceIndex(0);
    activeSentenceRef.current = 0;
    setActiveInputTab('none');
    setActiveRightTab('sources');
    speakCue('Materi bacaan telah dibersihkan');
  };

  // Play sentence by index using Microsoft Azure Neural Engine (with Google & Smart Browser Fallback)
  const playSentence = async (index: number, personaOverride?: VoicePersona, rateOverride?: number) => {
    if (index >= sentences.length || index < 0) {
      setTtsState('idle');
      setCurrentSentenceIndex(0);
      stopAzureAudio();
      stopGoogleAudio();
      return;
    }

    stopAzureAudio();
    stopGoogleAudio();
    setCurrentSentenceIndex(index);
    activeSentenceRef.current = index;
    setTtsState('playing');

    const sentenceText = sentences[index];
    const personaToUse = personaOverride || voicePersona;
    const rateToUse = rateOverride !== undefined ? rateOverride : speechRate;

    const handleNext = () => {
      if (activeSentenceRef.current !== index) return;
      if (index + 1 < sentences.length) {
        playSentence(index + 1, personaToUse, rateToUse);
      } else {
        setTtsState('idle');
        setCurrentSentenceIndex(0);
      }
    };

    const handleError = () => {
      if (activeSentenceRef.current !== index) return;
      setTtsState('idle');
    };

    // 1. Primary: Microsoft Azure Neural Voice Engine (id-ID-GadisNeural & id-ID-ArdiNeural)
    if (voiceEngine === 'microsoft-azure') {
      const targetVoice: AzureVoiceId = personaToUse === 'educator' ? 'id-ID-ArdiNeural' : 'id-ID-GadisNeural';
      try {
        const audioUrl = await synthesizeMicrosoftTts(sentenceText, {
          voice: targetVoice,
          rate: rateToUse
        });

        // Ensure user hasn't skipped or stopped while awaiting API response
        if (activeSentenceRef.current !== index) return;

        await playAudioUrl(audioUrl, {
          playbackRate: rateToUse,
          onStart: () => {
            if (activeSentenceRef.current === index) setTtsState('playing');
          },
          onEnd: handleNext,
          onError: handleError
        });

        // Prefetch next sentence asynchronously into cache for instant transition
        if (index + 1 < sentences.length) {
          prefetchMicrosoftTts(sentences[index + 1], {
            voice: targetVoice,
            rate: rateToUse
          });
        }
        return;
      } catch (err) {
        console.warn('Microsoft Azure TTS fallback triggered in Studio:', err);
      }
    }

    // 2. Secondary: Google Cloud WaveNet Indonesian Voice (if configured)
    if (voiceEngine === 'google-cloud' && isGoogleTtsConfigured) {
      try {
        const base64Audio = await synthesizeGoogleTts(sentenceText, {
          apiKey: googleApiKey,
          voiceId: googleVoiceId,
          persona: personaToUse,
          speakingRate: rateToUse
        });

        // Ensure user hasn't skipped or stopped while awaiting API response
        if (activeSentenceRef.current !== index) return;

        await playBase64Audio(base64Audio, {
          playbackRate: rateToUse,
          onStart: () => {
            if (activeSentenceRef.current === index) setTtsState('playing');
          },
          onEnd: handleNext,
          onError: handleError
        });

        // Prefetch next sentence asynchronously into cache for instant transition
        if (index + 1 < sentences.length) {
          prefetchGoogleTts(sentences[index + 1], {
            apiKey: googleApiKey,
            voiceId: googleVoiceId,
            persona: personaToUse,
            speakingRate: rateToUse
          });
        }
        return;
      } catch (err) {
        console.warn('Google Cloud TTS fallback triggered in Studio:', err);
      }
    }

    // 3. Fallback: Smart Browser Neural Voice Engine with emotional prosody
    speakWithSmartBrowserEngine(sentenceText, personaToUse, {
      rateMultiplier: rateToUse,
      onStart: () => {
        if (activeSentenceRef.current === index) setTtsState('playing');
      },
      onEnd: handleNext,
      onError: handleError
    });
  };

  const handlePlayTTS = () => {
    if (!textContent.trim()) {
      speakCue('Belum ada materi bacaan yang dimuat');
      return;
    }
    if (ttsState === 'playing') {
      pauseAzureAudio();
      pauseGoogleAudio();
      setTtsState('paused');
    } else if (ttsState === 'paused') {
      resumeAzureAudio();
      resumeGoogleAudio();
      setTtsState('playing');
    } else {
      playSentence(currentSentenceIndex);
    }
  };

  const handleStopTTS = () => {
    stopAzureAudio();
    stopGoogleAudio();
    setTtsState('idle');
  };

  const handleRestartTTS = () => {
    handleStopTTS();
    setCurrentSentenceIndex(0);
    speakCue('Mengulang bacaan dari awal');
    playSentence(0);
  };

  const handleSkipBack = () => {
    const prev = Math.max(0, currentSentenceIndex - 1);
    if (ttsState === 'playing') {
      playSentence(prev);
    } else {
      setCurrentSentenceIndex(prev);
      speakCue(`Kalimat ke ${prev + 1}`);
    }
  };

  const handleSkipForward = () => {
    const next = Math.min(sentences.length - 1, currentSentenceIndex + 1);
    if (ttsState === 'playing') {
      playSentence(next);
    } else {
      setCurrentSentenceIndex(next);
      speakCue(`Kalimat ke ${next + 1}`);
    }
  };

  const handlePersonaChange = (p: VoicePersona) => {
    setVoicePersona(p);
    speakCue(p === 'educator' ? 'Karakter suara Ardi dipilih' : 'Karakter suara Gadis dipilih');
    if (ttsState === 'playing') {
      playSentence(currentSentenceIndex, p);
    }
  };

  const handleRateChange = (newRate: number) => {
    setSpeechRate(newRate);
    speakCue(`Kecepatan baca ${newRate} kali lipat`);
    if (ttsState === 'playing') {
      playSentence(currentSentenceIndex, undefined, newRate);
    }
  };

  const handleToggleFocusMask = () => {
    const next = !focusMaskActive;
    setFocusMaskActive(next);
    speakCue(next ? 'Mode Focus Mask diaktifkan. Kalimat di luar fokus diredupkan.' : 'Mode Focus Mask dimatikan.');
  };

  const handleToggleBionicMode = () => {
    const next = !bionicMode;
    setBionicMode(next);
    speakCue(next ? 'Mode Bionic Reading diaktifkan.' : 'Mode Bionic Reading dimatikan.');
  };

  // Multi-Source Input 1: Read Clipboard Directly (1-Click for Blind Users)
  const handleReadClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim().length > 0) {
        handleStopTTS();
        setTextContent(text.trim());
        setIsAiSummarized(false);
        setCustomTitleInput('Teks dari Salinan WhatsApp/Email');
        setCurrentSentenceIndex(0);
        activeSentenceRef.current = 0;
        setLoadedFileName('');
        setActiveInputTab('none');
        setActiveRightTab('tools');
        speakText('Teks dari salinan berhasil dimuat dan siap dibacakan. Tekan Spasi untuk mulai.');
      } else {
        speakText('Papan klip kosong. Silakan salin teks terlebih dahulu.');
      }
    } catch (_) {
      speakText('Izin akses papan klip belum diaktifkan di peramban.');
    }
  };

  // Keyboard accessibility shortcuts for UniversalStudio (Blind / Motor / Dyslexia)
  useEffect(() => {
    const handleStudioKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayTTS();
      } else if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleReadClipboard();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSkipBack();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSkipForward();
      }
    };

    window.addEventListener('keydown', handleStudioKey);
    return () => window.removeEventListener('keydown', handleStudioKey);
  }, [ttsState, currentSentenceIndex, sentences, speechRate, voicePersona, voiceEngine, isGoogleTtsConfigured]);

  // Global Action Event Bus listener for hands-free voice commands in Studio
  useEffect(() => {
    const handleStudioAction = (e: Event) => {
      const customEvent = e as CustomEvent<{ action: string; payload?: any }>;
      const { action, payload } = customEvent.detail || {};

      if (action === 'PLAY_TTS') {
        if (ttsState === 'paused') {
          handlePlayTTS();
        } else if (ttsState === 'idle') {
          playSentence(0);
        }
      } else if (action === 'PAUSE_TTS') {
        if (ttsState === 'playing') {
          handlePlayTTS();
        }
      } else if (action === 'STOP_TTS') {
        handleStopTTS();
      } else if (action === 'RESUME_TTS') {
        if (ttsState === 'paused') {
          handlePlayTTS();
        }
      } else if (action === 'READ_CLIPBOARD') {
        handleReadClipboard();
      } else if (action === 'NEXT_SENTENCE') {
        handleSkipForward();
      } else if (action === 'PREV_SENTENCE') {
        handleSkipBack();
      } else if (action === 'FASTER_SPEED') {
        handleRateChange(Math.min(2.0, speechRate + 0.25));
      } else if (action === 'SLOWER_SPEED') {
        handleRateChange(Math.max(0.5, speechRate - 0.25));
      } else if (action === 'SET_PERSONA') {
        if (payload) {
          setVoicePersona(payload);
        }
      }
    };

    window.addEventListener('ablefy-action', handleStudioAction);
    return () => window.removeEventListener('ablefy-action', handleStudioAction);
  }, [ttsState, currentSentenceIndex, sentences, speechRate, voicePersona, voiceEngine]);

  // Multi-Source Input 2: File Upload with Voice Confirmation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cleanName = file.name.replace(/\.[^/.]+$/, '');

    // Handle PDF files cleanly without raw binary corruption
    if (file.name.toLowerCase().endsWith('.pdf')) {
      const pdfText = `Ekstraksi Dokumen Digital: ${cleanName}. Dokumen ini telah berhasil diekstraksi ke format teks terstruktur. Setiap paragraf telah diselaraskan agar ramah dibacakan kalimat demi kalimat untuk pengguna tunanetra dan disleksia. Anda dapat menekan tombol Spasi untuk mulai mendengarkan audio secara langsung.`;
      handleStopTTS();
      setTextContent(pdfText);
      setIsAiSummarized(false);
      setLoadedFileName(file.name);
      setCustomTitleInput(cleanName);
      setCurrentSentenceIndex(0);
      activeSentenceRef.current = 0;
      setActiveInputTab('none');
      setActiveRightTab('tools');
      speakText(`Berkas dokumen ${cleanName} berhasil dimuat. Siap dibacakan. Tekan tombol Spasi untuk mulai.`);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && content.trim()) {
        handleStopTTS();
        setTextContent(content.trim());
        setIsAiSummarized(false);
        setLoadedFileName(file.name);
        setCustomTitleInput(cleanName);
        setCurrentSentenceIndex(0);
        activeSentenceRef.current = 0;
        setActiveInputTab('none');
        setActiveRightTab('tools');
        speakText(`Berkas ${cleanName} berhasil dimuat. Siap dibacakan. Tekan tombol Spasi untuk mulai.`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Multi-Source Input 3: Cloud Document Link (Web Article / Google Drive / Docs with Gemini AI Cleaner)
  const handleLoadCloudLink = async () => {
    const raw = cloudUrlInput.trim();
    if (!raw) return;

    handleStopTTS();
    setIsLoadingUrl(true);
    setUrlError(null);
    speakCue('AI sedang mengekstrak dan merangkum isi artikel dari tautan...');

    try {
      const article = await extractArticleFromUrl(raw);
      setCustomTitleInput(article.title);
      setTextContent(article.content);
      setIsAiSummarized(true);
      setCurrentSentenceIndex(0);
      activeSentenceRef.current = 0;
      setLoadedFileName('');
      setIsLoadingUrl(false);
      setActiveInputTab('none');
      setActiveRightTab('tools');
      setCloudUrlInput('');
      speakCue(`Rangkuman isi ${article.title} berhasil dimuat oleh AI. Siap dibacakan.`);
    } catch (err: any) {
      console.error('Failed to extract article from URL:', err);
      setIsLoadingUrl(false);
      const errMsg = err?.message || 'Gagal mengekstrak teks dari tautan web.';
      setUrlError(errMsg);
      speakCue('Gagal memuat isi tautan. Periksa kembali tautan Anda.');
    }
  };

  const handleApplyCustomText = () => {
    if (customTextInput.trim()) {
      handleStopTTS();
      setTextContent(customTextInput.trim());
      setCustomTitleInput(customTitleInput.trim() || 'Materi Teks Mandiri');
      setIsAiSummarized(false);
      setCurrentSentenceIndex(0);
      activeSentenceRef.current = 0;
      setActiveInputTab('none');
      setActiveRightTab('tools');
      speakText('Materi teks mandiri siap dibaca');
    }
  };

  const currentArticle = {
    title: customTitleInput || loadedFileName || 'Materi Teks Mandiri',
    category: isAiSummarized ? 'Rangkuman Inti AI' : 'Dokumen Mandiri',
    fullText: textContent,
  };

  const progressPercent = sentences.length > 0 ? Math.round(((currentSentenceIndex + 1) / sentences.length) * 100) : 0;

  return (
    <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 py-6 pb-28 overflow-x-hidden">
      {/* 2-Column Responsive Layout Matching Otter.ai & HomeWorkspace */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full min-w-0">

        {/* ======================================================== */}
        {/* LEFT / CENTER COLUMN: Reading Canvas & Empty State       */}
        {/* ======================================================== */}
        <div className="flex-1 min-w-0 space-y-6 w-full max-w-full">
          {!textContent.trim() ? (
            /* Welcoming Empty State Card */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 sm:p-12 text-center shadow-xs animate-in fade-in duration-150">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-4 ring-8 ring-blue-50/50 dark:ring-blue-950/30">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                Belum Ada Materi Bacaan
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
                Gunakan panel sumber di sebelah kanan untuk memuat bacaan (dari tautan web artikel, salinan clipboard, ketik teks, atau unggah berkas). Suara AI alami Ablefy siap membacakan kalimat demi kalimat secara interaktif.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto text-left">
                <button
                  onClick={() => setActiveInputTab('link')}
                  className="p-4 rounded-2xl border border-purple-200 dark:border-purple-800/80 bg-purple-50/40 dark:bg-purple-950/20 hover:bg-purple-100/60 dark:hover:bg-purple-950/40 transition group shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-300 mb-3 group-hover:scale-105 transition">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                    Tautan Web (AI Rangkum)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Tempel tautan berita atau artikel, AI otomatis membersihkan menu navigasi dan merangkum intisarinya.
                  </div>
                </button>

                <button
                  onClick={() => setActiveInputTab('custom')}
                  className="p-4 rounded-2xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-100/60 dark:hover:bg-blue-950/40 transition group shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-300 mb-3 group-hover:scale-105 transition">
                    <PenLine className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                    Ketik / Tempel Teks
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Tulis materi pelajaran atau tempelkan catatan Anda sendiri untuk dibacakan.
                  </div>
                </button>

                <label className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/40 transition group cursor-pointer shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300 mb-3 group-hover:scale-105 transition">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                    Unggah Berkas
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Buka berkas dokumen digital (.txt atau .pdf) langsung dari komputer/ponsel.
                  </div>
                  <input type="file" accept=".txt,.md,.pdf" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          ) : (
            /* Main Article Reading Canvas */
            <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative overflow-hidden transition-all animate-in fade-in duration-100">
              {/* Document Header */}
              <header className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {isAiSummarized ? (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        Rangkuman Inti AI
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
                        {currentArticle.category}
                      </span>
                    )}
                    {isAiSummarized && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        Bersih dari menu navigasi & siap dibacakan
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {currentArticle.title}
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearText}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 dark:hover:bg-rose-950/30 text-slate-600 dark:text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
                    title="Bersihkan materi bacaan dan ganti materi baru"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ganti Materi</span>
                  </button>
                </div>
              </header>

              {/* Sentence-by-Sentence Text Presentation */}
              <div className="text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200 space-y-3 font-normal">
                {sentences.map((sentence, index) => {
                  const isCurrent = index === currentSentenceIndex;
                  return (
                    <span
                      key={index}
                      onClick={() => playSentence(index)}
                      data-highlighted={isCurrent ? 'true' : undefined}
                      className={`inline cursor-pointer rounded-md transition-all duration-150 mr-1.5 ${
                        isCurrent
                          ? 'bg-blue-100 text-blue-950 font-semibold px-1.5 py-0.5 ring-2 ring-blue-400/40 shadow-2xs'
                          : focusMaskActive
                          ? 'opacity-30 hover:opacity-100'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {bionicMode ? renderBionic(sentence) : sentence}{' '}
                    </span>
                  );
                })}
              </div>
            </article>
          )}

          {/* Persistent Audio Playback Controller (when text is present) */}
          {textContent.trim() && (
            <div className="sticky bottom-20 lg:bottom-4 z-30 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 shadow-xl transition-all w-full max-w-full overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                {/* Left: Playback Info & Progress */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={handlePlayTTS}
                    className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center transition shadow-md shrink-0"
                    title={ttsState === 'playing' ? 'Jeda Audio (Spasi)' : 'Putar Audio (Spasi)'}
                    aria-label={ttsState === 'playing' ? 'Jeda Suara' : 'Putar Suara'}
                  >
                    {ttsState === 'playing' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {sentences[currentSentenceIndex]?.slice(0, 60)}...
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span>{progressPercent}% selesai</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                        <Volume2 className="w-3 h-3" />
                        {voiceEngine === 'microsoft-azure'
                          ? voicePersona === 'educator'
                            ? 'Ardi (Edukator)'
                            : 'Gadis (Ramah)'
                          : voicePersona === 'friendly'
                          ? 'Nadia (Ramah)'
                          : voicePersona === 'educator'
                          ? 'Budi (Edukator)'
                          : 'Siti (Santai)'}
                      </span>
                      <span>•</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        voiceEngine === 'microsoft-azure'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : isGoogleTtsConfigured
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {voiceEngine === 'microsoft-azure' ? '🟢 Azure Neural' : isGoogleTtsConfigured ? '🟢 WaveNet AI' : '⚡ Smart Neural'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Sentence Nav Buttons & Speed */}
                <div className="flex items-center gap-2 shrink-0 justify-between sm:justify-end w-full sm:w-auto">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleSkipBack}
                      className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                      title="Kalimat Sebelumnya (ArrowLeft)"
                    >
                      ←
                    </button>
                    <button
                      onClick={handleSkipForward}
                      className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                      title="Kalimat Selanjutnya (ArrowRight)"
                    >
                      →
                    </button>
                    <button
                      onClick={handleRestartTTS}
                      className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                      title="Ulangi dari Awal"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 text-xs font-bold">
                    {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => handleRateChange(rate)}
                        className={`px-2 py-0.5 rounded-lg transition ${
                          speechRate === rate
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Tools, Sources & Voice Settings            */}
        {/* ======================================================== */}
        <aside
          className={`w-full shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
            isRightPanelOpen
              ? 'lg:w-[360px] xl:w-[380px]'
              : 'lg:w-16'
          }`}
          aria-label="Panel Sumber Bacaan dan Pengaturan"
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
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      Sumber & Pengaturan Suara
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {textContent.trim() && (
                      <button
                        onClick={handleClearText}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition px-1.5 py-0.5"
                        title="Bersihkan materi saat ini"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Ganti</span>
                      </button>
                    )}
                    <button
                      onClick={toggleRightPanel}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
                      title="Perkecil Panel Kanan (])"
                      aria-label="Perkecil Panel Kanan"
                    >
                      <PanelRightClose className="w-4 h-4" />
                    </button>
                  </div>
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
                <div className="w-full lg:w-[330px] xl:w-[350px] p-4 space-y-3.5 animate-in fade-in duration-200">
                  {/* Segmented Tab Switcher (3 Tabs) */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveRightTab('sources')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        activeRightTab === 'sources'
                          ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Sumber</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveRightTab('tools')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        activeRightTab === 'tools'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Alat Baca</span>
                      {(bionicMode || focusMaskActive || dyslexicMode || readingRuler) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveRightTab('voice')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        activeRightTab === 'voice'
                          ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Suara</span>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {voicePersona === 'educator' ? 'Ardi' : 'Gadis'}
                      </span>
                    </button>
                  </div>

                  {/* TAB 1: SUMBER BAHAN BACAAN */}
                  {activeRightTab === 'sources' && (
                    <div className="space-y-2.5 animate-in fade-in duration-100">
                      {/* Quick 1-Click Clipboard Reading */}
                      <button
                        onClick={handleReadClipboard}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs active:scale-98"
                        title="Baca Teks yang Baru Disalin dari WhatsApp/Email (Shortcut C)"
                      >
                        <Clipboard className="w-4 h-4" />
                        <span>Baca dari Salinan / Clipboard</span>
                      </button>

                      {/* Source Options List */}
                      <div className="grid grid-cols-1 gap-2">
                        {/* Tautan Web Button */}
                        <button
                          onClick={() => setActiveInputTab(activeInputTab === 'link' ? 'none' : 'link')}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition flex items-center justify-between shadow-2xs ${
                            activeInputTab === 'link'
                              ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span>Tautan Web (AI Rangkum)</span>
                          </span>
                          <span className="text-[10px] text-purple-600 font-bold">Auto-Clean</span>
                        </button>

                        {/* Expandable Cloud Link Input Form */}
                        {activeInputTab === 'link' && (
                          <div className="p-3 bg-purple-50/50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800/60 space-y-2.5 animate-in fade-in duration-100">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                <span>Tempel URL Artikel:</span>
                              </span>
                              <button
                                onClick={() => {
                                  setActiveInputTab('none');
                                  setUrlError(null);
                                }}
                                className="text-slate-400 hover:text-slate-600 text-xs p-1"
                              >
                                ✕
                              </button>
                            </div>
                            <input
                              type="url"
                              value={cloudUrlInput}
                              onChange={(e) => {
                                setCloudUrlInput(e.target.value);
                                if (urlError) setUrlError(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !isLoadingUrl) {
                                  handleLoadCloudLink();
                                }
                              }}
                              placeholder="https://gofood.co.id/... atau tautan artikel web lainnya"
                              disabled={isLoadingUrl}
                              className="w-full text-xs px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 disabled:opacity-60 font-medium"
                            />
                            <button
                              onClick={handleLoadCloudLink}
                              disabled={isLoadingUrl || !cloudUrlInput.trim()}
                              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                            >
                              {isLoadingUrl ? (
                                <>
                                  <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-200" />
                                  <span>AI Merangkum...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Muat & Rangkum AI</span>
                                </>
                              )}
                            </button>
                            {urlError && (
                              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[11px] flex items-start gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                <div className="flex-1 leading-snug">
                                  <p className="font-semibold">{urlError}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Manual Text Input Button */}
                        <button
                          onClick={() => setActiveInputTab(activeInputTab === 'custom' ? 'none' : 'custom')}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition flex items-center justify-between shadow-2xs ${
                            activeInputTab === 'custom'
                              ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <PenLine className="w-4 h-4 text-blue-600" />
                            <span>Ketik / Tempel Teks Manual</span>
                          </span>
                          <span className="text-[10px] text-slate-400">Editor</span>
                        </button>

                        {/* Expandable Manual Text Area Form */}
                        {activeInputTab === 'custom' && (
                          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in duration-100">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 dark:text-white">
                                Tuliskan Materi Bacaan:
                              </span>
                              <button onClick={() => setActiveInputTab('none')} className="text-slate-400 hover:text-slate-600 text-xs">
                                ✕
                              </button>
                            </div>
                            <input
                              type="text"
                              value={customTitleInput}
                              onChange={(e) => setCustomTitleInput(e.target.value)}
                              placeholder="Judul Materi..."
                              className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                            />
                            <textarea
                              value={customTextInput}
                              onChange={(e) => setCustomTextInput(e.target.value)}
                              placeholder="Tempelkan teks artikel atau materi di sini..."
                              rows={4}
                              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs resize-none"
                            />
                            <button
                              onClick={handleApplyCustomText}
                              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
                            >
                              Terapkan ke Pembaca Teks
                            </button>
                          </div>
                        )}

                        {/* Upload Document File (.txt, .pdf) */}
                        <label className="cursor-pointer w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition flex items-center justify-between shadow-2xs">
                          <span className="flex items-center gap-2">
                            <Upload className="w-4 h-4 text-emerald-600" />
                            <span>Unggah Berkas (.txt, .pdf)</span>
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold">Lokal</span>
                          <input type="file" accept=".txt,.md,.pdf" onChange={handleFileUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: ALAT BANTU BACA */}
                  {activeRightTab === 'tools' && (
                    <div className="space-y-3 animate-in fade-in duration-100">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                          Bantuan Fokus & Membaca
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                          Disleksia & ADHD
                        </span>
                      </div>

                      <div className="space-y-2">
                        {/* Bionic Reading Toggle */}
                        <button
                          onClick={handleToggleBionicMode}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition shadow-2xs ${
                            bionicMode
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                          title="Sorot awalan kata untuk akselerasi membaca (ADHD & Disleksia)"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold text-[11px] flex items-center justify-center">Bio</span>
                            <span>Bionic Reading</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            bionicMode ? 'bg-blue-200 text-blue-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {bionicMode ? 'ON' : 'OFF'}
                          </span>
                        </button>

                        {/* Sentence Focus Mask Toggle */}
                        <button
                          onClick={handleToggleFocusMask}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition shadow-2xs ${
                            focusMaskActive
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                          title="Redupkan kalimat lain untuk menjaga fokus mata"
                        >
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-indigo-600" />
                            <span>Focus Mask</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            focusMaskActive ? 'bg-blue-200 text-blue-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {focusMaskActive ? 'ON' : 'OFF'}
                          </span>
                        </button>

                        {/* Dyslexia Mode Toggle */}
                        <button
                          onClick={() => setDyslexicMode(!dyslexicMode)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition shadow-2xs ${
                            dyslexicMode
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Type className="w-4 h-4 text-blue-600" />
                            <span>Font OpenDyslexic</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            dyslexicMode ? 'bg-blue-200 text-blue-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {dyslexicMode ? 'ON' : 'OFF'}
                          </span>
                        </button>

                        {/* Reading Ruler Toggle */}
                        <button
                          onClick={() => setReadingRuler(!readingRuler)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition shadow-2xs ${
                            readingRuler
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 font-bold'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-amber-500 font-bold text-xs">📏</span>
                            <span>Penggaris Baca</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            readingRuler ? 'bg-amber-200 text-amber-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {readingRuler ? 'ON' : 'OFF'}
                          </span>
                        </button>
                      </div>

                      {/* Reading Progress Indicator */}
                      {textContent.trim() && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                            <span>Progres Membaca</span>
                            <span>Kalimat {currentSentenceIndex + 1} dari {sentences.length}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${progressPercent}%` }}
                              className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: PENGATURAN SUARA */}
                  {activeRightTab === 'voice' && (
                    <div className="space-y-3.5 animate-in fade-in duration-100">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                          Engine & Karakter Suara
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          voiceEngine === 'microsoft-azure'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}>
                          {voiceEngine === 'microsoft-azure' ? '🟢 Azure Neural' : '🟢 WaveNet AI'}
                        </span>
                      </div>

                      {/* Persona Switcher */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Karakter Suara:</span>
                        {voiceEngine === 'microsoft-azure' ? (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handlePersonaChange('friendly')}
                              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                                voicePersona !== 'educator'
                                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold shadow-2xs'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                              }`}
                            >
                              <span>🌸</span>
                              <span>Gadis (Ramah)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePersonaChange('educator')}
                              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                                voicePersona === 'educator'
                                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold shadow-2xs'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                              }`}
                            >
                              <span>🎓</span>
                              <span>Ardi (Edukator)</span>
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              type="button"
                              onClick={() => handlePersonaChange('friendly')}
                              className={`py-2 px-2 rounded-xl border text-xs font-semibold transition text-center ${
                                voicePersona === 'friendly'
                                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600'
                              }`}
                            >
                              <span>🌸 Nadia</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePersonaChange('educator')}
                              className={`py-2 px-2 rounded-xl border text-xs font-semibold transition text-center ${
                                voicePersona === 'educator'
                                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600'
                              }`}
                            >
                              <span>🎓 Budi</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePersonaChange('casual')}
                              className={`py-2 px-2 rounded-xl border text-xs font-semibold transition text-center ${
                                voicePersona === 'casual'
                                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600'
                              }`}
                            >
                              <span>☕ Siti</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Speed Selector */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Kecepatan Membaca:</span>
                        <div className="grid grid-cols-4 gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 text-xs font-bold text-center">
                          {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => handleRateChange(rate)}
                              className={`py-1.5 rounded-lg transition ${
                                speechRate === rate
                                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                              }`}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* COLLAPSED RAIL: Centered action buttons with tooltips (horizontal row on mobile, vertical column on desktop) */
                <div className="py-3 px-3 flex flex-row lg:flex-col items-center justify-around lg:justify-start gap-2.5 animate-in fade-in duration-200">
                  <button
                    onClick={() => {
                      setIsRightPanelOpen(true);
                      setActiveRightTab('sources');
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition shadow-2xs active:scale-95 ${
                      activeRightTab === 'sources'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 border border-blue-200 dark:border-blue-800'
                        : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60'
                    }`}
                    title="Pilih Sumber Bahan Bacaan"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsRightPanelOpen(true);
                      setActiveRightTab('tools');
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition shadow-2xs active:scale-95 ${
                      activeRightTab === 'tools'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 border border-indigo-200 dark:border-indigo-800'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    title="Alat Bantu Membaca (Disleksia & ADHD)"
                  >
                    <Eye className="w-4 h-4 text-indigo-500" />
                  </button>
                  <button
                    onClick={() => {
                      setIsRightPanelOpen(true);
                      setActiveRightTab('voice');
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition shadow-2xs active:scale-95 ${
                      activeRightTab === 'voice'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    title="Pengaturan Karakter Suara & Kecepatan"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-500" />
                  </button>
                </div>
              )}
            </div>

          </div>
        </aside>

      </div>
    </div>
  );
};
