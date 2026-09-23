import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  Play,
  Pause,
  ArrowRight,
  Keyboard,
  Radio,
  RotateCcw,
  Type,
  Sun,
  Shield,
  SlidersHorizontal,
  ChevronDown,
  Check,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { AblefyLogo } from '../common/AblefyLogo';
import { useAccessibility, type FontScale } from '../../context/AccessibilityContext';
import {
  synthesizeMicrosoftTts,
  playAudioUrl,
  stopAllAudio as stopMicrosoftAudio,
  speakWithBrowserAzureFallback,
  type AzureVoiceId
} from '../../services/microsoftTtsService';

interface LandingPageProps {
  onLaunchApp: (tabId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const {
    contrastMode,
    setContrastMode,
    fontScale,
    setFontScale,
    dyslexicMode,
    setDyslexicMode,
    speakText,
    voiceCues
  } = useAccessibility();

  // --- Navbar Hover Dropdowns State ---
  const [fiturDropdownOpen, setFiturDropdownOpen] = useState<boolean>(false);
  const [a11yDropdownOpen, setA11yDropdownOpen] = useState<boolean>(false);

  // --- Voice Personas State (Microsoft Azure Neural: Gadis & Ardi) ---
  const [selectedVoiceId, setSelectedVoiceId] = useState<'gadis' | 'ardi'>('gadis');

  const voicePersonas = [
    {
      id: 'gadis' as const,
      name: 'Gadis',
      gender: 'Perempuan',
      label: 'Pemandu Ramah & Alami',
      avatar: '🌸',
      voiceId: 'id-ID-GadisNeural' as AzureVoiceId,
      accent: 'Bahasa Indonesia Luwes',
    },
    {
      id: 'ardi' as const,
      name: 'Ardi',
      gender: 'Laki-Laki',
      label: 'Narasumber & Narator Mantap',
      avatar: '🎙️',
      voiceId: 'id-ID-ArdiNeural' as AzureVoiceId,
      accent: 'Bahasa Indonesia Tenang',
    },
  ];

  // Helper to play text with chosen voice persona (powered by Microsoft Azure Neural)
  const speakWithPersona = async (
    text: string,
    personaId: 'gadis' | 'ardi' | string,
    rateMultiplier = 1.0,
    onEnd?: () => void
  ) => {
    stopMicrosoftAudio();

    const targetVoice: AzureVoiceId = personaId === 'ardi' || personaId === 'bima'
      ? 'id-ID-ArdiNeural'
      : 'id-ID-GadisNeural';

    try {
      const audioUrl = await synthesizeMicrosoftTts(text, {
        voice: targetVoice,
        rate: rateMultiplier
      });
      await playAudioUrl(audioUrl, {
        playbackRate: rateMultiplier,
        onEnd: onEnd,
        onError: () => onEnd?.()
      });
    } catch (err) {
      console.warn('Fallback to browser speech on LandingPage:', err);
      speakWithBrowserAzureFallback(text, targetVoice, {
        rate: rateMultiplier,
        onEnd: onEnd,
        onError: () => onEnd?.()
      });
    }
  };

  // --- Hero Interactive Showcase State ---
  const [heroAudioPlaying, setHeroAudioPlaying] = useState<boolean>(false);
  const [heroHighlightWord, setHeroHighlightWord] = useState<number>(0);
  const heroSentence = "Ablefy membantu penyandang disabilitas menyerap informasi dan literasi secara mandiri dalam setiap aktivitas harian.";
  const heroWords = heroSentence.split(' ');

  const handleToggleHeroAudio = () => {
    if (heroAudioPlaying) {
      stopMicrosoftAudio();
      setHeroAudioPlaying(false);
      setHeroHighlightWord(0);
    } else {
      setHeroAudioPlaying(true);
      speakWithPersona(heroSentence, selectedVoiceId, 1.0, () => {
        setHeroAudioPlaying(false);
        setHeroHighlightWord(0);
      });
    }
  };

  // Cycle highlighted word in hero demo when playing
  useEffect(() => {
    if (!heroAudioPlaying) return;
    const interval = setInterval(() => {
      setHeroHighlightWord((prev) => (prev + 1) % heroWords.length);
    }, 400);
    return () => clearInterval(interval);
  }, [heroAudioPlaying, heroWords.length]);

  // --- Feature 1 (Reader) State ---
  const [card1Playing, setCard1Playing] = useState<boolean>(false);
  const [card1Voice, setCard1Voice] = useState<'gadis' | 'ardi'>('gadis');
  const [card1WordIdx, setCard1WordIdx] = useState<number>(0);
  const card1Sentence = "Membacakan dokumen tugas dan artikel dengan irama suara yang tenang serta format ramah disleksia.";
  const card1Words = card1Sentence.split(' ');

  const handleToggleCard1 = () => {
    if (card1Playing) {
      stopMicrosoftAudio();
      setCard1Playing(false);
      setCard1WordIdx(0);
    } else {
      setCard1Playing(true);
      speakWithPersona(card1Sentence, card1Voice, 1.0, () => {
        setCard1Playing(false);
        setCard1WordIdx(0);
      });
    }
  };

  useEffect(() => {
    if (!card1Playing) return;
    const interval = setInterval(() => {
      setCard1WordIdx((prev) => (prev + 1) % card1Words.length);
    }, 450);
    return () => clearInterval(interval);
  }, [card1Playing, card1Words.length]);

  // --- Feature 2 (Live Speech-to-Text) State ---
  const [card2MicListening, setCard2MicListening] = useState<boolean>(false);
  const [card2Transcript, setCard2Transcript] = useState<string>(
    "Setiap percakapan di sekitar Anda akan langsung dikonversi menjadi teks besar waktu-nyata di sini..."
  );
  const recognitionRef = useRef<any>(null);

  const startCard2Mic = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setCard2Transcript("Browser belum mendukung Speech Recognition. Disarankan menggunakan Google Chrome atau Microsoft Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setCard2MicListening(true);
        setCard2Transcript("Mendengarkan suara sekitar secara langsung... Silakan bicara!");
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + ' ';
        }
        setCard2Transcript(currentText.trim());
      };

      recognition.onerror = () => setCard2MicListening(false);
      recognition.onend = () => setCard2MicListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setCard2MicListening(false);
    }
  };

  const stopCard2Mic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setCard2MicListening(false);
    }
  };

  const handleToggleCard2Mic = () => {
    if (card2MicListening) {
      stopCard2Mic();
    } else {
      startCard2Mic();
    }
  };

  // --- Feature 3 (Hands-Free Commands) State ---
  const [activeVoiceCommand, setActiveVoiceCommand] = useState<string>('Baca Dokumen');

  const handleSimulateCommand = (cmd: string) => {
    setActiveVoiceCommand(cmd);
    if (voiceCues) speakText(`Perintah suara: ${cmd}`);
  };

  useEffect(() => {
    return () => {
      stopMicrosoftAudio();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#fafafa] text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* 1. Global Public Navbar (Left Menus with Hover Dropdowns, Open Center, Right CTA Only) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all w-full max-w-full overflow-hidden">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-10 lg:px-14 xl:px-20 h-16 flex items-center justify-between gap-2">
          
          {/* Sisi Kiri: Logo + Menu Dropdown yang Bersebelahan Dekat dengan Logo */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* Logo Ablefy Murni */}
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <AblefyLogo className="w-7 h-7" size={28} />
              <span className="text-lg font-black tracking-tight text-slate-950">Ablefy</span>
            </div>

            {/* Menu Navigasi Sebelah Kiri dengan Dropdown On Hover */}
            <nav aria-label="Navigasi Utama" className="hidden md:flex items-center gap-3">
              
              {/* Dropdown 1: Fitur Asistif (Hover to Open Dropdown) */}
              <div
                className="relative"
                onMouseEnter={() => setFiturDropdownOpen(true)}
                onMouseLeave={() => setFiturDropdownOpen(false)}
              >
                <button
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition"
                  aria-expanded={fiturDropdownOpen}
                >
                  <span>Fitur Asistif</span>
                  <ChevronDown className={`w-4 h-4 opacity-70 transition-transform ${fiturDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {fiturDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => onLaunchApp('studio')}
                      className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50/80 transition text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 group-hover:text-blue-600">
                          Pembaca Teks & Bionic
                        </div>
                        <div className="text-[11px] text-slate-500 leading-snug">
                          Audio fokus per kalimat untuk Sahabat Netra & Disleksia
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => onLaunchApp('lecture')}
                      className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-rose-50/80 transition text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                        <Radio className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 group-hover:text-rose-600">
                          Transkripsi Wicara Live
                        </div>
                        <div className="text-[11px] text-slate-500 leading-snug">
                          Ubah suara sekitar jadi teks langsung untuk Sahabat Tuli
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => onLaunchApp('home')}
                      className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-emerald-50/80 transition text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Keyboard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-600">
                          Navigasi Bebas Tangan
                        </div>
                        <div className="text-[11px] text-slate-500 leading-snug">
                          Kontrol suara & switch access untuk disabilitas fisik
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Dropdown 2: Penyesuaian Akses (Kontras, Disleksia, Skala) */}
              <div
                className="relative"
                onMouseEnter={() => setA11yDropdownOpen(true)}
                onMouseLeave={() => setA11yDropdownOpen(false)}
              >
                <button
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition"
                  aria-expanded={a11yDropdownOpen}
                >
                  <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                  <span>Penyesuaian Akses</span>
                  <ChevronDown className={`w-4 h-4 opacity-70 transition-transform ${a11yDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {a11yDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-84 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-50 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-1">
                      Pengaturan Aksesibilitas Langsung
                    </div>

                    {/* Kontras Tinggi Switch */}
                    <button
                      onClick={() => {
                        setContrastMode(contrastMode === 'yellow-black' ? 'normal' : 'yellow-black');
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 text-xs font-bold transition text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-500" />
                        <span>Kontras Kuning-Hitam (7:1+)</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${contrastMode === 'yellow-black' ? 'bg-amber-400 text-black' : 'bg-slate-100 text-slate-600'}`}>
                        {contrastMode === 'yellow-black' ? 'ON' : 'OFF'}
                      </span>
                    </button>

                    {/* Font OpenDyslexic Switch */}
                    <button
                      onClick={() => {
                        setDyslexicMode(!dyslexicMode);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 text-xs font-bold transition text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 text-blue-600" />
                        <span>Font Ramah Disleksia</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${dyslexicMode ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {dyslexicMode ? 'ON' : 'OFF'}
                      </span>
                    </button>

                    {/* Font Scale Buttons */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-600">Ukuran Teks / Font Scale:</div>
                      <div className="grid grid-cols-3 gap-1">
                        {(['normal', 'lg', 'xl'] as FontScale[]).map((scale) => (
                          <button
                            key={scale}
                            onClick={() => setFontScale(scale)}
                            className={`py-1 rounded-lg text-xs font-bold transition ${
                              fontScale === scale
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-white text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {scale === 'normal' ? '100%' : scale === 'lg' ? '115%' : '130%'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => onLaunchApp('home')}
                        className="w-full py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                      >
                        <span>Buka Semua Pengaturan di Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Area Tengah Kosong (Spacious Center Space ala Otter.ai) */}
          <div className="flex-1" />

          {/* Sisi Kanan: HANYA Tombol Buka Workspace Saja */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => onLaunchApp('home')}
              className="px-3 sm:px-4.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
            >
              <span className="hidden sm:inline">Buka Workspace (Gratis)</span>
              <span className="sm:hidden">Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Left Copywriting + Right Visual Human-like Voice & Live Mockup */}
      <section className="relative overflow-hidden py-10 lg:py-16 border-b border-slate-200/80 bg-white w-full max-w-full">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-10 lg:px-14 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Kolom Kiri: Teks Judul & Subjudul Resmi */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                <span>Ablefy — Asisten Disabilitas</span>
              </div>

              {/* Judul Resmi Sesuai Permintaan */}
              <h1 className="text-2xl sm:text-4xl lg:text-[38px] font-black text-slate-950 tracking-tight leading-[1.2]">
                Menyerap Informasi Tanpa Batas.<br />
                <span className="text-blue-600">
                  Membuka Ruang Literasi untuk Semua.
                </span>
              </h1>

              {/* Subjudul Resmi Sesuai Permintaan */}
              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                Ablefy hadir agar penyandang disabilitas dapat menyerap informasi dan literasi digital secara mandiri dalam setiap aktivitas harian
              </p>

              {/* Tombol Aksi */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => onLaunchApp('studio')}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition active:scale-95"
                >
                  <span>Mulai Sekarang (Gratis)</span>
                  <ArrowRight className="w-4 h-4 text-blue-400" />
                </button>

                <button
                  onClick={() => scrollToSection('fitur-asistif')}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-2xs transition flex items-center gap-2 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                  <span>Jelajahi Fitur Asistif</span>
                </button>
              </div>

              {/* Catatan Inklusif */}
              <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 font-medium">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shadow-2xs" title="Sahabat Netra & Disleksia">👁️</span>
                  <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shadow-2xs" title="Sahabat Tuli">🧏</span>
                  <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shadow-2xs" title="Disabilitas Fisik">♿</span>
                </div>
                <span>100% Berbasis Web • Tanpa Perlu Login • Langsung Pakai</span>
              </div>
            </div>

            {/* Kolom Kanan: Visual Hero Modern dengan Pilihan Suara Cewek & Cowok Alami */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 p-5 sm:p-7 shadow-2xl overflow-hidden">
                {/* Backdrop Glow */}
                <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                {/* Inner Modern Glass Assistant Card */}
                <div className="rounded-2xl bg-slate-950/95 border border-white/20 p-5 sm:p-6 text-white space-y-6 backdrop-blur-md">
                  
                  {/* Bagian Pilihan Karakter Suara Cewek / Cowok (Requirement 4) */}
                  <div className="space-y-3 pb-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span className="text-xs font-extrabold text-white">
                          Pilihan Suara Alami Manusiawi:
                        </span>
                      </div>
                      <span className="text-[10px] text-blue-200 font-bold bg-white/10 px-2 py-0.5 rounded-full">
                        Smooth & Gratis
                      </span>
                    </div>

                    {/* 2 Karakter Suara Alami: Gadis & Ardi */}
                    <div className="grid grid-cols-2 gap-2">
                      {voicePersonas.map((persona) => {
                        const isSelected = selectedVoiceId === persona.id;
                        return (
                          <button
                            key={persona.id}
                            onClick={() => {
                              setSelectedVoiceId(persona.id);
                              speakWithPersona(`Halo, saya ${persona.name}. Saya siap membacakan dokumen untuk Anda.`, persona.id);
                            }}
                            className={`p-2.5 rounded-xl border transition-all text-left group flex flex-col justify-between ${
                              isSelected
                                ? 'bg-blue-600/90 border-blue-400 shadow-md ring-2 ring-blue-400/40'
                                : 'bg-slate-900/80 border-white/10 hover:border-white/30 hover:bg-slate-900'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xl">{persona.avatar}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div className="mt-2">
                              <div className="text-xs font-black text-white">{persona.name}</div>
                              <div className="text-[10px] text-slate-300">{persona.gender}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pratinjau Interaktif Audio Pembaca dengan Sorotan Karaoke */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-400">Pratinjau Suara Kalimat:</span>
                      </div>

                      {/* Equalizer Soundwave Bars */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10">
                        <div className="flex items-end gap-0.5 h-3.5">
                          <span className={`w-1 bg-blue-400 rounded-full transition-all ${heroAudioPlaying ? 'animate-[soundwave_0.7s_ease-in-out_infinite]' : 'h-1'}`} />
                          <span className={`w-1 bg-indigo-400 rounded-full transition-all ${heroAudioPlaying ? 'animate-[soundwave_0.9s_ease-in-out_infinite]' : 'h-2.5'}`} />
                          <span className={`w-1 bg-blue-300 rounded-full transition-all ${heroAudioPlaying ? 'animate-[soundwave_0.6s_ease-in-out_infinite]' : 'h-1.5'}`} />
                          <span className={`w-1 bg-sky-400 rounded-full transition-all ${heroAudioPlaying ? 'animate-[soundwave_0.8s_ease-in-out_infinite]' : 'h-3'}`} />
                        </div>
                        <span className="text-[10px] font-mono text-blue-300 font-bold">
                          {heroAudioPlaying ? 'Suara Aktif' : 'Tekan Putar'}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium min-h-[60px] flex flex-wrap gap-x-1.5 gap-y-1">
                      {heroWords.map((word, idx) => {
                        const isCurrent = heroAudioPlaying && heroHighlightWord === idx;
                        return (
                          <span
                            key={idx}
                            className={`px-1 rounded transition-all duration-150 ${
                              isCurrent
                                ? 'bg-blue-600 text-white font-extrabold scale-105 shadow-md shadow-blue-500/50'
                                : 'text-slate-300'
                            }`}
                          >
                            <strong className="text-white">{word.slice(0, Math.ceil(word.length / 2))}</strong>
                            {word.slice(Math.ceil(word.length / 2))}
                          </span>
                        );
                      })}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={handleToggleHeroAudio}
                        className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 transition active:scale-95 shadow-md ${
                          heroAudioPlaying
                            ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        {heroAudioPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        <span>{heroAudioPlaying ? 'Jeda Suara' : 'Uji Dengarkan Suara Ini'}</span>
                      </button>

                      <button
                        onClick={() => onLaunchApp('studio')}
                        className="text-xs font-bold text-blue-300 hover:text-white flex items-center gap-1"
                      >
                        <span>Buka di Workspace</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Pratinjau Percakapan Transkripsi Live (Speech Bubble) */}
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Transkripsi Wicara Live Ramah Teman Tuli
                      </span>
                      <span>0ms Latensi</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                      "Menyulap suara pembicara langsung menjadi tulisan jernih yang mudah dibaca di layar..."
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FITUR ASISTIF (Desain Tiap Kartu Dibuat Unik, Visual & Tidak Monoton) (#fitur-asistif) */}
      <section id="fitur-asistif" className="py-14 sm:py-20 max-w-[1536px] mx-auto px-4 sm:px-10 lg:px-14 xl:px-20 space-y-12 w-full max-w-full overflow-hidden">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Fasilitas Inklusif
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Fitur Asistif
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Berbagai kemudahan yang dirancang khusus untuk mendukung kemandirian sahabat difabel dalam setiap aktivitas harian.
          </p>
        </div>

        {/* 3 Visual Cards dengan Tampilan Unik Berbeda Sesuai Karakternya */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* TAMPILAN UNIK 1: Pembaca Suara & Bionic (Aksen Kertas Dokumen Biru) */}
          <div className="rounded-3xl bg-gradient-to-b from-blue-50/70 via-white to-white border border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            {/* Visual Header Canvas: Stylized Document Sheet with Voice Selector */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-300">
                  <span>👁️</span>
                  <span>Netra & Disleksia</span>
                </span>

                {/* Persona Switcher Gadis/Ardi di Dalam Kartu */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-blue-200 text-xs font-bold shadow-2xs">
                  <button
                    onClick={() => {
                      setCard1Voice('gadis');
                      if (card1Playing) {
                        speakWithPersona(card1Sentence, 'gadis', 1.0, () => {
                          setCard1Playing(false);
                          setCard1WordIdx(0);
                        });
                      }
                    }}
                    className={`px-2 py-0.5 rounded-lg transition ${card1Voice === 'gadis' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                  >
                    🌸 Gadis
                  </button>
                  <button
                    onClick={() => {
                      setCard1Voice('ardi');
                      if (card1Playing) {
                        speakWithPersona(card1Sentence, 'ardi', 1.0, () => {
                          setCard1Playing(false);
                          setCard1WordIdx(0);
                        });
                      }
                    }}
                    className={`px-2 py-0.5 rounded-lg transition ${card1Voice === 'ardi' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                  >
                    🎓 Ardi
                  </button>
                </div>
              </div>

              {/* Document Sheet Simulation */}
              <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Dokumen Bacaan</span>
                  <span className="text-blue-600 font-bold">Bionic Focus</span>
                </div>

                <p className="text-sm text-slate-800 leading-relaxed min-h-[70px] flex flex-wrap gap-x-1 gap-y-0.5">
                  {card1Words.map((word, idx) => {
                    const isWordActive = card1Playing && card1WordIdx === idx;
                    return (
                      <span
                        key={idx}
                        className={`transition-all duration-150 px-0.5 rounded ${
                          isWordActive
                            ? 'bg-blue-600 text-white font-extrabold shadow-sm scale-105'
                            : 'text-slate-700'
                        }`}
                      >
                        <strong className="text-slate-900">{word.slice(0, Math.ceil(word.length / 2))}</strong>
                        {word.slice(Math.ceil(word.length / 2))}
                      </span>
                    );
                  })}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={handleToggleCard1}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                      card1Playing ? 'bg-amber-400 text-slate-950' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {card1Playing ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{card1Playing ? 'Jeda Audio' : 'Dengarkan Teks'}</span>
                  </button>

                  <span className="text-[11px] text-slate-500 font-medium">Font OpenDyslexic</span>
                </div>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="p-6 pt-0 space-y-4">
              <div>
                <h3 className="text-xl font-black text-slate-950">
                  Pembaca Teks & Bionic Focus
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5">
                  Mendengarkan bacaan buku atau tugas dengan irama suara alami, sorotan kalimat aktif, dan tipografi khusus yang mencegah huruf melompat.
                </p>
              </div>

              <button
                onClick={() => onLaunchApp('studio')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/20 active:scale-95"
              >
                <span>Buka Studio Pembaca Teks</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TAMPILAN UNIK 2: Transkripsi Wicara Live (Aksen Chat Stream Gelap Mawar) */}
          <div className="rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            {/* Visual Header Canvas: Live Streaming Audio Radar */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-950 text-rose-300 border border-rose-800/80">
                  <span>🧏</span>
                  <span>Sahabat Tuli</span>
                </span>

                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-500/40">
                  <span className={`w-1.5 h-1.5 rounded-full bg-rose-500 ${card2MicListening ? 'animate-ping' : ''}`} />
                  {card2MicListening ? 'Merekam Live' : 'Mikrofon Siap'}
                </span>
              </div>

              {/* Chat Stream Bubble Interface */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Suara Percakapan Sekitar</span>
                  <span className="text-rose-400 font-bold">Real-Time</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm italic leading-relaxed min-h-[70px] flex items-center">
                  <p className="line-clamp-3">"{card2Transcript}"</p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <button
                    onClick={handleToggleCard2Mic}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                      card2MicListening
                        ? 'bg-rose-600 text-white ring-2 ring-rose-500/40'
                        : 'bg-white hover:bg-slate-100 text-slate-950'
                    }`}
                  >
                    {card2MicListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-rose-600" />}
                    <span>{card2MicListening ? 'Hentikan' : 'Coba Bicara'}</span>
                  </button>

                  <button
                    onClick={() => setCard2Transcript("Setiap percakapan di sekitar Anda akan langsung dikonversi menjadi teks besar waktu-nyata di sini...")}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                    title="Reset teks"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="p-6 pt-0 space-y-4">
              <div>
                <h3 className="text-xl font-black text-white">
                  Transkripsi Wicara Langsung
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-1.5">
                  Menangkap ucapan pembicara di sekitar, rekan diskusi, atau siaran menjadi teks besar waktu-nyata tanpa tertinggal percakapan.
                </p>
              </div>

              <button
                onClick={() => onLaunchApp('lecture')}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-md shadow-rose-600/30 active:scale-95"
              >
                <span>Mulai Transkripsi Live</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TAMPILAN UNIK 3: Navigasi Bebas Tangan (Aksen Command HUD Zamrud/Hijau) */}
          <div className="rounded-3xl bg-gradient-to-b from-emerald-50/70 via-white to-white border border-emerald-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            {/* Visual Header Canvas: Hands-Free Tactile Radar */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span>♿</span>
                  <span>Fisik & Motorik</span>
                </span>

                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pelindung Tremor</span>
                </div>
              </div>

              {/* Tactile Command Chips HUD */}
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Kontrol Perintah Suara</span>
                  <span className="text-emerald-600 font-bold">Hands-Free</span>
                </div>

                <div className="space-y-1.5 min-h-[70px] flex flex-col justify-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Coba Klik Perintah:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Baca Dokumen', 'Transkripsi', 'Kontras'].map((cmd) => (
                      <button
                        key={cmd}
                        onClick={() => handleSimulateCommand(cmd)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-bold transition ${
                          activeVoiceCommand === cmd
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        "{cmd}"
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                  <span>Switch Access: Tombol Tunggal</span>
                  <span className="text-emerald-700 font-bold">Target 52px+</span>
                </div>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="p-6 pt-0 space-y-4">
              <div>
                <h3 className="text-xl font-black text-slate-950">
                  Navigasi Bebas Tangan & Switch
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5">
                  Mengendalikan seluruh fungsi peramban melalui perintah suara vokal atau tombol sakelar tunggal tanpa perlu sentuhan tangan.
                </p>
              </div>

              <button
                onClick={() => onLaunchApp('home')}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20 active:scale-95"
              >
                <span>Buka Kontrol Bebas Tangan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Bottom Launch Callout (Proportional Wide Container) */}
      <section className="py-14 sm:py-20 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-950 text-white text-center w-full max-w-full overflow-hidden">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Mulai Gunakan Ablefy Sekarang.
          </h2>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Tidak perlu mendaftar. Tidak ada biaya berlangganan. Buka langsung di browser Anda dan rasakan kemudahan akses literasi digital mandiri.
          </p>

          <div className="pt-2">
            <button
              onClick={() => onLaunchApp('home')}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm sm:text-base shadow-2xl flex items-center gap-2.5 mx-auto transition transform hover:scale-105 active:scale-95"
            >
              <span>Buka Workspace Sekarang (Gratis)</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Minimalist Professional Footer (No Competition Watermark) */}
      <footer className="bg-white border-t border-slate-200/90 py-8 sm:py-10 text-slate-500 text-xs w-full max-w-full overflow-hidden">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-10 lg:px-14 xl:px-20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AblefyLogo className="w-6 h-6" size={24} />
            <span className="font-extrabold text-slate-950">Ablefy</span>
            <span>— Asisten Disabilitas • Platform Literasi & Aksesibilitas Digital Universal</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <button onClick={() => onLaunchApp('studio')} className="hover:text-blue-600">Pembaca Teks</button>
            <button onClick={() => onLaunchApp('lecture')} className="hover:text-rose-600">Transkripsi Live</button>
            <button onClick={() => onLaunchApp('home')} className="hover:text-slate-950">Ruang Kerja Asistif</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
