import React, { useState } from 'react';
import {
  Menu,
  X,
  Volume2,
  VolumeX,
  Layers,
  Radio,
  BookOpen,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { voiceCues, setVoiceCues, speakText, activePersona } = useAccessibility();

  const personaLabels: Record<string, { label: string; color: string }> = {
    none: { label: 'Standar', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    vision: { label: 'Low Vision / Tunanetra', color: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200' },
    hearing: { label: 'Teman Tuli', color: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200' },
    dyslexia: { label: 'Disleksia / Fokus', color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' },
    educator: { label: 'Pendidik / Auditor', color: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200' },
  };

  const currentPersonaInfo = personaLabels[activePersona] || personaLabels.none;

  const navItems = [
    { id: 'personas', label: 'Profil Akses', icon: Layers },
    { id: 'lecture', label: 'Transkripsi Suara (Live)', icon: Radio },
    { id: 'studio', label: 'Pembaca Dokumen', icon: FileText },
    { id: 'bisindo', label: 'Papan Isyarat', icon: BookOpen },
    { id: 'auditor', label: 'Evaluasi Akses', icon: ShieldCheck },
  ];

  const handleNavClick = (id: string, label: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    if (voiceCues) {
      speakText(`Membuka menu ${label}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Active Persona Badge */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavClick('personas', 'Profil Akses')}
              className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-1 transition"
              aria-label="Kembali ke Beranda Ablefy"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
                A
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                Ablefy
              </span>
            </button>

            {/* Persona Indicator Chip */}
            <button
              onClick={() => handleNavClick('personas', 'Profil Akses')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition border border-transparent hover:border-slate-300 ${currentPersonaInfo.color}`}
              title="Klik untuk mengganti profil akses"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>Profil: {currentPersonaInfo.label}</span>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.label)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVoiceCues(!voiceCues)}
              title={voiceCues ? 'Matikan panduan suara' : 'Aktifkan panduan suara'}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                voiceCues
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {voiceCues ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden lg:inline">{voiceCues ? 'Suara Aktif' : 'Suara'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-5 space-y-1 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <div className="py-2 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Menu Ruang Belajar
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.label)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
