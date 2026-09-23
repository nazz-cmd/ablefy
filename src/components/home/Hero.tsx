import React from 'react';
import {
  Sparkles,
  Volume2,
  Mic,
  Eye,
  ArrowRight,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface HeroProps {
  onNavigate: (tabId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { speakText } = useAccessibility();

  return (
    <div className="relative overflow-hidden py-12 sm:py-20 w-full max-w-full">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[600px] h-[250px] sm:h-[350px] bg-indigo-400/15 dark:bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Karya Inovasi Web Technology Gayatama 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Memampukan Setiap Insan,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-amber-500">
              Menembus Batas Akses.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Platform asistif multi-modal yang mengubah materi belajar dan halaman web menjadi setara untuk semua orang—baik tunanetra, tunarungu, maupun pembaca disleksia.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                onNavigate('studio');
                speakText('Membuka Studio Multi-Modal');
              }}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform hover:scale-105 active:scale-95"
            >
              <Volume2 className="w-5 h-5" />
              <span>Coba Studio Baca & Suara</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onNavigate('bisindo');
                speakText('Membuka Kamus Bahasa Isyarat');
              }}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-base border border-slate-200 dark:border-slate-800 shadow-sm transition"
            >
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Belajar Isyarat BISINDO</span>
            </button>
          </div>

          {/* Quick Badges of Compliance */}
          <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Standar WCAG 2.1 AAA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Ramah Keyboard (Full Tab-Nav)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Dukungan OpenDyslexic & High-Contrast</span>
            </div>
          </div>
        </div>

        {/* 3 Pillar Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Vision / Tunanetra & Low Vision */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Tunanetra & Low-Vision
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Didukung kontrol kontras tinggi (Kuning di atas Hitam) dengan rasio 7:1+, pembaca teks otomatis (Text-to-Speech), dan kompatibilitas screen reader penuh.
              </p>
            </div>
            <button
              onClick={() => onNavigate('studio')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Buka Pembaca Suara &rarr;
            </button>
          </div>

          {/* Card 2: Hearing / Teman Tuli */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Teman Tuli & Gangguan Dengar
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Transkripsi suara pembicara secara real-time langsung ke teks layar berukuran besar, dilengkapi kamus dan kuis interaktif Bahasa Isyarat Indonesia (BISINDO).
              </p>
            </div>
            <button
              onClick={() => onNavigate('bisindo')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Eksplorasi BISINDO &rarr;
            </button>
          </div>

          {/* Card 3: Neurodiversity / Disleksia & ADHD */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Disleksia & Neurodiversity
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Tipografi OpenDyslexic yang mencegah huruf berputar, garis pemandu baca (Reading Ruler), dan penyederhana paragraf panjang menjadi poin intisari cepat.
              </p>
            </div>
            <button
              onClick={() => onNavigate('studio')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Lihat Mode Ramah Disleksia &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
