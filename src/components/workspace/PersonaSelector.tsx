import React from 'react';
import {
  Eye,
  Mic,
  Brain,
  GraduationCap,
  ArrowRight,
  Check,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useAccessibility, type UserPersona } from '../../context/AccessibilityContext';

interface PersonaSelectorProps {
  onSelectPersonaTab: (tabId: string) => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({ onSelectPersonaTab }) => {
  const { activePersona, applyPersona, resetToDefault } = useAccessibility();

  const personas: {
    id: UserPersona;
    title: string;
    subtitle: string;
    description: string;
    icon: typeof Eye;
    iconColor: string;
    bgColor: string;
    borderColor: string;
    actionLabel: string;
    targetTab: string;
    automatedSettings: string[];
  }[] = [
    {
      id: 'vision',
      title: 'Tunanetra & Low-Vision',
      subtitle: 'Audio Reader & Kontras Tinggi',
      description: 'Menyesuaikan layar agar bebas silau dengan rasio kontras 7:1+ dan mengaktifkan panduan vokal interaktif.',
      icon: Eye,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50/60 dark:bg-amber-950/20',
      borderColor: 'border-amber-200 dark:border-amber-900',
      actionLabel: 'Masuk Studio Audio',
      targetTab: 'studio',
      automatedSettings: ['Mode Kuning di Hitam (7:1+)', 'Ukuran teks besar', 'Panduan suara otomatis']
    },
    {
      id: 'hearing',
      title: 'Teman Tuli & Gangguan Dengar',
      subtitle: 'Subtitle Suara & Bahasa Isyarat',
      description: 'Menyediakan transkripsi ucapan secara real-time ke teks besar dan akses cepat ke kamus isyarat BISINDO.',
      icon: Mic,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50/60 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-900',
      actionLabel: 'Buka Transkripsi Live',
      targetTab: 'lecture',
      automatedSettings: ['Layar live speech caption', 'Papan isyarat cepat', 'Simpan transkrip sesi']
    },
    {
      id: 'dyslexia',
      title: 'Disleksia & ADHD',
      subtitle: 'Tipografi Stabil & Fokus Tenang',
      description: 'Menerapkan font OpenDyslexic dengan garis pemandu membaca agar huruf tidak tampak berputar atau melompat.',
      icon: Brain,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50/60 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-200 dark:border-emerald-900',
      actionLabel: 'Buka Dokumen Tenang',
      targetTab: 'studio',
      automatedSettings: ['Font OpenDyslexic aktif', 'Garis pemandu baca (ruler)', 'Mode bahasa mudah']
    },
    {
      id: 'educator',
      title: 'Pendidik, Pengajar, & Kreator',
      subtitle: 'Audit Kesiapan Aksesibilitas Materi',
      description: 'Membantu pengajar & kreator menguji apakah modul, bahan tayang, dan situs web sudah memenuhi standar WCAG 2.1.',
      icon: GraduationCap,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50/60 dark:bg-indigo-950/20',
      borderColor: 'border-indigo-200 dark:border-indigo-900',
      actionLabel: 'Uji Aksesibilitas Materi',
      targetTab: 'auditor',
      automatedSettings: ['Kalkulator kontras warna', 'Auditor kode HTML', 'Panduan pilar POUR']
    }
  ];

  const handleSelect = (personaId: UserPersona, targetTab: string) => {
    applyPersona(personaId);
    onSelectPersonaTab(targetTab);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner & Context */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalisasi Otomatis (1-Click Setup)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Selamat Datang di Ruang Belajar Inklusif Ablefy
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Pilih profil akses Anda untuk mengonfigurasi seluruh antarmuka secara otomatis, atau pilih alat yang ingin Anda gunakan di bawah.
            </p>
          </div>

          {activePersona !== 'none' && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Atur Ulang Profil</span>
              </button>
            </div>
          )}
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {personas.map((persona) => {
            const Icon = persona.icon;
            const isCurrent = activePersona === persona.id;

            return (
              <div
                key={persona.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${persona.bgColor} ${persona.borderColor} border`}>
                      <Icon className={`w-6 h-6 ${persona.iconColor}`} />
                    </div>
                    {isCurrent && (
                      <span className="flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                        <Check className="w-3 h-3" /> Aktif
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-0.5">
                    {persona.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
                    {persona.subtitle}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {persona.description}
                  </p>

                  <div className="space-y-1 mb-6 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Konfigurasi Otomatis:
                    </span>
                    {persona.automatedSettings.map((setting, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                        <span>{setting}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSelect(persona.id, persona.targetTab)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-sm ${
                    isCurrent
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  aria-label={`Pilih profil ${persona.title} dan ${persona.actionLabel}`}
                >
                  <span>{isCurrent ? 'Lanjutkan Belajar' : persona.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
