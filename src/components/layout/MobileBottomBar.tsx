import React from 'react';
import { Home, Mic, FileText, BookOpen } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface MobileBottomBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { speakCue } = useAccessibility();

  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home, highlight: false },
    { id: 'studio', label: 'Pembaca', icon: FileText, highlight: false },
    { id: 'lecture', label: 'Transkripsi Live', icon: Mic, highlight: true },
    { id: 'bisindo', label: 'Isyarat', icon: BookOpen, highlight: false },
  ];

  const handleNav = (id: string, label: string) => {
    setActiveTab(id);
    speakCue(`Membuka menu ${label}`);
  };

  return (
    <nav
      aria-label="Navigasi Bawah Layar Seluler"
      className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800/90 z-40 flex items-center justify-around px-2 shadow-lg pb-[env(safe-area-inset-bottom)]"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const isHighlight = item.highlight;

        return (
          <button
            key={item.id}
            onClick={() => handleNav(item.id, item.label)}
            className={`relative flex flex-col items-center justify-center min-w-[70px] min-h-[48px] rounded-xl px-2 py-1 transition-all active:scale-95 ${
              isActive
                ? isHighlight
                  ? 'text-rose-600 dark:text-rose-400 font-extrabold bg-rose-50/90 dark:bg-rose-950/50'
                  : 'text-blue-600 dark:text-blue-400 font-extrabold bg-blue-50/90 dark:bg-blue-950/50'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
            aria-current={isActive ? 'page' : undefined}
            title={item.label}
          >
            {/* Live Indicator Pill on Transkripsi button */}
            {isHighlight && (
              <span className="absolute top-1 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
            )}

            <div className="relative">
              <Icon className={`w-[18px] h-[18px] transition-transform ${isActive ? 'scale-110' : ''}`} />
            </div>

            <span className="text-[11px] mt-0.5 tracking-tight font-semibold">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
