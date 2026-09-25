import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  Play,
  Pause,
  ArrowRight,
  Radio,
  Shield,
  ChevronDown,
  Menu,
  X,
  Eye,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { AblefyLogo } from '../common/AblefyLogo';
import {
  synthesizeMicrosoftTts,
  playAudioUrl,
  stopAllAudio as stopMicrosoftAudio,
  speakWithBrowserAzureFallback,
  unlockMobileAudio,
  prefetchMicrosoftTts,
  type AzureVoiceId
} from '../../services/microsoftTtsService';

interface LandingPageProps {
  onLaunchApp: (tabId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  // --- Navbar State ---
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activePillarTab, setActivePillarTab] = useState<'netra' | 'tuli' | 'disleksia' | 'motorik'>('netra');
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);
  const [heroImageLoaded, setHeroImageLoaded] = useState<boolean>(false);

  // Helper to play text with chosen voice persona (powered by Microsoft Azure Neural)
  const speakWithPersona = async (
    text: string,
    personaId: 'gadis' | 'ardi' | string,
    rateMultiplier = 1.0,
    onEnd?: () => void
  ) => {
    // Unlock mobile audio stack synchronously within the user tap event
    unlockMobileAudio();
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


  // --- Feature 1 (Reader) State ---
  const [card1Playing, setCard1Playing] = useState<boolean>(false);
  const [card1Voice, setCard1Voice] = useState<'gadis' | 'ardi'>('gadis');
  const card1Sentence = "Membacakan dokumen tugas dan artikel dengan irama suara yang tenang serta format ramah disleksia.";

  const handleToggleCard1 = () => {
    unlockMobileAudio();
    if (card1Playing) {
      stopMicrosoftAudio();
      setCard1Playing(false);
    } else {
      setCard1Playing(true);
      speakWithPersona(card1Sentence, card1Voice, 1.0, () => {
        setCard1Playing(false);
      });
    }
  };

  // --- Feature 2 (Live Speech-to-Text) State ---
  const [card2MicListening, setCard2MicListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  const startCard2Mic = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    try {
      const isMobileDevice = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      // iOS WebKit crashes if continuous is true; single utterance mode ensures mobile reliability
      recognition.continuous = !isMobileDevice;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setCard2MicListening(true);
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

  useEffect(() => {
    // Preload audio samples in background for instant 0ms playback on mobile & desktop
    prefetchMicrosoftTts(card1Sentence, { voice: 'id-ID-GadisNeural' });
    prefetchMicrosoftTts(card1Sentence, { voice: 'id-ID-ArdiNeural' });

    // Preload next section WebP images in background for instant 0ms switching
    const preloadUrls = [
      '/images/hero-3d-netra.webp',
      '/images/hero-3d-tuli.webp',
      '/images/hero-3d-disleksia.webp',
      '/images/hero-3d-motorik.webp',
      '/images/hero-3d-step-1.webp',
      '/images/hero-3d-step-2.webp',
      '/images/hero-3d-step-3.webp'
    ];
    preloadUrls.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

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
      {/* 1. Global Public Navbar (Flat SaaS Aesthetic ala Otter.ai / Linear) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all w-full max-w-full">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-10 lg:px-14 xl:px-20 h-16 flex items-center justify-between gap-4">
          
          {/* Sisi Kiri: Logo + Flat Links Tanpa Dropdown */}
          <div className="flex items-center gap-8 lg:gap-10">
            {/* Logo Ablefy Murni */}
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <AblefyLogo className="w-7 h-7" size={28} />
              <span className="text-xl font-black tracking-tight text-slate-950">Ablefy</span>
            </div>

            {/* Menu Navigasi Datar (Flat Links) Sesuai Referensi Gambar */}
            <nav aria-label="Navigasi Utama" className="hidden md:flex items-center gap-6 lg:gap-8">
              <button
                onClick={() => scrollToSection('fitur-asistif')}
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
              >
                Fitur Asistif
              </button>
              <button
                onClick={() => scrollToSection('ragam-disabilitas')}
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
              >
                Ragam Disabilitas
              </button>
              <button
                onClick={() => scrollToSection('cara-kerja')}
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
              >
                Cara Kerja
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
              >
                FAQ
              </button>
            </nav>
          </div>

          {/* Area Tengah Kosong (Spacious Center Space ala SaaS Modern) */}
          <div className="flex-1" />

          {/* Sisi Kanan: Secondary Action + Primary Pill Button */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <button
              onClick={() => onLaunchApp('home')}
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
            >
              Panduan Akses
            </button>
            <button
              onClick={() => onLaunchApp('home')}
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
            >
              <span>Buka Workspace (Gratis)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Right Controls: CTA button + Mobile Hamburger */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <button
              onClick={() => onLaunchApp('home')}
              className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition active:scale-95 shrink-0"
            >
              Buka Workspace
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer when hamburger opened */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2">
            <button
              onClick={() => { scrollToSection('fitur-asistif'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Fitur Asistif
            </button>
            <button
              onClick={() => { scrollToSection('ragam-disabilitas'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Ragam Disabilitas
            </button>
            <button
              onClick={() => { scrollToSection('cara-kerja'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Cara Kerja
            </button>
            <button
              onClick={() => { scrollToSection('faq'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              FAQ
            </button>
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => { onLaunchApp('home'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2"
              >
                <span>Buka Workspace (Gratis)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
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

            {/* Kolom Kanan: 3D Visual Inklusivitas Disabilitas Modern */}
            <div className="lg:col-span-7">
              <div className="relative group">
                {/* Ambient Soft Glow Behind the 3D Illustration */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-cyan-400/20 rounded-[36px] blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Main 3D Showcase Frame with Shimmer Skeleton */}
                <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-900/5 shadow-2xl shadow-blue-500/10 transition-all duration-300 group-hover:shadow-blue-500/20 min-h-[260px] sm:min-h-[380px] lg:min-h-[420px]">
                  {/* Shimmer Placeholder before Image Loads */}
                  {!heroImageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-blue-50/60 to-slate-100 animate-pulse flex items-center justify-center pointer-events-none z-0">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-600 animate-spin" />
                        <span className="text-[11px] font-semibold text-slate-500">Memuat visual...</span>
                      </div>
                    </div>
                  )}

                  <img
                    src="/images/hero-disability-3d.webp"
                    alt="Ilustrasi 3D Inklusivitas Disabilitas Digital Ablefy"
                    className={`w-full h-auto object-cover transform transition-all duration-700 group-hover:scale-[1.02] ${
                      heroImageLoaded ? 'opacity-100' : 'opacity-0 scale-[0.98]'
                    }`}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    onLoad={() => setHeroImageLoaded(true)}
                  />

                  {/* Gradient Overlay at Bottom of Image for Smooth Badge Integration */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                  {/* Top Floating Glassmorphism Header Bar (Responsive & Anti-Collision) */}
                  <div className="absolute top-2 sm:top-4 left-2 right-2 sm:left-4 sm:right-4 flex items-center justify-between gap-1.5 sm:gap-2 pointer-events-none z-10">
                    {/* Badge 1: Top Left - Suara Alami */}
                    <div className="pointer-events-auto backdrop-blur-xl bg-white/95 text-slate-900 border border-white/70 shadow-md sm:shadow-xl rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-3.5 sm:py-2.5 flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial max-w-[48%] sm:max-w-none min-w-0 transition-all duration-300 hover:scale-105 select-none animate-in fade-in">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] sm:text-xs font-black text-slate-950 leading-tight truncate">Suara Alami</div>
                        <div className="hidden sm:block text-[10px] text-blue-600 font-bold truncate">Sahabat Netra • Azure</div>
                      </div>
                    </div>

                    {/* Badge 2: Top Right - Transkripsi Live */}
                    <div className="pointer-events-auto backdrop-blur-xl bg-slate-950/90 text-white border border-white/20 shadow-md sm:shadow-xl rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-3.5 sm:py-2.5 flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial max-w-[48%] sm:max-w-none min-w-0 transition-all duration-300 hover:scale-105 select-none animate-in fade-in">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Radio className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <span className="text-[10px] sm:text-xs font-black text-white leading-tight truncate">Transkripsi Live</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping shrink-0" />
                        </div>
                        <div className="hidden sm:block text-[10px] text-rose-300 font-bold truncate">Sahabat Tuli • 0ms</div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Glassmorphism Banner 3: Bottom Bar Overlay (Ultra-Sleek on Mobile) */}
                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 backdrop-blur-xl bg-white/95 text-slate-900 border border-white/80 shadow-xl rounded-xl sm:rounded-2xl p-2 sm:p-4 flex items-center justify-between gap-2 sm:gap-3 transition-all z-10">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="flex -space-x-1.5 overflow-hidden shrink-0">
                        <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[9px] sm:text-xs shadow-2xs">👁️</span>
                        <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[9px] sm:text-xs shadow-2xs">🧏</span>
                        <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[9px] sm:text-xs shadow-2xs">📖</span>
                        <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[9px] sm:text-xs shadow-2xs">♿</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] sm:text-sm font-black text-slate-950 truncate">
                          Teknologi Inklusif untuk Semua
                        </div>
                        <div className="text-[9px] sm:text-[11px] text-slate-500 font-medium truncate">
                          Membuka ruang literasi mandiri
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onLaunchApp('home')}
                      className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[10px] sm:text-xs font-bold transition flex items-center justify-center gap-1 shadow-md shadow-blue-500/20 shrink-0"
                    >
                      <span>Coba Sekarang</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PANGGUNG UTAMA RAGAM DISABILITAS & FITUR ASISTIF (Hero-Style Master Stage) (#fitur-asistif, #ragam-disabilitas) */}
      <section id="ragam-disabilitas" className="relative py-16 sm:py-24 border-b border-slate-200/80 bg-white w-full max-w-full overflow-hidden">
        {/* Invisible Anchor for Fitur Asistif Navigation */}
        <div id="fitur-asistif" className="absolute -top-16 left-0 pointer-events-none" />

        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-10 lg:px-14 xl:px-20 space-y-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inklusivitas Digital Mandiri</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-slate-950 tracking-tight leading-[1.2]">
              Solusi Asistif Sesuai Kebutuhan Anda
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Pilih pilar disabilitas di bawah untuk melihat bagaimana Ablefy membuka akses literasi dan perkuliahan mandiri secara nyata.
            </p>

            {/* Top Interactive Capsule Switcher (Tabbed ala Apple / Linear) */}
            <div className="w-full max-w-2xl mx-auto pt-3">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-inner">
                {[
                  { id: 'netra', label: 'Sahabat Netra', icon: '👁️', color: 'blue' },
                  { id: 'tuli', label: 'Sahabat Tuli', icon: '🧏', color: 'rose' },
                  { id: 'disleksia', label: 'Disleksia & ADHD', icon: '📖', color: 'amber' },
                  { id: 'motorik', label: 'Fisik & Motorik', icon: '♿', color: 'emerald' },
                ].map((tab) => {
                  const isActive = activePillarTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActivePillarTab(tab.id as any)}
                      className={`px-3 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 active:scale-95 ${
                        isActive
                          ? 'bg-white text-slate-950 shadow-md shadow-slate-200/80 scale-[1.02]'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                      }`}
                    >
                      <span className="text-base">{tab.icon}</span>
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Master 12-Column Stage (Hero Layout) */}
          <div className="relative group mt-6">
            {/* Ambient Background Glow matching active theme */}
            <div
              className={`absolute -inset-4 rounded-[40px] blur-3xl opacity-60 transition-all duration-700 pointer-events-none ${
                activePillarTab === 'netra'
                  ? 'bg-gradient-to-tr from-blue-500/25 via-indigo-500/20 to-cyan-400/20'
                  : activePillarTab === 'tuli'
                  ? 'bg-gradient-to-tr from-rose-500/25 via-pink-500/20 to-amber-400/20'
                  : activePillarTab === 'disleksia'
                  ? 'bg-gradient-to-tr from-amber-500/25 via-orange-500/20 to-yellow-400/20'
                  : 'bg-gradient-to-tr from-emerald-500/25 via-teal-500/20 to-green-400/20'
              }`}
            />

            {/* Stage Container */}
            <div className="relative rounded-3xl border border-slate-200/90 bg-white shadow-2xl p-6 sm:p-10 lg:p-12 overflow-hidden transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Kolom Kiri: Teks & Fitur Utama */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Dynamic Category Pill */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    {activePillarTab === 'netra' && (
                      <span className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full">
                        🌸 Microsoft Azure Neural 48kHz
                      </span>
                    )}
                    {activePillarTab === 'tuli' && (
                      <span className="bg-rose-100 text-rose-800 border border-rose-200 px-3 py-1 rounded-full">
                        ⚡ Live Speech Recognition • 0ms Delay
                      </span>
                    )}
                    {activePillarTab === 'disleksia' && (
                      <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
                        🎯 Bionic Reader & OpenDyslexic
                      </span>
                    )}
                    {activePillarTab === 'motorik' && (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
                        🎙️ Voice Command & Switch Access
                      </span>
                    )}
                  </div>

                  {/* Headline & Description */}
                  {activePillarTab === 'netra' && (
                    <>
                      <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-950 tracking-tight leading-[1.25]">
                        Mendengar Teks Senatural Teman Bicara Langsung
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                        Suara pembaca Gadis & Ardi yang luwes dan bernapas alami, dirancang khusus agar sahabat netra dapat menyerap buku dan artikel tanpa keletihan telinga.
                      </p>
                      <div className="space-y-2.5 pt-2">
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>Pelafalan Bahasa Indonesia luwes dengan jeda napas kalimat</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>Navigasi ramah screen reader tanpa ketergantungan visual</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>Pengaturan tempo suara luwes dari 0.75x hingga 2.0x</span>
                        </div>
                      </div>
                      <div className="pt-3">
                        <button
                          onClick={() => onLaunchApp('studio')}
                          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition active:scale-95"
                        >
                          <span>Buka Studio Pembaca Teks</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}

                  {activePillarTab === 'tuli' && (
                    <>
                      <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-950 tracking-tight leading-[1.25]">
                        Percakapan Sekitar Terbaca Rapi di Layar Waktu-Nyata
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                        Menangkap ucapan dosen, diskusi kelompok, atau siaran secara langsung menjadi tulisan besar tanpa jeda, lengkap dengan visual isyarat Bisindo.
                      </p>
                      <div className="space-y-2.5 pt-2">
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Transkripsi suara waktu-nyata dengan latensi 0 milidetik</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Tangkap ucapan kuliah dari mikrofon maupun video YouTube</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Dilengkapi referensi visual Bahasa Isyarat Indonesia (Bisindo)</span>
                        </div>
                      </div>
                      <div className="pt-3">
                        <button
                          onClick={() => onLaunchApp('lecture')}
                          className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-500/20 flex items-center gap-2 transition active:scale-95"
                        >
                          <span>Mulai Transkripsi Live</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}

                  {activePillarTab === 'disleksia' && (
                    <>
                      <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-950 tracking-tight leading-[1.25]">
                        Membaca Cepat dan Rapi Tanpa Huruf Melompat
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                        Penebalan suku kata awal terarah menuntun pandangan mata agar tidak bingung, didukung font OpenDyslexic berbobot bawah anti-disorientasi.
                      </p>
                      <div className="space-y-2.5 pt-2">
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Bionic Reading: Menuntun lompatan fiksasi mata alami</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Font OpenDyslexic berbobot gravitasi bawah anti-rotasi huruf</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Reading Ruler: Sorotan baris baca menjaga fokus tidak terdistraksi</span>
                        </div>
                      </div>
                      <div className="pt-3">
                        <button
                          onClick={() => onLaunchApp('studio')}
                          className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center gap-2 transition active:scale-95"
                        >
                          <span>Buka Mode Disleksia</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}

                  {activePillarTab === 'motorik' && (
                    <>
                      <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-950 tracking-tight leading-[1.25]">
                        Kendalikan Layar Sepenuhnya Lewat Suara dan Switch
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                        Navigasi bebas tangan melalui perintah vokal cerdas dan tombol switch access 52px+ dengan peredam tremor untuk kemandirian motorik total.
                      </p>
                      <div className="space-y-2.5 pt-2">
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Perintah suara vokal hands-free (Buka berkas, transkrip, kontras)</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Tremor Shield: Filter cerdas pencegah klik ganda tidak disengaja</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Target tombol jumbo 52px+ untuk sakelar tunggal (Switch Access)</span>
                        </div>
                      </div>
                      <div className="pt-3">
                        <button
                          onClick={() => onLaunchApp('home')}
                          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center gap-2 transition active:scale-95"
                        >
                          <span>Buka Kontrol Bebas Tangan</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Kolom Kanan: The Hero-Grade Visual Experience Frame with 3D Illustration & Glass Badges */}
                <div className="lg:col-span-7">
                  <div className="relative group">
                    {/* Ambient Soft Glow Behind the 3D Illustration matching active theme */}
                    <div
                      className={`absolute -inset-4 rounded-[36px] blur-2xl opacity-75 group-hover:opacity-100 transition-all duration-700 pointer-events-none ${
                        activePillarTab === 'netra'
                          ? 'bg-gradient-to-tr from-blue-500/25 via-indigo-500/20 to-cyan-400/20'
                          : activePillarTab === 'tuli'
                          ? 'bg-gradient-to-tr from-rose-500/25 via-pink-500/20 to-amber-400/20'
                          : activePillarTab === 'disleksia'
                          ? 'bg-gradient-to-tr from-amber-500/25 via-orange-500/20 to-yellow-400/20'
                          : 'bg-gradient-to-tr from-emerald-500/25 via-teal-500/20 to-green-400/20'
                      }`}
                    />

                    {/* Main 3D Showcase Frame */}
                    <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-900/5 shadow-2xl transition-all duration-500 group-hover:shadow-3xl">
                      {/* 3D Thematic Image based on active tab */}
                      <img
                        key={activePillarTab}
                        src={
                          activePillarTab === 'netra'
                            ? '/images/hero-3d-netra.webp'
                            : activePillarTab === 'tuli'
                            ? '/images/hero-3d-tuli.webp'
                            : activePillarTab === 'disleksia'
                            ? '/images/hero-3d-disleksia.webp'
                            : '/images/hero-3d-motorik.webp'
                        }
                        alt={
                          activePillarTab === 'netra'
                            ? 'Ilustrasi 3D Sahabat Netra Ablefy'
                            : activePillarTab === 'tuli'
                            ? 'Ilustrasi 3D Sahabat Tuli Ablefy'
                            : activePillarTab === 'disleksia'
                            ? 'Ilustrasi 3D Disleksia & ADHD Ablefy'
                            : 'Ilustrasi 3D Disabilitas Motorik & Fisik Ablefy'
                        }
                        className="w-full h-[320px] sm:h-[400px] lg:h-[450px] object-cover transform transition-transform duration-700 group-hover:scale-[1.02] animate-in fade-in"
                        loading="lazy"
                        decoding="async"
                      />

                      {/* Gradient Overlay for Crisp Floating Badges */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                      {/* Top Floating Glassmorphism Header Bar (Responsive & Anti-Collision) */}
                      <div className="absolute top-2 sm:top-4 left-2 right-2 sm:left-4 sm:right-4 flex items-center justify-between gap-1.5 sm:gap-2 pointer-events-none z-10">
                        {/* Top Left Floating Glassmorphism Badge */}
                        <div className="pointer-events-auto backdrop-blur-xl bg-white/95 text-slate-900 border border-white/70 shadow-md sm:shadow-xl rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-3.5 sm:py-2.5 flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial max-w-[48%] sm:max-w-none min-w-0 transition-all duration-300 hover:scale-105 select-none animate-in fade-in">
                          {activePillarTab === 'netra' && (
                            <>
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] sm:text-xs font-black text-slate-950 leading-tight truncate">Suara Alami</div>
                                <div className="hidden sm:block text-[10px] text-blue-600 font-bold truncate">Azure Neural 48kHz</div>
                              </div>
                            </>
                          )}
                          {activePillarTab === 'tuli' && (
                            <>
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                <Radio className="w-3 h-3 sm:w-4 sm:h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] sm:text-xs font-black text-slate-950 leading-tight truncate">Transkripsi Live</div>
                                <div className="hidden sm:block text-[10px] text-rose-600 font-bold truncate">Latensi 0ms • Akurat</div>
                              </div>
                            </>
                          )}
                          {activePillarTab === 'disleksia' && (
                            <>
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] sm:text-xs font-black text-slate-950 leading-tight truncate">Bionic Reading</div>
                                <div className="hidden sm:block text-[10px] text-amber-600 font-bold truncate">Fiksasi Mata Rapi</div>
                              </div>
                            </>
                          )}
                          {activePillarTab === 'motorik' && (
                            <>
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] sm:text-xs font-black text-slate-950 leading-tight truncate">Bebas Tangan</div>
                                <div className="hidden sm:block text-[10px] text-emerald-600 font-bold truncate">Perintah Suara & Switch</div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Top Right Floating Glassmorphism Badge */}
                        <div className="pointer-events-auto backdrop-blur-xl bg-slate-950/90 text-white border border-white/20 shadow-md sm:shadow-xl rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-3.5 sm:py-2.5 flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial max-w-[48%] sm:max-w-none min-w-0 transition-all duration-300 hover:scale-105 select-none animate-in fade-in">
                          {activePillarTab === 'netra' && (
                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                              <button
                                onClick={handleToggleCard1}
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition active:scale-95 shrink-0"
                                title={card1Playing ? 'Hentikan Contoh Suara' : 'Dengarkan Contoh Suara'}
                              >
                                {card1Playing ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />}
                              </button>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] sm:text-xs font-black text-white leading-tight truncate">
                                    {card1Playing ? 'Memutar...' : 'Tes Suara'}
                                  </span>
                                  {card1Playing && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping shrink-0" />}
                                </div>
                                <button
                                  onClick={() => setCard1Voice(prev => prev === 'gadis' ? 'ardi' : 'gadis')}
                                  className="hidden sm:block text-[10px] text-blue-300 font-bold hover:underline truncate text-left"
                                  title="Klik untuk mengganti suara"
                                >
                                  Persona: {card1Voice === 'gadis' ? '🌸 Gadis' : '🎙️ Ardi'} ▾
                                </button>
                              </div>
                            </div>
                          )}
                          {activePillarTab === 'tuli' && (
                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                              <button
                                onClick={handleToggleCard2Mic}
                                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition active:scale-95 shrink-0 ${
                                  card2MicListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-white/20 hover:bg-white/30 text-white'
                                }`}
                                title={card2MicListening ? 'Hentikan Mikrofon' : 'Coba Bicara'}
                              >
                                {card2MicListening ? <MicOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Mic className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                              </button>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] sm:text-xs font-black text-white leading-tight truncate">
                                    {card2MicListening ? 'Merekam...' : 'Uji Mic'}
                                  </span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping shrink-0" />
                                </div>
                                <div className="hidden sm:block text-[10px] text-rose-300 font-bold truncate">Live Radar</div>
                              </div>
                            </div>
                          )}
                          {activePillarTab === 'disleksia' && (
                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                                Aa
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] sm:text-xs font-black text-white leading-tight truncate">OpenDyslexic</div>
                                <div className="hidden sm:block text-[10px] text-amber-300 font-bold truncate">Anti-Rotasi Huruf</div>
                              </div>
                            </div>
                          )}
                          {activePillarTab === 'motorik' && (
                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] sm:text-xs font-black text-white leading-tight truncate">Tremor Shield</div>
                                <div className="hidden sm:block text-[10px] text-emerald-300 font-bold truncate">Target 52px+</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Floating Glassmorphism Banner 3: Bottom Bar Overlay (Ultra-Sleek on Mobile) */}
                      <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 backdrop-blur-xl bg-white/95 text-slate-900 border border-white/80 shadow-xl rounded-xl sm:rounded-2xl p-2 sm:p-4 flex items-center justify-between gap-2 sm:gap-3 transition-all z-10">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-lg shrink-0 shadow-xs border border-white/60 bg-slate-100">
                            {activePillarTab === 'netra' && '👁️'}
                            {activePillarTab === 'tuli' && '🧏'}
                            {activePillarTab === 'disleksia' && '📖'}
                            {activePillarTab === 'motorik' && '♿'}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11px] sm:text-sm font-black text-slate-950 truncate">
                              {activePillarTab === 'netra' && 'Sahabat Netra — Literasi Nyata'}
                              {activePillarTab === 'tuli' && 'Sahabat Tuli — Kuliah Terbaca'}
                              {activePillarTab === 'disleksia' && 'Disleksia — Fokus Tanpa Distraksi'}
                              {activePillarTab === 'motorik' && 'Disabilitas Fisik — Kendali Mandiri'}
                            </div>
                            <div className="text-[9px] sm:text-[11px] text-slate-500 font-medium truncate">
                              {activePillarTab === 'netra' && 'Mendengar dokumen dengan intonasi manusiawi'}
                              {activePillarTab === 'tuli' && 'Menangkap pembicaraan ruang kelas seketika'}
                              {activePillarTab === 'disleksia' && 'Membaca artikel dengan bantuan fiksasi bionic'}
                              {activePillarTab === 'motorik' && 'Akses penuh dengan suara atau sakelar tunggal'}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (activePillarTab === 'netra' || activePillarTab === 'disleksia') onLaunchApp('studio');
                            else if (activePillarTab === 'tuli') onLaunchApp('lecture');
                            else onLaunchApp('home');
                          }}
                          className={`hidden sm:flex px-4 py-2 rounded-xl text-white text-xs font-bold transition items-center justify-center gap-1.5 shadow-md shrink-0 active:scale-95 ${
                            activePillarTab === 'netra'
                              ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                              : activePillarTab === 'tuli'
                              ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                              : activePillarTab === 'disleksia'
                              ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                              : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                          }`}
                        >
                          <span>Coba Sekarang</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CARA KERJA (Hero-Style Unified 3-Step Pipeline Stage) (#cara-kerja) */}
      <section id="cara-kerja" className="py-16 sm:py-24 max-w-[1536px] mx-auto px-4 sm:px-10 lg:px-14 xl:px-20 space-y-12 w-full max-w-full overflow-hidden">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alur Penggunaan Terpadu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-slate-950 tracking-tight leading-[1.2]">
            Mulai dalam 3 Langkah Sederhana
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Tidak perlu mengunduh aplikasi berat. Ablefy siap mendampingi Anda langsung di peramban dalam hitungan detik.
          </p>

          {/* Stepper Connected Capsule Bar */}
          <div className="w-full max-w-xl mx-auto pt-4">
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-inner">
              {[
                { step: 1, title: '01. Masukkan Materi', shortTitle: '01. Materi', icon: '📄' },
                { step: 2, title: '02. Pilih Mode Asistif', shortTitle: '02. Mode', icon: '⚙️' },
                { step: 3, title: '03. Serap Mandiri', shortTitle: '03. Mandiri', icon: '✨' },
              ].map((s) => {
                const isActive = activeWorkflowStep === s.step;
                return (
                  <button
                    key={s.step}
                    onClick={() => setActiveWorkflowStep(s.step)}
                    className={`px-2 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 active:scale-95 ${
                      isActive
                        ? 'bg-slate-950 text-white shadow-md shadow-slate-950/20 scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span className="hidden sm:inline">{s.title}</span>
                    <span className="sm:hidden">{s.shortTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Master Workflow Console Stage (Hero-style 12-Column Layout) */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/15 via-indigo-500/15 to-emerald-500/15 rounded-[40px] blur-3xl opacity-60 pointer-events-none" />

          <div className="relative rounded-3xl border border-slate-200/90 bg-white shadow-2xl p-6 sm:p-10 lg:p-12 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Kolom Kiri: Detail Langkah Aktif */}
              <div className="lg:col-span-5 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                  <span>Langkah {activeWorkflowStep} dari 3</span>
                </div>

                {activeWorkflowStep === 1 && (
                  <>
                    <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-950 tracking-tight leading-[1.25]">
                      Masukkan Naskah, Berkas, atau Tangkap Suara
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                      Ketik langsung ide Anda, tempel naskah tugas kuliah, unggah berkas, atau nyalakan mikrofon untuk menangkap materi ruang kelas.
                    </p>
                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Mendukung berkas PDF, Word (DOCX), dan teks polos</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Tangkap audio percakapan dosen atau diskusi sekitar secara live</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Bisa menyalin tautan web materi untuk diringkas otomatis</span>
                      </div>
                    </div>
                  </>
                )}

                {activeWorkflowStep === 2 && (
                  <>
                    <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-950 tracking-tight leading-[1.25]">
                      Pilih dan Personalisasi Mode Asistif
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                      Sesuaikan tampilan dan metode interaksi sesuai kebutuhan unik Anda untuk kenyamanan belajar yang optimal.
                    </p>
                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>Pilih karakter suara Gadis atau Ardi dengan kecepatan luwes</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>Nyalakan bionic reading dan font OpenDyslexic untuk kenyamanan baca</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>Ganti tema kontras tinggi atau aktifkan navigasi suara hands-free</span>
                      </div>
                    </div>
                  </>
                )}

                {activeWorkflowStep === 3 && (
                  <>
                    <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-950 tracking-tight leading-[1.25]">
                      Serap Literasi Mandiri & Unduh Hasilnya
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                      Pahami materi perkuliahan secara setara dan simpan catatan belajar instan ke komputer Anda dalam hitungan detik.
                    </p>
                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Dengarkan bacaan berirama alami dengan sorotan kata aktif</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Simpan dan ekspor hasil transkripsi langsung ke format Word atau TXT</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Semua data tersimpan aman secara privat di perangkat Anda</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Step Action Switcher */}
                <div className="flex items-center gap-3 pt-3">
                  {activeWorkflowStep > 1 && (
                    <button
                      onClick={() => setActiveWorkflowStep(activeWorkflowStep - 1)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition"
                    >
                      ← Sebelumnya
                    </button>
                  )}
                  {activeWorkflowStep < 3 ? (
                    <button
                      onClick={() => setActiveWorkflowStep(activeWorkflowStep + 1)}
                      className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition active:scale-95"
                    >
                      <span>Langkah Berikutnya</span>
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onLaunchApp('home')}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition active:scale-95"
                    >
                      <span>Buka Workspace Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Kolom Kanan: The Visual 3D Workflow Showcase Mockup Frame */}
              <div className="lg:col-span-7">
                <div className="relative group">
                  {/* Ambient Soft Glow Behind Workflow Illustration */}
                  <div
                    className={`absolute -inset-4 rounded-[36px] blur-2xl opacity-75 group-hover:opacity-100 transition-all duration-700 pointer-events-none ${
                      activeWorkflowStep === 1
                        ? 'bg-gradient-to-tr from-blue-500/25 via-indigo-500/20 to-cyan-400/20'
                        : activeWorkflowStep === 2
                        ? 'bg-gradient-to-tr from-purple-500/25 via-indigo-500/20 to-amber-400/20'
                        : 'bg-gradient-to-tr from-emerald-500/25 via-teal-500/20 to-green-400/20'
                    }`}
                  />

                  {/* Main 3D Showcase Frame */}
                  <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-900/5 shadow-2xl transition-all duration-500 group-hover:shadow-3xl">
                    <img
                      key={activeWorkflowStep}
                      src={
                        activeWorkflowStep === 1
                          ? '/images/hero-3d-step-1.webp'
                          : activeWorkflowStep === 2
                          ? '/images/hero-3d-step-2.webp'
                          : '/images/hero-3d-step-3.webp'
                      }
                      alt={
                        activeWorkflowStep === 1
                          ? 'Langkah 1: Masukkan Berkas & Rekam Suara'
                          : activeWorkflowStep === 2
                          ? 'Langkah 2: Pilih & Personalisasi Mode Asistif'
                          : 'Langkah 3: Serap Mandiri & Unduh Hasil'
                      }
                      className="w-full h-[320px] sm:h-[400px] lg:h-[450px] object-cover transform transition-transform duration-700 group-hover:scale-[1.02] animate-in fade-in"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Top Floating Glassmorphism Header Bar (Responsive & Anti-Collision) */}
                    <div className="absolute top-2 sm:top-4 left-2 right-2 sm:left-4 sm:right-4 flex items-center justify-between gap-1.5 sm:gap-2 pointer-events-none z-10">
                      {/* Top Left Floating Badge */}
                      <div className="pointer-events-auto backdrop-blur-xl bg-white/95 text-slate-900 border border-white/70 shadow-md sm:shadow-xl rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-3.5 sm:py-2.5 flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial max-w-[48%] sm:max-w-none min-w-0 transition-all duration-300 hover:scale-105 select-none animate-in fade-in">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs font-black text-[10px] sm:text-xs">
                          0{activeWorkflowStep}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] sm:text-xs font-black text-slate-950 leading-tight truncate">
                            {activeWorkflowStep === 1 && 'Langkah 1: Materi'}
                            {activeWorkflowStep === 2 && 'Langkah 2: Asistif'}
                            {activeWorkflowStep === 3 && 'Langkah 3: Mandiri'}
                          </div>
                          <div className="hidden sm:block text-[10px] text-blue-600 font-bold truncate">
                            {activeWorkflowStep === 1 && 'PDF • DOCX • Suara'}
                            {activeWorkflowStep === 2 && 'Suara • Subtitle • Bionic'}
                            {activeWorkflowStep === 3 && 'Audio 48kHz • Ekspor'}
                          </div>
                        </div>
                      </div>

                      {/* Top Right Floating Badge */}
                      <div className="pointer-events-auto backdrop-blur-xl bg-slate-950/90 text-white border border-white/20 shadow-md sm:shadow-xl rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-3.5 sm:py-2.5 flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial max-w-[48%] sm:max-w-none min-w-0 transition-all duration-300 hover:scale-105 select-none animate-in fade-in">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <span className="text-[10px] sm:text-xs font-black text-white leading-tight truncate">
                              {activeWorkflowStep === 1 && 'Deteksi Cerdas'}
                              {activeWorkflowStep === 2 && 'Personalisasi'}
                              {activeWorkflowStep === 3 && 'Hasil Lengkap'}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                          </div>
                          <div className="hidden sm:block text-[10px] text-emerald-300 font-bold truncate">100% Privat</div>
                        </div>
                      </div>
                    </div>

                    {/* Floating Bottom Glassmorphism Bar (Ultra-Sleek on Mobile) */}
                    <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 backdrop-blur-xl bg-white/95 text-slate-900 border border-white/80 shadow-xl rounded-xl sm:rounded-2xl p-2 sm:p-4 flex items-center justify-between gap-2 sm:gap-3 transition-all z-10">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-lg shrink-0 shadow-xs border border-white/60 bg-blue-50 text-blue-600 font-black">
                          {activeWorkflowStep === 1 ? '📄' : activeWorkflowStep === 2 ? '⚙️' : '✨'}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] sm:text-sm font-black text-slate-950 truncate">
                            {activeWorkflowStep === 1 && 'Materi Kuliah & Diskusi'}
                            {activeWorkflowStep === 2 && 'Konfigurasi Mode Asistif'}
                            {activeWorkflowStep === 3 && 'Literasi Setara & Hasil Mandiri'}
                          </div>
                          <div className="text-[9px] sm:text-[11px] text-slate-500 font-medium truncate">
                            {activeWorkflowStep === 1 && 'Unggah berkas atau tangkap suara langsung'}
                            {activeWorkflowStep === 2 && 'Pilih karakter suara, ukuran font, dan kontras'}
                            {activeWorkflowStep === 3 && 'Dengarkan bacaan alami dan simpan catatan'}
                          </div>
                        </div>
                      </div>

                      {activeWorkflowStep < 3 ? (
                        <button
                          onClick={() => setActiveWorkflowStep(activeWorkflowStep + 1)}
                          className="hidden sm:flex px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold transition items-center justify-center gap-1.5 shadow-md shrink-0"
                        >
                          <span>Langkah Berikutnya</span>
                          <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onLaunchApp('home')}
                          className="hidden sm:flex px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold transition items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 shrink-0"
                        >
                          <span>Buka Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* 6. FAQ (#faq) */}
      <section id="faq" className="py-16 sm:py-24 bg-slate-50/80 border-t border-slate-200/80 w-full max-w-full overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Tanya Jawab
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Jawaban seputar fitur, aksesibilitas, dan kemudahan penggunaan platform Ablefy.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Apakah Ablefy benar-benar gratis digunakan?',
                a: 'Ya, 100% gratis. Tidak ada biaya langganan, tidak ada pembatasan fitur tersembunyi, dan tidak memerlukan login atau kartu kredit.'
              },
              {
                q: 'Apakah saya perlu mengunduh atau menginstal aplikasi?',
                a: 'Tidak perlu. Ablefy berjalan 100% di browser modern (Chrome, Edge, Safari, Firefox) baik di laptop, komputer desktop, tablet, maupun ponsel pintar.'
              },
              {
                q: 'Bagaimana Ablefy membantu sahabat dengan gangguan penglihatan?',
                a: 'Ablefy menyediakan mesin pembaca suara alami bertenaga Microsoft Azure Neural (karakter Gadis & Ardi) dengan pelafalan Bahasa Indonesia yang luwes dan ramah navigasi screen reader.'
              },
              {
                q: 'Bagaimana keamanan privasi suara dan teks saya?',
                a: 'Privasi adalah prioritas mutlak kami. Semua proses transkripsi suara dan pembacaan teks berjalan langsung di sisi peramban Anda secara aman dan tidak disimpan di peladen pihak ketiga.'
              },
              {
                q: 'Bagaimana cara menggunakan kontrol suara tanpa tangan?',
                a: 'Klik ikon mikrofon di bilah atas atau widget mengambang di pojok kanan bawah, lalu ucapkan perintah dalam Bahasa Indonesia seperti "Buka beranda", "Mulai transkrip", atau "Kontras kuning".'
              }
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 flex items-center justify-between gap-3 hover:bg-slate-50 transition"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
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
