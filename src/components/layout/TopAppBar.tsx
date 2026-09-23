import React from 'react';
import {
  Mic,
  Type,
  Menu,
  FileText,
  Radio,
  BookOpen,
  Home,
} from 'lucide-react';
import { useAccessibility, type FontScale } from '../../context/AccessibilityContext';

interface TopAppBarProps {
  activeTab: string;
  onOpenMobileSidebar?: () => void;
  onNavigateTab?: (tabId: string) => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeTab,
  onOpenMobileSidebar,
  onNavigateTab,
}) => {
  const {
    fontScale,
    setFontScale,
    speakCue,
  } = useAccessibility();

  const getModuleInfo = () => {
    switch (activeTab) {
      case 'studio':
        return {
          title: 'Pembaca Teks',
          icon: FileText,
        };
      case 'lecture':
        return {
          title: 'Transkripsi Wicara',
          icon: Radio,
        };
      case 'bisindo':
        return {
          title: 'Bahasa Isyarat',
          icon: BookOpen,
        };
      default:
        return {
          title: 'Beranda',
          icon: Home,
        };
    }
  };

  const moduleInfo = getModuleInfo();
  const ModuleIcon = moduleInfo.icon;

  const handleStartTranscription = () => {
    if (onNavigateTab) {
      onNavigateTab('lecture');
      speakCue('Memulai Transkripsi Wicara Live');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 h-14 px-3 sm:px-6 flex items-center justify-between gap-2 transition-colors w-full max-w-full overflow-hidden">
      {/* Left: Mobile Hamburger & Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {/* Mobile Hamburger to slide open AppSidebar from left */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-1.5 -ml-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 shrink-0"
          title="Buka Menu Navigasi"
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Clean Active Page Title Indicator */}
        <div className="flex items-center gap-2 min-w-0">
          <ModuleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
            {moduleInfo.title}
          </span>
        </div>
      </div>

      {/* Right: Primary Action & Standard Font Scaler */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Quick Action Button on Home: 🎙️ Transkripsi Live */}
        {activeTab === 'home' && (
          <button
            onClick={handleStartTranscription}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[10px] sm:text-xs font-bold shadow-xs transition-all shrink-0"
            title="Mulai Transkripsi Suara Langsung (Hotkey 1)"
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-400 animate-pulse shrink-0" />
            <Mic className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Transkripsi Live</span>
            <span className="sm:hidden">Transkrip</span>
          </button>
        )}

        {/* Direct Font Scaler Pill (100% | 115% | 130%) */}
        <div
          className={`${activeTab === 'home' ? 'hidden sm:flex' : 'flex'} items-center gap-0.5 p-0.5 sm:p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs font-bold shrink-0`}
          role="group"
          aria-label="Pemilih Ukuran Teks"
        >
          <div
            className="hidden xs:flex items-center gap-1 px-1 sm:px-1.5 text-slate-400"
            title="Ukuran Font Pembaca"
          >
            <Type className="w-3.5 h-3.5" />
          </div>
          {[
            { scale: 'normal', label: '100%' },
            { scale: 'lg', label: '115%' },
            { scale: 'xl', label: '130%' },
          ].map((item) => (
            <button
              key={item.scale}
              onClick={() => setFontScale(item.scale as FontScale)}
              title={`Ubah ukuran teks ke ${item.label}`}
              className={`px-1.5 sm:px-2.5 py-0.5 rounded-lg text-[10px] sm:text-xs transition-all ${
                fontScale === item.scale
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-extrabold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
