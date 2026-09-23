import React, { useState } from 'react';
import {
  FileText,
  Radio,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Mic,
  Upload,
  Clipboard,
  Clock,
  Trash2,
  Plus,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface HomeWorkspaceProps {
  onNavigate: (tabId: string) => void;
}

interface HistoryItem {
  id: string;
  type: 'reading' | 'audio' | 'sign';
  title: string;
  moduleName: string;
  timestamp: string;
  details: string;
  snippet: string;
  tabId: string;
}

const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: 'hist-1',
    type: 'reading',
    title: 'Panduan Aksesibilitas Web & Literasi Digital',
    moduleName: 'Pembaca Teks',
    timestamp: '25 menit yang lalu',
    details: '1,420 kata • Bionic Focus • Audio Alami',
    snippet: 'Prinsip desain inklusif memastikan setiap individu, terlepas dari ragam disabilitas sensorik maupun motorik, dapat menyerap informasi secara setara...',
    tabId: 'studio',
  },
  {
    id: 'hist-2',
    type: 'audio',
    title: 'Transkripsi Seminar Inklusi & Teknologi Ramah Difabel',
    moduleName: 'Transkripsi Wicara',
    timestamp: 'Kemarin, 14:15',
    details: '18 menit • 98% Akurasi • Ramah Teman Tuli',
    snippet: 'Pemaparan mengenai akselerasi pembelajaran mandiri dengan integrasi speech-to-text langsung berbasis web browser tanpa unduhan aplikasi...',
    tabId: 'lecture',
  },
  {
    id: 'hist-3',
    type: 'sign',
    title: 'Latihan Kosakata Komunikasi Isyarat Sehari-hari',
    moduleName: 'Bahasa Isyarat',
    timestamp: '2 hari yang lalu',
    details: '12 Isyarat Disimpan • Kamus Interaktif',
    snippet: 'Kumpulan kartu isyarat komunikasi: Salam, Terima Kasih, Mohon Bantuan, Kampus, Belajar Mandiri...',
    tabId: 'bisindo',
  },
];

export const HomeWorkspace: React.FC<HomeWorkspaceProps> = ({ onNavigate }) => {
  const {
    voiceNavActive,
    setVoiceNavActive,
    speakCue,
    setIsShortcutsModalOpen,
    isRightPanelOpen,
    setIsRightPanelOpen,
    toggleRightPanel,
  } = useAccessibility();

  const [filterType, setFilterType] = useState<'all' | 'reading' | 'audio'>('all');
  const [meetingUrlInput, setMeetingUrlInput] = useState('');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(INITIAL_HISTORY);

  const handleLaunch = (tabId: string, label: string) => {
    onNavigate(tabId);
    speakCue(`Membuka ruang ${label}`);
  };

  const handleStartLiveTranscription = () => {
    onNavigate('lecture');
    speakCue('Memulai transkripsi wicara langsung');
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
    speakCue('Riwayat aktivitas telah dibersihkan');
  };

  const filteredHistory = historyItems.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
      {/* 2-Column Responsive Layout Matching Otter.ai */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full min-w-0">
        
        {/* ======================================================== */}
        {/* LEFT / CENTER COLUMN: Activity Feed & Modules            */}
        {/* ======================================================== */}
        <div className="flex-1 min-w-0 space-y-6 w-full max-w-full">
          
          {/* Header Row: Date Filter & "For You" Dropdown (Otter Style) */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Hari Ini, 22 Sep</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </h2>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2">

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition shadow-2xs"
                >
                  <span>{filterType === 'all' ? 'Untuk Anda' : filterType === 'reading' ? 'Bacaan Teks' : 'Transkripsi Suara'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                  {[
                    { id: 'all', label: 'Untuk Anda (Semua)' },
                    { id: 'reading', label: 'Bacaan & Dokumen' },
                    { id: 'audio', label: 'Transkripsi Wicara' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setFilterType(f.id as any);
                        setIsFilterDropdownOpen(false);
                        speakCue(`Filter ${f.label} dipilih`);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition ${
                        filterType === f.id
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

          {/* ======================================================== */}
          {/* FEATURED WELCOME BANNER: Clean, modern SaaS Hero         */}
          {/* ======================================================== */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200">
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Selamat Datang di Ablefy
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                  Platform aksesibilitas mandiri untuk membaca dokumen bersuara, transkripsi wicara seketika, dan komunikasi bahasa isyarat.
                </p>
              </div>

              {/* Action Buttons & Feature Tags */}
              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => handleLaunch('lecture', 'Transkripsi Wicara')}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold transition flex items-center justify-center gap-2 shadow-xs w-full sm:w-auto"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Mulai Transkripsi Live</span>
                </button>
                <button
                  onClick={() => handleLaunch('studio', 'Studio Pembaca Dokumen')}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-2 shadow-2xs w-full sm:w-auto"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Buka Pembaca Dokumen</span>
                </button>
                <button
                  onClick={() => handleLaunch('bisindo', 'Studio Isyarat BISINDO')}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-2 shadow-2xs w-full sm:w-auto"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kamus Isyarat BISINDO</span>
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* HISTORY SECTION: Replaces static modules as requested    */}
          {/* ======================================================== */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  Riwayat Aktivitas & Dokumen
                </h3>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                  {filteredHistory.length}
                </span>
              </div>

              {historyItems.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-slate-400 hover:text-rose-600 transition flex items-center gap-1 shrink-0 ml-1"
                  title="Bersihkan riwayat dokumen"
                >
                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Kosongkan Riwayat</span>
                  <span className="sm:hidden">Hapus</span>
                </button>
              )}
            </div>

            {/* List of History Items */}
            {filteredHistory.length > 0 ? (
              <div className="space-y-2.5">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLaunch(item.tabId, item.title)}
                    className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 sm:p-4 shadow-2xs hover:shadow-md hover:border-blue-400/80 transition-all duration-150 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border group-hover:scale-105 transition ${
                        item.type === 'reading'
                          ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/50 dark:border-blue-900'
                          : item.type === 'audio'
                          ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/50 dark:border-rose-900'
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/50 dark:border-emerald-900'
                      }`}>
                        {item.type === 'reading' && <FileText className="w-5 h-5" />}
                        {item.type === 'audio' && <Radio className="w-5 h-5" />}
                        {item.type === 'sign' && <BookOpen className="w-5 h-5" />}
                      </div>

                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition truncate">
                            {item.title}
                          </h4>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded border shrink-0 ${
                            item.type === 'reading'
                              ? 'text-blue-700 bg-blue-50 border-blue-100'
                              : item.type === 'audio'
                              ? 'text-rose-700 bg-rose-50 border-rose-100'
                              : 'text-emerald-700 bg-emerald-50 border-emerald-100'
                          }`}>
                            {item.moduleName}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <span>{item.timestamp}</span>
                          <span>•</span>
                          <span>{item.details}</span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition shrink-0 self-center">
                      <span>Buka</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* EMPTY HISTORY STATE */
              <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-8 sm:p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Belum Ada Riwayat Aktivitas
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Dokumen yang Anda baca atau percakapan seminar yang Anda transkripsikan akan tersimpan otomatis di sini untuk diakses kembali kapan pun.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => handleLaunch('studio', 'Pembaca Teks')}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Mulai Membaca Dokumen</span>
                  </button>
                  <button
                    onClick={() => handleLaunch('lecture', 'Transkripsi Wicara')}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Mic className="w-3.5 h-3.5 text-rose-500" />
                    <span>Mulai Transkripsi Live</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Companion Action Panel                     */}
        {/* ======================================================== */}
        <aside
          className={`w-full shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
            isRightPanelOpen
              ? 'lg:w-[360px] xl:w-[380px]'
              : 'lg:w-16'
          }`}
          aria-label="Panel Aksi & Pintasan"
        >
          {/* DESKTOP UNIFIED SHELL: Sticky, dynamic height, seamless animation */}
          <div className="hidden lg:flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs sticky top-20 h-fit max-h-[calc(100vh-6.5rem)] overflow-hidden">
            
            {/* Header: Toggle button is right on the box */}
            <div className={`shrink-0 border-b border-slate-100 dark:border-slate-800/80 transition-all ${
              isRightPanelOpen ? 'p-3.5 flex items-center justify-between' : 'p-3 flex justify-center'
            }`}>
              {isRightPanelOpen ? (
                <>
                  <div className="flex items-center gap-2 min-w-0">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      Aksi & Navigasi Cepat
                    </span>
                  </div>
                  <button
                    onClick={toggleRightPanel}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
                    title="Perkecil Panel Kanan (])"
                    aria-label="Perkecil Panel Kanan"
                  >
                    <PanelRightClose className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleRightPanel}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition shadow-2xs border border-transparent hover:border-blue-200 dark:hover:border-blue-800 active:scale-95"
                  title="Perluas Panel Kanan (])"
                  aria-label="Perluas Panel Kanan"
                >
                  <PanelRightOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {isRightPanelOpen ? (
                /* EXPANDED CONTENT: fixed width wrapper to prevent text re-wrapping */
                <div className="w-[330px] xl:w-[350px] p-4 space-y-4 animate-in fade-in duration-200">
                  {/* Card 1: Mulai Transkripsi Cepat */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">
                      Mulai Transkripsi Cepat
                    </span>
                    <input
                      type="text"
                      value={meetingUrlInput}
                      onChange={(e) => setMeetingUrlInput(e.target.value)}
                      placeholder="Topik sesi atau nama materi..."
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 font-medium transition"
                    />
                    <button
                      onClick={handleStartLiveTranscription}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Nyalakan Mikrofon</span>
                    </button>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-slate-800" />

                  {/* Card 2: Buka Bahan Bacaan */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">
                      Buka Bahan Bacaan
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleLaunch('studio', 'Pembaca Teks')}
                        className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        <span>Unggah</span>
                      </button>
                      <button
                        onClick={() => handleLaunch('studio', 'Pembaca Teks')}
                        className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition active:scale-95"
                      >
                        <Clipboard className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tempel</span>
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-slate-800" />

                  {/* Card 3: Navigasi Bebas Tangan */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        Navigasi Bebas Tangan
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                        Tekan V
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      Kendalikan aplikasi dengan perintah suara tanpa menyentuh keyboard.
                    </p>
                    <button
                      onClick={() => setVoiceNavActive(!voiceNavActive)}
                      className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 ${
                        voiceNavActive
                          ? 'bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200 ring-2 ring-rose-500/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <Mic className={`w-3.5 h-3.5 ${voiceNavActive ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`} />
                      <span>{voiceNavActive ? 'Navigasi Suara Aktif (V)' : 'Aktifkan Navigasi Suara'}</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Bantuan Motorik:</span>
                    <button
                      onClick={() => setIsShortcutsModalOpen(true)}
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Pintasan Tombol (?)
                    </button>
                  </div>
                </div>
              ) : (
                /* COLLAPSED RAIL: Centered action buttons with tooltips */
                <div className="py-3 px-1.5 flex flex-col items-center gap-2.5 animate-in fade-in duration-200">
                  <button
                    onClick={handleStartLiveTranscription}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition shadow-2xs active:scale-95"
                    title="Mulai Transkripsi Live"
                  >
                    <Mic className="w-4 h-4 text-rose-500" />
                  </button>
                  <button
                    onClick={() => {
                      setIsRightPanelOpen(true);
                      handleLaunch('studio', 'Pembaca Teks');
                    }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition shadow-2xs active:scale-95"
                    title="Unggah Bahan Bacaan"
                  >
                    <Upload className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => setVoiceNavActive(!voiceNavActive)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition shadow-2xs active:scale-95 ${
                      voiceNavActive
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200 dark:border-rose-800'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    title={voiceNavActive ? 'Navigasi Suara Aktif (V)' : 'Aktifkan Navigasi Suara (V)'}
                  >
                    <Sparkles className="w-4 h-4 text-purple-500" />
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* MOBILE VIEW: Clean Action Card (Always Visible, No Toggle) */}
          <div className="lg:hidden w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs space-y-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Aksi Cepat & Navigasi</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Mulai sesi transkripsi baru atau buka dokumen ke ruang baca:
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div className="space-y-2">
                <input
                  type="text"
                  value={meetingUrlInput}
                  onChange={(e) => setMeetingUrlInput(e.target.value)}
                  placeholder="Nama sesi, topik, atau catatan pembicaraan..."
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={handleStartLiveTranscription}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <Mic className="w-4 h-4" />
                  <span>Nyalakan Mikrofon (Transkripsi Langsung)</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleLaunch('studio', 'Pembaca Teks')}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">Unggah Berkas</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunch('studio', 'Pembaca Teks')}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Clipboard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Baca Salinan</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};
