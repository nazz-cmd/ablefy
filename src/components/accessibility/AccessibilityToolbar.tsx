import React, { useState, useEffect, useRef } from 'react';
import {
  Sliders,
  Type,
  Eye,
  Volume2,
  VolumeX,
  RotateCcw,
  X,
  Check,
  Bookmark,
  Sun,
  Moon,
  Sparkles,
  Play
} from 'lucide-react';
import { useAccessibility, type ContrastMode, type FontScale } from '../../context/AccessibilityContext';

export const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const {
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
    resetToDefault,
    speakText,
    voiceEngine,
    setVoiceEngine,
    voicePersona,
    setVoicePersona,
    googleApiKey,
    setGoogleApiKey,
    isGoogleTtsConfigured,
  } = useAccessibility();

  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(googleApiKey || '');
  const [keySaved, setKeySaved] = useState(false);

  // Sync tempApiKey when googleApiKey changes
  useEffect(() => {
    setTempApiKey(googleApiKey || '');
  }, [googleApiKey]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        speakText('Menu aksesibilitas ditutup');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, speakText]);

  // Focus modal when opened
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const toggleModal = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      speakText('Menu pengaturan aksesibilitas dibuka. Tekan Escape untuk menutup.');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Button */}
      <button
        onClick={toggleModal}
        aria-expanded={isOpen}
        aria-label="Buka Pengaturan Aksesibilitas Web"
        className="flex items-center gap-2.5 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 font-medium"
      >
        <div className="p-1 bg-white/20 rounded-full">
          <Sliders className="w-5 h-5" />
        </div>
        <span className="hidden sm:inline font-semibold">Aksesibilitas</span>
        <span className="px-1.5 py-0.5 text-xs bg-amber-400 text-slate-950 font-bold rounded-full">
          WCAG
        </span>
      </button>

      {/* Accessibility Panel Modal */}
      {isOpen && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Panel Kontrol Aksesibilitas Universal"
          tabIndex={-1}
          className="fixed bottom-20 right-4 sm:right-6 w-[92vw] sm:w-96 max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 border-2 border-indigo-500/30 rounded-2xl shadow-2xl p-5 z-50 text-slate-900 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold tracking-tight">
                Kontrol Aksesibilitas
              </h2>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                speakText('Menu aksesibilitas ditutup');
              }}
              aria-label="Tutup menu aksesibilitas"
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-5 text-sm">
            {/* 1. Kontras Warna */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-2 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" /> Mode Kontras Tampilan
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'normal', label: 'Standar', icon: Sun },
                  { id: 'yellow-black', label: 'Kuning-Hitam (Low Vision)', icon: Moon },
                  { id: 'high-dark', label: 'Gelap Pekat', icon: Moon },
                  { id: 'monochrome', label: 'Monokrom', icon: Eye },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setContrastMode(item.id as ContrastMode)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-medium transition ${
                      contrastMode === item.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    {contrastMode === item.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Ukuran Teks */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-2 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-indigo-500" /> Ukuran Teks
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { scale: 'normal', label: 'Normal (100%)' },
                  { scale: 'lg', label: 'Besar (+15%)' },
                  { scale: 'xl', label: 'Ekstra (+30%)' },
                ].map((item) => (
                  <button
                    key={item.scale}
                    onClick={() => setFontScale(item.scale as FontScale)}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-medium transition ${
                      fontScale === item.scale
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Bantuan Kognitif & Disleksia */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Alat Bantu Kognitif & Disleksia
              </label>

              {/* Dyslexia Font Toggle */}
              <button
                onClick={() => setDyslexicMode(!dyslexicMode)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition ${
                  dyslexicMode
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-indigo-500" />
                  <span className="text-left">
                    <span className="block font-semibold">Font Ramah Disleksia</span>
                    <span className="text-xs text-slate-500">Menggunakan tipografi OpenDyslexic</span>
                  </span>
                </div>
                <div
                  className={`w-8 h-4 rounded-full transition-colors relative ${
                    dyslexicMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                      dyslexicMode ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </div>
              </button>

              {/* Reading Ruler Toggle */}
              <button
                onClick={() => setReadingRuler(!readingRuler)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition ${
                  readingRuler
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-500" />
                  <span className="text-left">
                    <span className="block font-semibold">Garis Pemandu Baca (Ruler)</span>
                    <span className="text-xs text-slate-500">Membantu mata fokus pada baris teks</span>
                  </span>
                </div>
                <div
                  className={`w-8 h-4 rounded-full transition-colors relative ${
                    readingRuler ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                      readingRuler ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </div>
              </button>

              {/* Audio Voice Cue Toggle */}
              <button
                onClick={() => setVoiceCues(!voiceCues)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition ${
                  voiceCues
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {voiceCues ? (
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="text-left">
                    <span className="block font-semibold">Panduan Suara Interaktif</span>
                    <span className="text-xs text-slate-500">Menyuarakan notifikasi aksi secara vokal</span>
                  </span>
                </div>
                <div
                  className={`w-8 h-4 rounded-full transition-colors relative ${
                    voiceCues ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                      voiceCues ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </div>
              </button>

              {/* Natural Voice Personality & Engine Settings (Microsoft Azure & Google Cloud) */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Karakter Suara Alami Manusia</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    voiceEngine === 'microsoft-azure'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : isGoogleTtsConfigured
                      ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {voiceEngine === 'microsoft-azure' ? '🟢 Azure Neural AI (Gratis)' : isGoogleTtsConfigured ? '🟢 WaveNet AI' : '⚡ Smart Neural'}
                  </span>
                </div>

                {/* Engine Selector Tabs */}
                <div className="flex p-0.5 rounded-lg bg-slate-200/70 dark:bg-slate-700/60 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceEngine('microsoft-azure');
                      speakText('Mesin suara Microsoft Azure Neural diaktifkan.');
                    }}
                    className={`flex-1 py-1 px-2 rounded-md transition text-center ${
                      voiceEngine === 'microsoft-azure'
                        ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    ✨ Microsoft Azure (Gadis/Ardi)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceEngine('google-cloud');
                      speakText('Mesin suara Google Cloud WaveNet diaktifkan.');
                    }}
                    className={`py-1 px-2.5 rounded-md transition text-center ${
                      voiceEngine === 'google-cloud'
                        ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-2xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Google Cloud
                  </button>
                </div>

                {/* Persona Selector Buttons (Contextual per Engine) */}
                {voiceEngine === 'microsoft-azure' ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setVoicePersona('friendly');
                        speakText('Karakter suara Gadis dipilih.', 'friendly');
                      }}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        voicePersona !== 'educator'
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-950 dark:text-indigo-200 font-bold shadow-2xs ring-1 ring-indigo-500/30'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-base">🌸</span>
                      <span className="text-xs font-bold leading-tight">Gadis</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Pemandu Ramah (Wanita)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setVoicePersona('educator');
                        speakText('Karakter suara Ardi dipilih.', 'educator');
                      }}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        voicePersona === 'educator'
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-950 dark:text-indigo-200 font-bold shadow-2xs ring-1 ring-indigo-500/30'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-base">🎓</span>
                      <span className="text-xs font-bold leading-tight">Ardi</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Narasumber Tenang (Pria)</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setVoicePersona('friendly');
                        speakText('Karakter suara Nadia dipilih.', 'friendly');
                      }}
                      className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                        voicePersona === 'friendly'
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-950 dark:text-blue-200 font-bold shadow-2xs'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-sm">🌸</span>
                      <span className="text-[11px] font-bold leading-tight">Nadia</span>
                      <span className="text-[9px] opacity-75">Ramah</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setVoicePersona('educator');
                        speakText('Karakter suara Budi dipilih.', 'educator');
                      }}
                      className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                        voicePersona === 'educator'
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-950 dark:text-blue-200 font-bold shadow-2xs'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-sm">🎓</span>
                      <span className="text-[11px] font-bold leading-tight">Budi</span>
                      <span className="text-[9px] opacity-75">Edukator</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setVoicePersona('casual');
                        speakText('Karakter suara Siti dipilih.', 'casual');
                      }}
                      className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                        voicePersona === 'casual'
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-950 dark:text-blue-200 font-bold shadow-2xs'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-sm">☕</span>
                      <span className="text-[11px] font-bold leading-tight">Siti</span>
                      <span className="text-[9px] opacity-75">Santai</span>
                    </button>
                  </div>
                )}

                {/* Test Voice & Key Configuration Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/80 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      if (voiceEngine === 'microsoft-azure') {
                        const sample = voicePersona === 'educator'
                          ? 'Halo, saya Ardi. Saya siap membacakan teks dan materi Anda dengan artikulasi yang tenang dan jelas.'
                          : 'Halo! Saya Gadis, pemandu suara ramah Anda di Ablefy. Senang sekali bisa mendampingi Anda belajar hari ini.';
                        speakText(sample);
                      } else {
                        const sample = voicePersona === 'educator'
                          ? 'Selamat datang di ruang dengar inklusif. Saya Budi siap membacakan berbagai teks dan materi untuk Anda.'
                          : voicePersona === 'casual'
                          ? 'Hai! Suara santai ini dirancang agar kamu merasa nyaman belajar selayaknya mengobrol.'
                          : 'Halo! Saya Nadia, pemandu suara ramah Anda di Ablefy.';
                        speakText(sample);
                      }
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Uji Suara Sekarang</span>
                  </button>

                  {voiceEngine === 'google-cloud' && (
                    <button
                      type="button"
                      onClick={() => setShowKeyInput(!showKeyInput)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
                    >
                      {showKeyInput ? 'Tutup Pengaturan Kunci' : 'Kunci Google Cloud'}
                    </button>
                  )}
                </div>

                {/* Expandable Google Cloud API Key Setting */}
                {voiceEngine === 'google-cloud' && showKeyInput && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <label className="block text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                      Google Cloud Text-to-Speech API Key:
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="password"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setGoogleApiKey(tempApiKey);
                          setKeySaved(true);
                          speakText('Kunci Google Cloud Text-to-Speech berhasil diperbarui.');
                          setTimeout(() => setKeySaved(false), 2000);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                      >
                        {keySaved ? <Check className="w-3.5 h-3.5" /> : 'Simpan'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-2">
              <button
                onClick={resetToDefault}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset ke Standar Awal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
