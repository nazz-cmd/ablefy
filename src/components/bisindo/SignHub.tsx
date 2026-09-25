import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Sparkles,
  Volume2,
  Plus,
  Play,
  Trash2,
  PanelRightClose,
  PanelRightOpen,
  X,
  ArrowRight,
  Copy,
  Check,
  MessageSquareQuote,
  Eye,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { BISINDO_DATA, type SignItem } from '../../data/bisindoData';
import { useAccessibility } from '../../context/AccessibilityContext';

export const SignHub: React.FC = () => {
  const { speakText, isRightPanelOpen, toggleRightPanel } = useAccessibility();
  const [activeTab, setActiveTab] = useState<'kamus' | 'builder'>('builder');
  const [searchQuery, setSearchQuery] = useState('');
  const [paletteSearchQuery, setPaletteSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [selectedDetailSign, setSelectedDetailSign] = useState<SignItem | null>(null);

  // Pagination & View Mode for Kamus Tab
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [kamusViewMode, setKamusViewMode] = useState<'grid' | 'list'>('grid');

  // Sentence Builder State (General starter: Halo, Senang Bertemu, Belajar)
  const [sentenceSequence, setSentenceSequence] = useState<SignItem[]>([
    BISINDO_DATA[0],  // Halo / Hai
    BISINDO_DATA[14], // Senang Bertemu
    BISINDO_DATA[27], // Belajar
  ]);
  const [inspectedSign, setInspectedSign] = useState<SignItem | null>(BISINDO_DATA[0]);
  const [playingIndex, setPlayingIndex] = useState<number>(-1);
  const [playSpeed, setPlaySpeed] = useState<'normal' | 'slow'>('normal');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, pageSize]);

  // Filtered Sign List for Dictionary Tab
  const dictionaryFilteredSigns = BISINDO_DATA.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.exampleSentence.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'semua' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered Sign List for Sentence Builder Palette
  const builderFilteredSigns = BISINDO_DATA.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(paletteSearchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(paletteSearchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'semua' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Category counts
  const categoryCounts = {
    semua: BISINDO_DATA.length,
    sapaan: BISINDO_DATA.filter((i) => i.category === 'sapaan').length,
    keluarga: BISINDO_DATA.filter((i) => i.category === 'keluarga').length,
    aktivitas: BISINDO_DATA.filter((i) => i.category === 'aktivitas').length,
    tanya: BISINDO_DATA.filter((i) => i.category === 'tanya').length,
    emosi: BISINDO_DATA.filter((i) => i.category === 'emosi').length,
    waktu: BISINDO_DATA.filter((i) => i.category === 'waktu').length,
    abjad: BISINDO_DATA.filter((i) => i.category === 'abjad').length,
  };

  // Pagination logic for Kamus Tab
  const totalDictionaryItems = dictionaryFilteredSigns.length;
  const totalPages = pageSize === -1 ? 1 : Math.max(1, Math.ceil(totalDictionaryItems / pageSize));
  const paginatedSigns = pageSize === -1
    ? dictionaryFilteredSigns
    : dictionaryFilteredSigns.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  // Add word to sentence
  const handleAddToSentence = (item: SignItem) => {
    if (sentenceSequence.length >= 8) {
      speakText('Batas maksimal 8 kata dalam satu rangkaian kalimat.');
      return;
    }
    setSentenceSequence((prev) => [...prev, item]);
    setInspectedSign(item);
    speakText(`Menambahkan isyarat ${item.word}`);
  };

  // Remove word from sentence
  const handleRemoveFromSentence = (index: number) => {
    const removedItem = sentenceSequence[index];
    setSentenceSequence((prev) => prev.filter((_, i) => i !== index));
    if (removedItem) {
      speakText(`Menghapus ${removedItem.word}`);
    }
  };

  // Clear entire sentence
  const handleClearSentence = () => {
    setSentenceSequence([]);
    speakText('Papan rangkaian kalimat dibersihkan');
  };

  // Preset conversations for Sentence Builder
  const handleApplyPreset = (presetName: string, items: SignItem[]) => {
    setSentenceSequence(items);
    if (items.length > 0) {
      setInspectedSign(items[0]);
    }
    speakText(`Memuat contoh kalimat isyarat: ${presetName}`);
  };

  // Play sentence sequence with speed control
  const handlePlaySequence = () => {
    if (sentenceSequence.length === 0 || isPlaying) return;

    setIsPlaying(true);
    setPlayingIndex(0);
    setInspectedSign(sentenceSequence[0]);
    speakText(sentenceSequence[0].word);

    const stepInterval = playSpeed === 'slow' ? 2400 : 1600;
    let idx = 0;
    const timer = setInterval(() => {
      idx++;
      if (idx < sentenceSequence.length) {
        setPlayingIndex(idx);
        setInspectedSign(sentenceSequence[idx]);
        speakText(sentenceSequence[idx].word);
      } else {
        clearInterval(timer);
        setPlayingIndex(-1);
        setIsPlaying(false);
      }
    }, stepInterval);
  };

  // Natural Indonesian sentence meaning from sequence
  const getSentenceMeaning = () => {
    if (sentenceSequence.length === 0) return '';
    return sentenceSequence.map((item) => item.word.split('/')[0].trim()).join(' ') + '.';
  };

  // Copy natural sentence
  const handleCopySentence = () => {
    const text = getSentenceMeaning();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    speakText('Terjemahan kalimat disalin ke papan klip');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 py-6 pb-20 overflow-x-hidden">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-7 items-start w-full min-w-0">
        {/* ======================================================== */}
        {/* CENTER COLUMN: Main Content Area                         */}
        {/* ======================================================== */}
        <div className="flex-1 min-w-0 space-y-6 w-full max-w-full">
          {/* Header Banner */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-xs w-full max-w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Bahasa Isyarat Indonesia (BISINDO) Hub</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Komunikasi & Pembelajaran Isyarat Sehari-hari
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Rangkai kalimat isyarat visual dua arah dan pelajari ratusan kosakata alami komunitas Tuli untuk interaksi sosial dan kegiatan sehari-hari.
                </p>
              </div>

              {/* Badges Info */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center min-w-[80px]">
                  <span className="block text-lg font-extrabold text-blue-600 dark:text-blue-400">
                    {BISINDO_DATA.length}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Kosakata
                  </span>
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center min-w-[80px]">
                  <span className="block text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                    7
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Kategori
                  </span>
                </div>
              </div>
            </div>

            {/* Segmented Main Navigation Switcher */}
            <div className="pt-6 flex justify-start sm:justify-center w-full">
              <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700 w-full sm:w-auto sm:flex gap-1.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('builder')}
                  className={`flex items-center justify-center gap-2 px-3 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 ${
                    activeTab === 'builder'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="hidden sm:inline">Papan Susun Kalimat Isyarat</span>
                  <span className="sm:hidden truncate">Susun Kalimat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('kamus')}
                  className={`flex items-center justify-center gap-2 px-3 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 ${
                    activeTab === 'kamus'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="hidden sm:inline">Kamus Kosakata Lengkap</span>
                  <span className="sm:hidden truncate">Kamus Isyarat</span>
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: INTERACTIVE SENTENCE BUILDER                      */}
          {/* ======================================================== */}
          {activeTab === 'builder' && (
            <div className="space-y-6">
              {/* Active Sentence Sequence Canvas Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
                {/* Header Toolbar: Clean & Balanced */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Papan Rangkaian Kalimat Isyarat
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
                        {sentenceSequence.length}/8 Kata
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      Rangkai kata isyarat di bawah untuk membentuk ekspresi visual dua arah yang alami.
                    </p>
                  </div>

                  {/* Cohesive Action Cluster */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                    {/* Speed Switcher */}
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs">
                      <button
                        type="button"
                        onClick={() => setPlaySpeed('normal')}
                        className={`px-2.5 py-1.5 rounded-lg font-bold transition ${
                          playSpeed === 'normal'
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        1.0x Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlaySpeed('slow')}
                        className={`px-2.5 py-1.5 rounded-lg font-bold transition ${
                          playSpeed === 'slow'
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        0.7x Pelan
                      </button>
                    </div>

                    {/* Play Button */}
                    <button
                      type="button"
                      onClick={handlePlaySequence}
                      disabled={sentenceSequence.length === 0 || isPlaying}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs disabled:opacity-40 transition active:scale-95 shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{isPlaying ? 'Memutar...' : 'Putar Berurutan'}</span>
                    </button>

                    {/* Clear Button */}
                    <button
                      type="button"
                      onClick={handleClearSentence}
                      disabled={sentenceSequence.length === 0}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-30 transition text-xs font-semibold shrink-0"
                      title="Bersihkan semua kata di papan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Bersihkan</span>
                    </button>
                  </div>
                </div>

                {/* Sequence Words Stream Canvas */}
                <div className="mt-4 p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-950/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 min-h-[160px] flex items-center justify-center">
                  {sentenceSequence.length > 0 ? (
                    <div className="w-full flex flex-wrap items-center gap-2 sm:gap-3">
                      {sentenceSequence.map((item, idx) => {
                        const isCurrentPlaying = playingIndex === idx;
                        const isSelected = inspectedSign?.id === item.id;
                        return (
                          <React.Fragment key={`${item.id}-${idx}`}>
                            {/* Word Card in Stream */}
                            <div
                              onClick={() => setInspectedSign(item)}
                              className={`relative group flex flex-col justify-between p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer min-w-[110px] sm:min-w-[124px] max-w-[140px] ${
                                isCurrentPlaying
                                  ? 'border-blue-600 bg-blue-50/90 dark:bg-blue-950/80 scale-105 shadow-md ring-2 ring-blue-500'
                                  : isSelected
                                  ? 'border-blue-400 bg-white dark:bg-slate-900 shadow-sm ring-1 ring-blue-400/50'
                                  : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                              }`}
                            >
                              {/* Header: Order & Delete */}
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  #{idx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFromSentence(idx);
                                  }}
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition"
                                  title={`Hapus kata ${item.word}`}
                                  aria-label={`Hapus kata ${item.word}`}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Center Visual Cue */}
                              <div className="text-3xl sm:text-4xl text-center py-1 select-none">
                                {item.visualCue}
                              </div>

                              {/* Footer: Word Title */}
                              <div className="text-center pt-1 border-t border-slate-100 dark:border-slate-800">
                                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {item.word}
                                </div>
                                <div className="text-[10px] text-slate-400 capitalize truncate">
                                  {item.category}
                                </div>
                              </div>
                            </div>

                            {/* Directional Connector Arrow */}
                            {idx < sentenceSequence.length - 1 && (
                              <div className="hidden sm:flex items-center justify-center text-slate-300 dark:text-slate-700 px-0.5">
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  ) : (
                    /* Friendly Empty State */
                    <div className="text-center py-6 space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200/60 dark:border-blue-800/60">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                        Papan Rangkaian Masih Kosong
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        Klik kata di palet bawah atau pilih contoh percakapan siap pakai untuk mulai merangkai kalimat isyarat.
                      </p>
                    </div>
                  )}
                </div>

                {/* Integrated Natural Sentence Translation & Audio Tray */}
                {sentenceSequence.length > 0 && (
                  <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50/60 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-slate-900/60 border border-blue-200/80 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="space-y-1 min-w-0">
                      <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquareQuote className="w-3.5 h-3.5" />
                        Terjemahan Kalimat Alami:
                      </span>
                      <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 italic tracking-wide truncate">
                        &ldquo;{getSentenceMeaning()}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => speakText(getSentenceMeaning())}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95"
                        title="Dengarkan pembacaan suara alami kalimat ini"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Ucapkan</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopySentence}
                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-2xs"
                        title="Salin kalimat ke clipboard"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-500" />
                        )}
                        <span>{copied ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Preset Everyday Dialogues (Template Percakapan Cepat) */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Contoh Percakapan Sehari-hari Siap Pakai:
                    </span>
                    <span className="text-[11px] text-slate-400">1-Klik Pasang</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      {
                        label: '🌅 Sapaan Ramah Pagi',
                        items: [BISINDO_DATA[0], BISINDO_DATA[1], BISINDO_DATA[14], BISINDO_DATA[12]],
                      },
                      {
                        label: '🤝 Meminta Bantuan Santun',
                        items: [BISINDO_DATA[9], BISINDO_DATA[7], BISINDO_DATA[8], BISINDO_DATA[39]],
                      },
                      {
                        label: '🙏 Rasa Terima Kasih',
                        items: [BISINDO_DATA[5], BISINDO_DATA[6], BISINDO_DATA[56]],
                      },
                      {
                        label: '✊ Semangat Bekerja & Belajar',
                        items: [BISINDO_DATA[17], BISINDO_DATA[54], BISINDO_DATA[57], BISINDO_DATA[28]],
                      },
                      {
                        label: '❓ Menanyakan Kabar & Tempat',
                        items: [BISINDO_DATA[0], BISINDO_DATA[11], BISINDO_DATA[47]],
                      },
                    ].map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleApplyPreset(preset.label, preset.items)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition shadow-2xs active:scale-95"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Word Palette by Category with Integrated Search */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                        Palet Kosakata untuk Ditambahkan
                      </h2>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {builderFilteredSigns.length} kata
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Klik kata untuk menambahkan ke papan kalimat di atas (Maksimal 8 kata).
                    </p>
                  </div>

                  {/* Search inside Palette */}
                  <div className="relative w-full md:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={paletteSearchQuery}
                      onChange={(e) => setPaletteSearchQuery(e.target.value)}
                      placeholder="Cari kata di palet..."
                      className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    {paletteSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setPaletteSearchQuery('')}
                        className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { id: 'semua', label: 'Semua', count: categoryCounts.semua },
                    { id: 'sapaan', label: 'Sapaan', count: categoryCounts.sapaan },
                    { id: 'keluarga', label: 'Keluarga', count: categoryCounts.keluarga },
                    { id: 'aktivitas', label: 'Aktivitas', count: categoryCounts.aktivitas },
                    { id: 'tanya', label: 'Kata Tanya', count: categoryCounts.tanya },
                    { id: 'emosi', label: 'Emosi', count: categoryCounts.emosi },
                    { id: 'waktu', label: 'Waktu & Angka', count: categoryCounts.waktu },
                    { id: 'abjad', label: 'Abjad A-Z', count: categoryCounts.abjad },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                        selectedCategory === cat.id
                          ? 'bg-blue-600 text-white shadow-2xs font-extrabold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          selectedCategory === cat.id
                            ? 'bg-blue-800/60 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Word Buttons Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {builderFilteredSigns.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAddToSentence(item)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/60 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-left transition group shadow-2xs active:scale-98"
                    >
                      <span className="text-xl p-1 bg-white dark:bg-slate-800 rounded-lg shrink-0 group-hover:scale-105 transition shadow-2xs">
                        {item.visualCue}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition">
                          {item.word}
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize truncate">
                          {item.category}
                        </div>
                      </div>
                      <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                    </button>
                  ))}
                </div>

                {builderFilteredSigns.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
                    Tidak ada kata yang sesuai dengan pencarian &ldquo;{paletteSearchQuery}&rdquo;.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: KAMUS KOSAKATA LENGKAP                            */}
          {/* ======================================================== */}
          {activeTab === 'kamus' && (
            <div className="space-y-5">
              {/* Search & Filter Toolbar: Clean 2-Tier Layout */}
              <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                {/* Tier 1: Search Input + View Mode Toggle + Page Size */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari kata isyarat, contoh kalimat, atau arti gestur..."
                      className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        aria-label="Hapus pencarian"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Controls Cluster: View Mode & Page Size */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* View Mode Toggle: Grid vs List */}
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setKamusViewMode('grid')}
                        className={`p-1.5 rounded-lg transition ${
                          kamusViewMode === 'grid'
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                        title="Tampilan Grid Kartu"
                        aria-label="Tampilan Grid Kartu"
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setKamusViewMode('list')}
                        className={`p-1.5 rounded-lg transition ${
                          kamusViewMode === 'list'
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                        title="Tampilan Daftar Ringkas"
                        aria-label="Tampilan Daftar Ringkas"
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Items Per Page Selector */}
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs">
                      {[12, 24, -1].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setPageSize(size)}
                          className={`px-2.5 py-1 rounded-lg font-bold transition ${
                            pageSize === size
                              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                        >
                          {size === -1 ? 'Semua' : `${size}/hal`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tier 2: Category Pills with Counters (Horizontally scrollable, no wrap) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  {[
                    { id: 'semua', label: 'Semua', count: categoryCounts.semua },
                    { id: 'sapaan', label: 'Sapaan', count: categoryCounts.sapaan },
                    { id: 'keluarga', label: 'Keluarga', count: categoryCounts.keluarga },
                    { id: 'aktivitas', label: 'Aktivitas', count: categoryCounts.aktivitas },
                    { id: 'tanya', label: 'Kata Tanya', count: categoryCounts.tanya },
                    { id: 'emosi', label: 'Emosi', count: categoryCounts.emosi },
                    { id: 'waktu', label: 'Waktu & Angka', count: categoryCounts.waktu },
                    { id: 'abjad', label: 'Abjad A-Z', count: categoryCounts.abjad },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                        selectedCategory === cat.id
                          ? 'bg-blue-600 text-white shadow-2xs font-extrabold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          selectedCategory === cat.id
                            ? 'bg-blue-800/60 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* MODE 1: GRID VIEW (Uniform Height Cards) */}
              {kamusViewMode === 'grid' && paginatedSigns.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {paginatedSigns.map((sign) => (
                    <div
                      key={sign.id}
                      onClick={() => setInspectedSign(sign)}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-blue-400/80 transition-all duration-150 cursor-pointer group"
                    >
                      <div>
                        {/* Top Header */}
                        <div className="flex items-center justify-between mb-3.5">
                          <span className="text-3xl p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl group-hover:scale-105 transition shadow-2xs select-none">
                            {sign.visualCue}
                          </span>
                          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
                            {sign.category}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate">
                          {sign.word}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed line-clamp-2 min-h-[34px]">
                          {sign.description}
                        </p>

                        {/* Linguistic Structure Pills */}
                        <div className="space-y-1 mb-3.5 p-2.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/80 text-[11px]">
                          {sign.handshape && (
                            <div className="text-slate-700 dark:text-slate-300 flex items-start gap-1.5 truncate">
                              <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0">Bentuk:</span>
                              <span className="truncate">{sign.handshape}</span>
                            </div>
                          )}
                          {sign.facialExpression && (
                            <div className="text-slate-700 dark:text-slate-300 flex items-start gap-1.5 truncate">
                              <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0">Wajah:</span>
                              <span className="truncate">{sign.facialExpression}</span>
                            </div>
                          )}
                        </div>

                        {/* Example sentence */}
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 italic mb-3 truncate">
                          &ldquo;{sign.exampleSentence}&rdquo;
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(
                              `Isyarat kata: ${sign.word}. ${sign.description}. Contoh: ${sign.exampleSentence}`
                            );
                          }}
                          className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Dengar</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDetailSign(sign);
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                            title="Lihat detail lengkap panduan gerak"
                          >
                            Detail
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToSentence(sign);
                              setActiveTab('builder');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-300 text-xs font-bold transition flex items-center gap-1"
                            title="Tambahkan ke papan kalimat"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Papan</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* MODE 2: COMPACT LIST VIEW (Super Space-Saving) */}
              {kamusViewMode === 'list' && paginatedSigns.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
                  {paginatedSigns.map((sign) => (
                    <div
                      key={sign.id}
                      onClick={() => setInspectedSign(sign)}
                      className="p-3 sm:px-4.5 sm:py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 group-hover:scale-105 transition shadow-2xs select-none">
                          {sign.visualCue}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition">
                              {sign.word}
                            </h4>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 shrink-0">
                              {sign.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm sm:max-w-md mt-0.5">
                            {sign.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(`Isyarat ${sign.word}. ${sign.description}`);
                          }}
                          className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition"
                          title="Dengar Suara"
                          aria-label="Dengar Suara"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDetailSign(sign);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                        >
                          Detail
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToSentence(sign);
                            setActiveTab('builder');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-300 text-xs font-bold transition flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Papan</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SMART PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Menampilkan <span className="font-bold text-slate-800 dark:text-slate-200">{(currentPage - 1) * pageSize + 1}</span> - <span className="font-bold text-slate-800 dark:text-slate-200">{Math.min(currentPage * pageSize, totalDictionaryItems)}</span> dari <span className="font-bold text-slate-800 dark:text-slate-200">{totalDictionaryItems}</span> kosakata
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:cursor-not-allowed"
                      title="Halaman Sebelumnya"
                      aria-label="Halaman Sebelumnya"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, idx) =>
                      typeof page === 'number' ? (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-xs font-bold transition ${
                            currentPage === page
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {page}
                        </button>
                      ) : (
                        <span key={idx} className="px-1 text-slate-400 text-xs">
                          ...
                        </span>
                      )
                    )}

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:cursor-not-allowed"
                      title="Halaman Selanjutnya"
                      aria-label="Halaman Selanjutnya"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {dictionaryFilteredSigns.length === 0 && (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 shadow-xs">
                  <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                    Kosakata Tidak Ditemukan
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Coba ubah kata kunci pencarian atau pilih kategori &ldquo;Semua&rdquo;.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Live Sign Inspector & Etiquette Companion  */}
        {/* ======================================================== */}
        <aside
          className={`w-full shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
            isRightPanelOpen ? 'lg:w-[320px] xl:w-[340px]' : 'lg:w-14'
          }`}
          aria-label="Panel Panduan & Asisten Isyarat"
        >
          {/* Box Shell on desktop */}
          <div className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs lg:sticky lg:top-20 h-fit max-h-none lg:max-h-[calc(100vh-6.5rem)] overflow-hidden">
            {/* Header: Toggle button */}
            <div
              className={`shrink-0 border-b border-slate-100 dark:border-slate-800/80 transition-all ${
                isRightPanelOpen
                  ? 'p-3.5 flex items-center justify-between'
                  : 'p-3 flex justify-center'
              }`}
            >
              {isRightPanelOpen ? (
                <>
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-white truncate">
                      Panduan & Asisten Isyarat
                    </span>
                  </div>
                  <button
                    type="button"
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
                  type="button"
                  onClick={toggleRightPanel}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition shadow-2xs border border-transparent hover:border-blue-200 dark:hover:border-blue-800 active:scale-95"
                  title="Perluas Panel Kanan (])"
                  aria-label="Perluas Panel Kanan"
                >
                  <PanelRightOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </button>
              )}
            </div>

            {/* Desktop Body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {isRightPanelOpen ? (
                <div className="p-4 space-y-4 animate-in fade-in duration-200">
                  {/* Live Sign Inspector */}
                  {inspectedSign ? (
                    <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-50/70 to-slate-50/50 dark:from-blue-950/40 dark:to-slate-900/60 border border-blue-200/70 dark:border-blue-900/40 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                          Anatomi Gerak Isyarat
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 capitalize border border-slate-200 dark:border-slate-700">
                          {inspectedSign.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-4xl p-2.5 bg-white dark:bg-slate-800 rounded-2xl shadow-2xs border border-slate-100 dark:border-slate-700 select-none">
                          {inspectedSign.visualCue}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                            {inspectedSign.word}
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              speakText(`Isyarat: ${inspectedSign.word}. ${inspectedSign.description}`)
                            }
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Dengar Penjelasan</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {inspectedSign.description}
                      </p>

                      {/* 4 Parameters */}
                      <div className="space-y-1.5 text-[11px] pt-2 border-t border-blue-200/60 dark:border-blue-900/40">
                        {inspectedSign.handshape && (
                          <div className="flex items-start gap-1.5">
                            <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0">✋ Bentuk:</span>
                            <span className="text-slate-700 dark:text-slate-200">{inspectedSign.handshape}</span>
                          </div>
                        )}
                        {inspectedSign.location && (
                          <div className="flex items-start gap-1.5">
                            <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0">📍 Posisi:</span>
                            <span className="text-slate-700 dark:text-slate-200">{inspectedSign.location}</span>
                          </div>
                        )}
                        {inspectedSign.movement && (
                          <div className="flex items-start gap-1.5">
                            <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0">🔄 Gerak:</span>
                            <span className="text-slate-700 dark:text-slate-200">{inspectedSign.movement}</span>
                          </div>
                        )}
                        {inspectedSign.facialExpression && (
                          <div className="flex items-start gap-1.5">
                            <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0">😊 Wajah:</span>
                            <span className="text-slate-700 dark:text-slate-200">{inspectedSign.facialExpression}</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedDetailSign(inspectedSign)}
                        className="w-full py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-slate-900/80 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-blue-600 dark:text-blue-300 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Buka Panduan Gerakan Lengkap</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
                      Klik kata di papan atau palet untuk melihat anatomi geraknya di sini.
                    </div>
                  )}

                  {/* Section 2: Panduan Etika Berkomunikasi Teman Tuli */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">
                      Etika Berkomunikasi Teman Tuli
                    </span>
                    <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-400">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          1. Kontak Mata Langsung
                        </span>
                        <p className="leading-relaxed">
                          Pastikan berada dalam jangkauan pandangan visual sebelum mulai berisyarat.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          2. Ekspresi Wajah (NMM)
                        </span>
                        <p className="leading-relaxed">
                          Wajah adalah intonasi; ekspresikan senyum atau tanda tanya secara jelas.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          3. Lambaian Santun
                        </span>
                        <p className="leading-relaxed">
                          Sapa dengan lambaian lembut atau ketuk meja santun, hindari berteriak.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* COLLAPSED RAIL */
                <div className="py-3 px-1.5 flex flex-col items-center gap-2.5 animate-in fade-in duration-200">
                  <button
                    type="button"
                    onClick={() => toggleRightPanel()}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition shadow-2xs"
                    title="Buka Asisten Isyarat"
                  >
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* MOBILE VIEW: Clean Natural Card (Always Open, No Toggle) */}
          {/* ======================================================== */}
          <div className="lg:hidden w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Panduan Etika Berkomunikasi Teman Tuli</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Prinsip dasar interaksi visual inklusif yang santun:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  1. Kontak Mata Langsung
                </span>
                <span>Pastikan dalam jangkauan pandangan visual sebelum berisyarat.</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  2. Ekspresi Wajah (NMM)
                </span>
                <span>Wajah adalah intonasi; ekspresikan senyum atau tanda tanya secara jelas.</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  3. Lambaian Lembut
                </span>
                <span>Tarik perhatian santun dengan lambaian atau ketukan meja, hindari berteriak.</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ======================================================== */}
      {/* VOCABULARY DETAIL MODAL                                 */}
      {/* ======================================================== */}
      {selectedDetailSign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0">
                  {selectedDetailSign.visualCue}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedDetailSign.word}
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 capitalize">
                    Kategori: {selectedDetailSign.category}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDetailSign(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Tutup jendela detail"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedDetailSign.description}
            </p>

            {/* Linguistic Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
              {selectedDetailSign.handshape && (
                <div>
                  <span className="font-bold text-slate-500 dark:text-slate-400 block text-[10px] uppercase">
                    Bentuk Tangan:
                  </span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedDetailSign.handshape}</span>
                </div>
              )}
              {selectedDetailSign.location && (
                <div>
                  <span className="font-bold text-slate-500 dark:text-slate-400 block text-[10px] uppercase">
                    Titik Lokasi:
                  </span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedDetailSign.location}</span>
                </div>
              )}
              {selectedDetailSign.movement && (
                <div>
                  <span className="font-bold text-slate-500 dark:text-slate-400 block text-[10px] uppercase">
                    Arah Gerak:
                  </span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedDetailSign.movement}</span>
                </div>
              )}
              {selectedDetailSign.facialExpression && (
                <div>
                  <span className="font-bold text-slate-500 dark:text-slate-400 block text-[10px] uppercase">
                    Ekspresi Wajah:
                  </span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedDetailSign.facialExpression}</span>
                </div>
              )}
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-white block uppercase tracking-wider">
                Panduan Langkah Gerakan:
              </span>
              <div className="space-y-1 bg-blue-50/50 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-200/60 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300">
                {selectedDetailSign.gestureInstructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="font-bold text-blue-600 shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Example sentence */}
            <div className="text-xs text-slate-500 dark:text-slate-400 italic">
              Contoh kalimat: &ldquo;{selectedDetailSign.exampleSentence}&rdquo;
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => speakText(`Isyarat ${selectedDetailSign.word}. ${selectedDetailSign.description}`)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Dengar Suara</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddToSentence(selectedDetailSign);
                  setSelectedDetailSign(null);
                  setActiveTab('builder');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah ke Papan Kalimat</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
