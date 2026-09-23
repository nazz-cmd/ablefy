import React, { useEffect } from 'react';
import {
  X,
  Sun,
  Type,
  Volume2,
  VolumeX,
  Check,
  Accessibility,
  Eye,
  Ear,
  Brain,
  GraduationCap,
  Keyboard,
  ShieldAlert,
  Maximize2,
  Mic
} from 'lucide-react';
import { useAccessibility, type FontScale, type UserPersona } from '../../context/AccessibilityContext';

interface MobileQuickAccessSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileQuickAccessSheet: React.FC<MobileQuickAccessSheetProps> = ({ isOpen, onClose }) => {
  const {
    activePersona,
    applyPersona,
    contrastMode,
    setContrastMode,
    dyslexicMode,
    setDyslexicMode,
    voiceCues,
    setVoiceCues,
    fontScale,
    setFontScale,
    tremorShield,
    setTremorShield,
    largeTargetMode,
    setLargeTargetMode,
    voiceNavActive,
    setVoiceNavActive,
    setIsShortcutsModalOpen,
  } = useAccessibility();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const personas: {
    id: UserPersona;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'none', label: 'Standar Inklusif', icon: Accessibility },
    { id: 'vision', label: 'Low Vision / Netra', icon: Eye },
    { id: 'hearing', label: 'Teman Tuli / Dengar', icon: Ear },
    { id: 'dyslexia', label: 'Disleksia / ADHD', icon: Brain },
    { id: 'motor', label: 'Motorik & Fisik', icon: Keyboard },
    { id: 'educator', label: 'Pendidik / Auditor', icon: GraduationCap },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Sheet Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Panel Aksesibilitas Mobile"
        className="relative bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto z-10"
      >
        {/* Handle Bar */}
        <div className="flex justify-center -mt-1 mb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Aksesibilitas & Tampilan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sesuaikan antarmuka sesuai kenyamanan Anda
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Tutup panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona Preset Buttons */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Profil Kebutuhan Difabel
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {personas.map((p) => {
              const isSelected = activePersona === p.id;
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => applyPersona(p.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold border transition text-left ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-2xs ring-1 ring-blue-600/30'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="truncate flex-1">{p.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Scale Pill */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Ukuran Teks
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
            {[
              { scale: 'normal', label: '100% (Normal)' },
              { scale: 'lg', label: '115% (Besar)' },
              { scale: 'xl', label: '130% (Ekstra)' },
            ].map((item) => (
              <button
                key={item.scale}
                onClick={() => setFontScale(item.scale as FontScale)}
                className={`py-2 px-2 text-xs font-bold rounded-lg transition ${
                  fontScale === item.scale
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Fitur Bantuan
          </label>

          {/* Yellow-Black Contrast */}
          <button
            onClick={() => setContrastMode(contrastMode === 'yellow-black' ? 'normal' : 'yellow-black')}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
              contrastMode === 'yellow-black'
                ? 'border-amber-400 bg-amber-50 text-amber-900'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Kontras Tinggi Kuning-Hitam (7:1+)</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${contrastMode === 'yellow-black' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-400'}`}>
              {contrastMode === 'yellow-black' ? 'AKTIF' : 'NONAKTIF'}
            </span>
          </button>

          {/* Dyslexic Font */}
          <button
            onClick={() => setDyslexicMode(!dyslexicMode)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
              dyslexicMode
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Type className="w-4 h-4 text-blue-600" />
              <span>Font Ramah Disleksia (OpenDyslexic)</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${dyslexicMode ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
              {dyslexicMode ? 'AKTIF' : 'NONAKTIF'}
            </span>
          </button>

          {/* Voice Cues */}
          <button
            onClick={() => setVoiceCues(!voiceCues)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
              voiceCues
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {voiceCues ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>Panduan Suara Vokal (Screen Feedback)</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${voiceCues ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              {voiceCues ? 'AKTIF' : 'NONAKTIF'}
            </span>
          </button>

          {/* Tremor Shield (Filter Getaran Ketukan) */}
          <button
            onClick={() => setTremorShield(!tremorShield)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
              tremorShield
                ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Filter Tremor (Cegah Klik Ganda Spasmodik)</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tremorShield ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              {tremorShield ? 'AKTIF' : 'NONAKTIF'}
            </span>
          </button>

          {/* Large Target Mode */}
          <button
            onClick={() => setLargeTargetMode(!largeTargetMode)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
              largeTargetMode
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Maximize2 className="w-4 h-4 text-purple-600" />
              <span>Target Sentuh Ramah Motorik (52px+)</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${largeTargetMode ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              {largeTargetMode ? 'AKTIF' : 'NONAKTIF'}
            </span>
          </button>

          {/* Hands-free Voice Navigator */}
          <button
            onClick={() => setVoiceNavActive(!voiceNavActive)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
              voiceNavActive
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Mic className="w-4 h-4 text-indigo-600" />
              <span>Kontrol Suara Bebas Tangan (Hands-Free)</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${voiceNavActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              {voiceNavActive ? 'AKTIF' : 'NONAKTIF'}
            </span>
          </button>

          {/* Shortcut Sheet Modal Trigger */}
          <button
            onClick={() => {
              onClose();
              setIsShortcutsModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition mt-1"
          >
            <Keyboard className="w-4 h-4 text-slate-600" />
            <span>Panduan Tombol Switch & Pintasan (?)</span>
          </button>
        </div>

        {/* Footer Done */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-sm hover:opacity-90 transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
