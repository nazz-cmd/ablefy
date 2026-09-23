import React, { useEffect } from 'react';
import {
  X,
  ShieldAlert,
  Maximize2,
  Mic,
  MousePointerClick,
  Sparkles
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface MotorShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const MotorShortcutsModal: React.FC<MotorShortcutsModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const {
    tremorShield,
    setTremorShield,
    largeTargetMode,
    setLargeTargetMode,
    voiceNavActive,
    setVoiceNavActive,
    speakText,
  } = useAccessibility();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: '0', label: 'Beranda', target: 'home' },
    { key: '1', label: 'Transkripsi Wicara', target: 'lecture' },
    { key: '2', label: 'Pembaca Teks', target: 'studio' },
    { key: '3', label: 'Bahasa Isyarat', target: 'bisindo' },
    { key: 'Spasi', label: 'Mulai / Jeda Suara', target: null },
    { key: 'V', label: 'Navigasi Suara', target: null },
    { key: 'K', label: 'Kontras Kuning-Hitam', target: null },
    { key: 'C', label: 'Salin Transkrip', target: null },
    { key: 'D', label: 'Unduh Transkrip', target: null },
    { key: '?', label: 'Buka / Tutup Pintasan', target: null },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="motor-modal-title"
        className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 max-w-2xl w-full shadow-2xl z-10 max-h-[92vh] overflow-y-auto space-y-4"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900 shrink-0">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="motor-modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Pintasan & Akses Motorik
                </h2>
                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900">
                  Satu Tangan
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pintasan satu tombol dan bantuan fisik untuk kemudahan navigasi.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Tutup dialog panduan motorik"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Feature Toggles for Physical Accommodations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Tremor Shield Toggle */}
          <button
            onClick={() => setTremorShield(!tremorShield)}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 ${
              tremorShield
                ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-950 dark:text-blue-200 ring-1 ring-blue-600/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <ShieldAlert className={`w-4 h-4 ${tremorShield ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${tremorShield ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                {tremorShield ? 'AKTIF' : 'NONAKTIF'}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Pelindung Tremor</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                Cegah klik ganda tak sengaja
              </div>
            </div>
          </button>

          {/* Large Target Mode Toggle */}
          <button
            onClick={() => setLargeTargetMode(!largeTargetMode)}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 ${
              largeTargetMode
                ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-950 dark:text-blue-200 ring-1 ring-blue-600/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Maximize2 className={`w-4 h-4 ${largeTargetMode ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${largeTargetMode ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                {largeTargetMode ? 'AKTIF' : 'NONAKTIF'}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Target Sentuh 52px+</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                Tombol besar mudah ditekan
              </div>
            </div>
          </button>

          {/* Voice Navigation Toggle */}
          <button
            onClick={() => setVoiceNavActive(!voiceNavActive)}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 ${
              voiceNavActive
                ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-950 dark:text-blue-200 ring-1 ring-blue-600/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Mic className={`w-4 h-4 ${voiceNavActive ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${voiceNavActive ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                {voiceNavActive ? 'AKTIF' : 'NONAKTIF'}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Kontrol Bebas Tangan</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                Navigasi suara mandiri (V)
              </div>
            </div>
          </button>
        </div>

        {/* Section: Single-Key Shortcuts List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Pintasan Tombol Tunggal
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Cukup tekan 1 tombol
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {shortcuts.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (item.target) {
                    onNavigateTab(item.target);
                    speakText(`Beralih ke ${item.label}`);
                    onClose();
                  }
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-xs ${
                  item.target ? 'cursor-pointer hover:bg-blue-50/70 dark:hover:bg-blue-950/40 hover:border-blue-200 dark:hover:border-blue-900 transition' : ''
                }`}
              >
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate pr-2">
                  {item.label}
                </span>
                <kbd className="px-2 py-1 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs font-mono font-bold text-xs shrink-0">
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Switch Device & Hardware Compatibility Note */}
        <div className="px-3.5 py-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            Kompatibel dengan <strong>Switch Access</strong> & sakelar tombol adaptif melalui pemetaan tombol keyboard.
          </span>
        </div>

        {/* Footer Done */}
        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition shadow-xs"
          >
            Tutup (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
