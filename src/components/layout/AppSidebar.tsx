import React, { useState } from 'react';
import {
  Home,
  FileText,
  Radio,
  BookOpen,
  Sun,
  Type,
  Volume2,
  VolumeX,
  ChevronRight,
  Keyboard,
  PanelLeftClose,
  PanelLeft,
  Mic,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { AblefyLogo } from '../common/AblefyLogo';

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  onBackToLanding?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  setActiveTab,
  onBackToLanding,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const {
    contrastMode,
    setContrastMode,
    dyslexicMode,
    setDyslexicMode,
    voiceCues,
    setVoiceCues,
    voiceNavActive,
    setVoiceNavActive,
    speakCue,
    setIsShortcutsModalOpen,
  } = useAccessibility();

  const [isAccessExpanded, setIsAccessExpanded] = useState(true);

  // Group 1: Fitur Asisten Mandiri Pengguna Disabilitas (Tunanetra, Teman Tuli, Disleksia)
  const assistiveNavItems = [
    {
      id: 'home',
      label: 'Beranda',
      icon: Home,
    },
    {
      id: 'studio',
      label: 'Pembaca Teks',
      icon: FileText,
    },
    {
      id: 'lecture',
      label: 'Transkripsi Wicara',
      icon: Radio,
    },
  ];

  // Group 2: Jembatan Sosial (Ditempatkan di bagian bawah navigasi untuk masyarakat/teman dengar)
  const communityNavItem = {
    id: 'bisindo',
    label: 'Bahasa Isyarat',
    icon: BookOpen,
  };

  const handleNav = (id: string, label: string) => {
    setActiveTab(id);
    speakCue(`Membuka ruang ${label}`);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200 animate-in fade-in"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 bg-white dark:bg-slate-950 border-r border-slate-200/90 dark:border-slate-800/80 z-40 flex flex-col justify-between select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } lg:translate-x-0 ${
          isCollapsed ? 'lg:w-16' : 'lg:w-64'
        } w-72 max-w-[85vw] lg:shadow-none`}
      >
        {/* 1. Header: Logo & Toggle Collapse / Mobile Close Button */}
        <div className={`border-b border-slate-100 dark:border-slate-800/60 transition-all ${isCollapsed ? 'p-3 flex justify-center' : 'p-3.5'}`}>
          {isCollapsed ? (
            /* COLLAPSED HEADER (Desktop only) */
            <button
              onClick={onToggleCollapse}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Perluas Sidebar"
              aria-label="Perluas Sidebar"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          ) : (
            /* EXPANDED HEADER (Desktop & Mobile) */
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (onBackToLanding) onBackToLanding();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="flex items-center gap-2.5 text-left group focus:outline-none"
                title="Kembali ke Halaman Depan"
              >
                <AblefyLogo className="w-7 h-7 shrink-0 group-hover:scale-105 transition" size={28} />
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                  Ablefy
                </span>
              </button>

              <div className="flex items-center gap-1">
                {/* Desktop Collapse Button */}
                <button
                  onClick={onToggleCollapse}
                  className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Perkecil Sidebar"
                  aria-label="Perkecil Sidebar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>

                {/* Mobile Close Button */}
                <button
                  onClick={onCloseMobile}
                  className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
                  title="Tutup Menu Navigasi"
                  aria-label="Tutup Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

      {/* 2. Center: Navigation Items & Penyesuaian Akses */}
      <div className={`flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
        isCollapsed ? 'px-2 py-3 space-y-3' : 'px-3 py-2.5 space-y-3'
      }`}>
        {/* KELOMPOK 1: ASISTEN DIFABEL */}
        <div>
          {!isCollapsed && (
            <div className="px-3.5 pt-1 pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Asisten Difabel
              </span>
            </div>
          )}
          <nav className="space-y-1">
            {assistiveNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id, item.label)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5'
                  } rounded-xl text-sm transition-all duration-150 group font-medium ${
                    isActive
                      ? 'border-2 border-blue-600 bg-blue-50/80 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-bold shadow-2xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`} />
                  {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* KELOMPOK 2: JEMBATAN SOSIAL */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/60">
          {!isCollapsed && (
            <div className="px-3.5 pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Jembatan Sosial
              </span>
            </div>
          )}
          {(() => {
            const Icon = communityNavItem.icon;
            const isActive = activeTab === communityNavItem.id;
            return (
              <button
                onClick={() => handleNav(communityNavItem.id, communityNavItem.label)}
                title={isCollapsed ? `${communityNavItem.label}` : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5'
                } rounded-xl text-sm transition-all duration-150 group font-medium ${
                  isActive
                    ? 'border-2 border-emerald-600 bg-emerald-50/80 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold shadow-2xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                  isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`} />
                {!isCollapsed && <span className="whitespace-nowrap">{communityNavItem.label}</span>}
              </button>
            );
          })()}
        </div>

        {/* Section: Penyesuaian Akses Cepat */}
        {isCollapsed ? (
          /* COLLAPSED QUICK ACCESS ICONS - Setara dengan ikon menu (w-10 h-10, icon 18px) */
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex flex-col items-center gap-2">
            {/* 1. Panduan Suara */}
            <button
              onClick={() => setVoiceCues(!voiceCues)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                voiceCues ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 shadow-2xs font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Panduan Suara Layar"
              aria-label="Panduan Suara Layar"
            >
              {voiceCues ? <Volume2 className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-[18px] h-[18px]" />}
            </button>

            {/* 2. Navigasi Suara */}
            <button
              onClick={() => setVoiceNavActive(!voiceNavActive)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                voiceNavActive ? 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300 shadow-2xs font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Navigasi Suara Bebas Tangan (V)"
              aria-label="Navigasi Suara Bebas Tangan"
            >
              <Mic className={`w-[18px] h-[18px] ${voiceNavActive ? 'text-rose-600 dark:text-rose-400' : ''}`} />
            </button>

            {/* 3. Font OpenDyslexic */}
            <button
              onClick={() => setDyslexicMode(!dyslexicMode)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                dyslexicMode ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 shadow-2xs font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Font OpenDyslexic"
              aria-label="Font OpenDyslexic"
            >
              <Type className="w-[18px] h-[18px] text-blue-600 dark:text-blue-400" />
            </button>

            {/* 4. Kontras Kuning-Hitam */}
            <button
              onClick={() => setContrastMode(contrastMode === 'yellow-black' ? 'normal' : 'yellow-black')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                contrastMode === 'yellow-black' ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 shadow-2xs font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Kontras Kuning-Hitam (7:1+)"
              aria-label="Kontras Kuning-Hitam"
            >
              <Sun className={`w-[18px] h-[18px] ${contrastMode === 'yellow-black' ? 'text-amber-600 dark:text-amber-400' : ''}`} />
            </button>
          </div>
        ) : (
          /* EXPANDED QUICK ACCESS ACCORDION */
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/60">
            <button
              onClick={() => setIsAccessExpanded(!isAccessExpanded)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300 transition"
            >
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Penyesuaian Akses</span>
              </span>
              <ChevronRight className={`w-3 h-3 transition-transform ${isAccessExpanded ? 'rotate-90' : ''}`} />
            </button>

            {isAccessExpanded && (
              <div className="mt-1 space-y-0.5">
                {/* 1. Panduan Suara Layar */}
                <button
                  onClick={() => setVoiceCues(!voiceCues)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-[13px] transition ${
                    voiceCues
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {voiceCues ? (
                      <Volume2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="truncate">Panduan Suara Layar</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                    voiceCues ? 'bg-emerald-200/80 text-emerald-950' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {voiceCues ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* 2. Navigasi Suara (V) */}
                <button
                  onClick={() => setVoiceNavActive(!voiceNavActive)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-[13px] transition ${
                    voiceNavActive
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Mic className={`w-4 h-4 shrink-0 ${voiceNavActive ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`} />
                    <span className="truncate">Navigasi Suara (V)</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                    voiceNavActive ? 'bg-rose-200/80 text-rose-950' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {voiceNavActive ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* 3. Font OpenDyslexic */}
                <button
                  onClick={() => setDyslexicMode(!dyslexicMode)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-[13px] transition ${
                    dyslexicMode
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Type className={`w-4 h-4 shrink-0 ${dyslexicMode ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">Font OpenDyslexic</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                    dyslexicMode ? 'bg-blue-200/80 text-blue-950' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {dyslexicMode ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* 4. Kontras Kuning-Hitam */}
                <button
                  onClick={() => setContrastMode(contrastMode === 'yellow-black' ? 'normal' : 'yellow-black')}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-[13px] transition ${
                    contrastMode === 'yellow-black'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Sun className={`w-4 h-4 shrink-0 ${contrastMode === 'yellow-black' ? 'text-amber-500' : 'text-slate-400'}`} />
                    <span className="whitespace-nowrap">Kontras Kuning-Hitam</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                    contrastMode === 'yellow-black' ? 'bg-amber-200/80 text-amber-950' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {contrastMode === 'yellow-black' ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Bottom Dock: Pintasan Tombol (Anchored at the bottom) */}
      {isCollapsed ? (
        <div className="p-2.5 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-950 flex justify-center shrink-0">
          <button
            onClick={() => {
              setIsShortcutsModalOpen(true);
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Pintasan Tombol (?)"
            aria-label="Pintasan Tombol"
          >
            <Keyboard className="w-[18px] h-[18px]" />
          </button>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-950 shrink-0">
          <button
            onClick={() => {
              setIsShortcutsModalOpen(true);
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition group shadow-2xs"
            title="Lihat Panduan Pintasan Tombol Aksesibilitas (?)"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-blue-100/80 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <Keyboard className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold truncate">Pintasan Tombol</span>
            </div>
            <kbd className="text-[10px] font-mono font-bold bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-2xs">?</kbd>
          </button>
        </div>
      )}
    </aside>
  </>
  );
};
