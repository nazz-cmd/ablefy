import React from 'react';
import { Home, Radio, FileText, BookOpen } from 'lucide-react';
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
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'studio', label: 'Pembaca', icon: FileText },
    { id: 'lecture', label: 'Transkripsi', icon: Radio },
    { id: 'bisindo', label: 'Isyarat', icon: BookOpen },
  ];

  const handleNav = (id: string, label: string) => {
    setActiveTab(id);
    speakCue(`Membuka menu ${label}`);
  };

  return (
    <nav
      aria-label="Navigasi Bawah Layar"
      className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 z-40 flex items-center justify-around px-3 shadow-sm"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleNav(item.id, item.label)}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] rounded-xl px-2 py-1 transition-all ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/80 dark:bg-blue-950/50'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs mt-0.5 tracking-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
