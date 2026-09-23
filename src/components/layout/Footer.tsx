import React from 'react';

interface FooterProps {
  onNavigate: (tabId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Brand Info */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="font-extrabold text-xl text-slate-900 dark:text-white">
                Ablefy
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                v1.0.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Inovasi platform web aksesibilitas universal untuk memajukan kesetaraan pendidikan inklusif di Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Beranda
            </button>
            <button
              onClick={() => onNavigate('studio')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Studio Multi-Modal
            </button>
            <button
              onClick={() => onNavigate('bisindo')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Kamus BISINDO
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Dampak SDGs
            </button>
          </div>

          {/* Copyright & Info */}
          <div className="text-xs text-slate-400 dark:text-slate-500">
            <p>Ablefy — Asisten Disabilitas</p>
            <p className="mt-0.5">Platform Literasi & Aksesibilitas Digital Universal</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
