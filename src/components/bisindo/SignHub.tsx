import React, { useState } from 'react';
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
} from 'lucide-react';
import { BISINDO_DATA, type SignItem } from '../../data/bisindoData';
import { useAccessibility } from '../../context/AccessibilityContext';

export const SignHub: React.FC = () => {
  const { speakText, isRightPanelOpen, toggleRightPanel } = useAccessibility();
  const [activeTab, setActiveTab] = useState<'kamus' | 'builder'>('builder');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [selectedDetailSign, setSelectedDetailSign] = useState<SignItem | null>(null);

  // Sentence Builder State (General starter: Halo, Senang Bertemu, Belajar)
  const [sentenceSequence, setSentenceSequence] = useState<SignItem[]>([
    BISINDO_DATA[0],  // Halo / Hai
    BISINDO_DATA[14], // Senang Bertemu
    BISINDO_DATA[27], // Belajar
  ]);
  const [playingIndex, setPlayingIndex] = useState<number>(-1);
  const [playSpeed, setPlaySpeed] = useState<'normal' | 'slow'>('normal');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Filtered Sign List for Dictionary & Palette
  const filteredSigns = BISINDO_DATA.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.exampleSentence.toLowerCase().includes(searchQuery.toLowerCase());
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

  // Add word to sentence
  const handleAddToSentence = (item: SignItem) => {
    if (sentenceSequence.length >= 8) {
      speakText('Batas maksimal delapan kata dalam satu kalimat isyarat.');
      return;
    }
    setSentenceSequence((prev) => [...prev, item]);
    speakText(`Menambahkan isyarat ${item.word}`);
  };

  // Preset conversations for Sentence Builder
  const handleApplyPreset = (presetName: string, items: SignItem[]) => {
    setSentenceSequence(items);
    speakText(`Memuat contoh kalimat isyarat: ${presetName}`);
  };

  // Play sentence sequence with speed control
  const handlePlaySequence = () => {
    if (sentenceSequence.length === 0 || isPlaying) return;

    setIsPlaying(true);
    setPlayingIndex(0);
    speakText(sentenceSequence[0].word);

    const stepInterval = playSpeed === 'slow' ? 2400 : 1600;
    let idx = 0;
    const timer = setInterval(() => {
      idx++;
      if (idx < sentenceSequence.length) {
        setPlayingIndex(idx);
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

  return (
    <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 py-6 pb-20 overflow-x-hidden">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full min-w-0">
        {/* ======================================================== */}
        {/* CENTER COLUMN: Main Content                              */}
        {/* ======================================================== */}
        <div className="flex-1 min-w-0 space-y-6 w-full max-w-full">
          {/* Header Banner */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs w-full max-w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Bahasa Isyarat Indonesia (BISINDO) Hub</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Komunikasi & Pembelajaran Isyarat Sehari-hari
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Rangkai kalimat isyarat visual dua arah dan pelajari ratusan kosakata alami komunitas Tuli untuk interaksi sosial dan kegiatan sehari-hari.
                </p>
              </div>

              {/* Badges Info */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center">
                  <span className="block text-base font-extrabold text-blue-600 dark:text-blue-400">
                    {BISINDO_DATA.length}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    Kosakata
                  </span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center">
                  <span className="block text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    7
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    Kategori
                  </span>
                </div>
              </div>
            </div>

            {/* Segmented Main Navigation Switcher (2 Tabs Only) */}
            <div className="pt-5 flex justify-start sm:justify-center w-full">
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 w-full sm:w-auto sm:flex gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('builder')}
                  className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
                    activeTab === 'builder'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="hidden sm:inline">Papan Susun Kalimat Isyarat</span>
                  <span className="sm:hidden truncate">Susun Kalimat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('kamus')}
                  className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
                    activeTab === 'kamus'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
              {/* Active Sentence Sequence Canvas */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
                {/* Header Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                      Papan Rangkaian Kalimat Isyarat
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      Rangkai kata di bawah untuk menyusun kalimat isyarat visual dua arah.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Speed Switcher */}
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs">
                      <button
                        type="button"
                        onClick={() => setPlaySpeed('normal')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition ${
                          playSpeed === 'normal'
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                            : 'text-slate-500'
                        }`}
                      >
                        1.0x Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlaySpeed('slow')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition ${
                          playSpeed === 'slow'
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                            : 'text-slate-500'
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
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs disabled:opacity-40 transition active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{isPlaying ? 'Memutar...' : 'Putar Berurutan'}</span>
                    </button>

                    {/* Clear Button */}
                    <button
                      type="button"
                      onClick={() => setSentenceSequence([])}
                      disabled={sentenceSequence.length === 0}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-30 transition"
                      title="Bersihkan semua kata di papan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sequence Words Grid */}
                <div className="min-h-[140px] flex flex-wrap items-center gap-3 p-4 bg-slate-50/70 dark:bg-slate-950/50 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  {sentenceSequence.map((item, idx) => {
                    const isCurrentPlaying = playingIndex === idx;
                    return (
                      <div
                        key={`${item.id}-${idx}`}
                        className={`relative flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 ${
                          isCurrentPlaying
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 scale-105 shadow-md ring-2 ring-blue-500'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300'
                        }`}
                      >
                        <span className="text-2xl p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
                          {item.visualCue}
                        </span>
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.word}
                          </div>
                          <div className="text-[10px] text-slate-400">Kata #{idx + 1}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSentenceSequence((prev) => prev.filter((_, i) => i !== idx))}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition"
                          aria-label={`Hapus kata ${item.word}`}
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}

                  {sentenceSequence.length === 0 && (
                    <div className="w-full text-center py-8 text-xs text-slate-400 dark:text-slate-500">
                      Papan kalimat masih kosong. Pilih kosakata di palet bawah atau klik contoh percakapan siap pakai.
                    </div>
                  )}
                </div>

                {/* Natural Sentence Translation Preview */}
                {sentenceSequence.length > 0 && (
                  <div className="mt-4 p-3.5 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-200/60 dark:border-blue-900/40 flex items-start justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">
                        Terjemahan Kalimat Alami:
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 italic truncate">
                        &ldquo;{getSentenceMeaning()}&rdquo;
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakText(getSentenceMeaning())}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-2xs transition"
                      title="Dengarkan pembacaan kalimat utuh"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Ucapkan</span>
                    </button>
                  </div>
                )}

                {/* Preset Daily Dialogues (General, Everyday Dialogues) */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2.5">
                    Contoh Percakapan Sehari-hari Siap Pakai:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      {
                        label: '🌅 Sapaan Ramah Pagi',
                        items: [BISINDO_DATA[0], BISINDO_DATA[1], BISINDO_DATA[14], BISINDO_DATA[12]], // Halo, Selamat Pagi, Senang Bertemu, Baik/Sehat
                      },
                      {
                        label: '🤝 Meminta Bantuan Santun',
                        items: [BISINDO_DATA[9], BISINDO_DATA[7], BISINDO_DATA[8], BISINDO_DATA[39]], // Permisi, Maaf, Tolong, Membantu
                      },
                      {
                        label: '🙏 Rasa Terima Kasih',
                        items: [BISINDO_DATA[5], BISINDO_DATA[6], BISINDO_DATA[56]], // Terima Kasih, Sama-sama, Suka/Senang
                      },
                      {
                        label: '✊ Semangat Bekerja & Belajar',
                        items: [BISINDO_DATA[17], BISINDO_DATA[54], BISINDO_DATA[57], BISINDO_DATA[28]], // Kita, Bisa, Semangat, Bekerja
                      },
                      {
                        label: '❓ Menanyakan Kabar & Tempat',
                        items: [BISINDO_DATA[0], BISINDO_DATA[11], BISINDO_DATA[47]], // Halo, Apa Kabar?, Di Mana?
                      },
                    ].map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleApplyPreset(preset.label, preset.items)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition shadow-2xs active:scale-98"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Word Palette by Category */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                      Palet Kosakata untuk Ditambahkan:
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Klik kata untuk menambahkan ke papan kalimat di atas ({filteredSigns.length} kata tersedia).
                    </p>
                  </div>

                  {/* Filter Category Pills */}
                  <div className="flex flex-wrap gap-1">
                    {[
                      { id: 'semua', label: 'Semua' },
                      { id: 'sapaan', label: 'Sapaan' },
                      { id: 'keluarga', label: 'Keluarga' },
                      { id: 'aktivitas', label: 'Aktivitas' },
                      { id: 'tanya', label: 'Kata Tanya' },
                      { id: 'emosi', label: 'Emosi' },
                      { id: 'waktu', label: 'Angka & Waktu' },
                      { id: 'abjad', label: 'Abjad A-Z' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                          selectedCategory === cat.id
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Word Buttons Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {filteredSigns.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAddToSentence(item)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/60 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-left transition group shadow-2xs"
                    >
                      <span className="text-xl p-1 bg-white dark:bg-slate-800 rounded-lg shrink-0 group-hover:scale-105 transition">
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
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: KAMUS KOSAKATA LENGKAP                            */}
          {/* ======================================================== */}
          {activeTab === 'kamus' && (
            <div className="space-y-6">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kata isyarat, contoh kalimat, atau arti gestur..."
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Pills with Counters */}
                <div className="flex flex-wrap gap-1.5 items-center">
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        selectedCategory === cat.id
                          ? 'bg-blue-600 text-white shadow-2xs font-extrabold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedCategory === cat.id ? 'bg-blue-800/60 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredSigns.map((sign) => (
                  <div
                    key={sign.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-blue-400/80 transition-all duration-150"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between mb-3.5">
                        <span className="text-3xl p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                          {sign.visualCue}
                        </span>
                        <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
                          {sign.category}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                        {sign.word}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-3.5 leading-relaxed">
                        {sign.description}
                      </p>

                      {/* Linguistic Structure Pills */}
                      <div className="space-y-1.5 mb-3.5 p-3 bg-slate-50/70 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/80 text-[11px]">
                        {sign.handshape && (
                          <div className="text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                            <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0">Bentuk:</span>
                            <span className="truncate">{sign.handshape}</span>
                          </div>
                        )}
                        {sign.facialExpression && (
                          <div className="text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                            <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0">Wajah:</span>
                            <span className="truncate">{sign.facialExpression}</span>
                          </div>
                        )}
                      </div>

                      {/* Example sentence */}
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 italic mb-3">
                        &ldquo;{sign.exampleSentence}&rdquo;
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => speakText(`Isyarat kata: ${sign.word}. ${sign.description}. Contoh: ${sign.exampleSentence}`)}
                        className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Dengar Suara</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedDetailSign(sign)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                          title="Lihat detail lengkap panduan gerak"
                        >
                          Detail
                        </button>
                        <button
                          type="button"
                          onClick={() => {
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

              {filteredSigns.length === 0 && (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
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
        {/* RIGHT COLUMN: Action & Etiquette Companion Panel         */}
        {/* ======================================================== */}
        <aside
          className={`w-full shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
            isRightPanelOpen ? 'lg:w-[360px] xl:w-[380px]' : 'lg:w-16'
          }`}
          aria-label="Panel Alat & Panduan Isyarat"
        >
          {/* UNIFIED VIEW: Responsive Box Shell on mobile & desktop */}
          <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs lg:sticky lg:top-20 h-fit max-h-none lg:max-h-[calc(100vh-6.5rem)] overflow-hidden">
            {/* Header: Toggle button is right on the box */}
            <div
              className={`shrink-0 border-b border-slate-100 dark:border-slate-800/80 transition-all ${
                isRightPanelOpen ? 'p-3.5 flex items-center justify-between' : 'p-3 flex justify-center'
              }`}
            >
              {isRightPanelOpen ? (
                <>
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      Alat & Panduan Isyarat
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
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition shadow-2xs border border-transparent hover:border-blue-200 dark:hover:border-blue-800 active:scale-95"
                  title="Perluas Panel Kanan (])"
                  aria-label="Perluas Panel Kanan"
                >
                  <PanelRightOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </button>
              )}
            </div>

            {/* Desktop & Mobile Body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {isRightPanelOpen ? (
                <div className="w-full lg:w-[330px] xl:w-[350px] p-4 space-y-4 animate-in fade-in duration-200">
                  {/* Mode Navigation Switcher (2 Tabs Only) */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">
                      Pilihan Ruang Latihan
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveTab('builder')}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition ${
                          activeTab === 'builder'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <span>Papan Susun Kalimat</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">1</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('kamus')}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition ${
                          activeTab === 'kamus'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-emerald-600" />
                          <span>Kamus Kosakata (99 Kata)</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">2</span>
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-slate-800" />

                  {/* Section 2: Panduan Etika Berkomunikasi Teman Tuli */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">
                      Etika Berkomunikasi Teman Tuli
                    </span>
                    <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-400">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          1. Kontak Mata Langsung
                        </span>
                        <p className="leading-relaxed">
                          Pastikan Anda berada dalam jangkauan pandangan visual sebelum mulai berisyarat.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          2. Ekspresi Wajah (NMM)
                        </span>
                        <p className="leading-relaxed">
                          Wajah adalah intonasi; alis berkerut untuk bertanya, senyum untuk sapaan hangat.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          3. Lambaian atau Ketukan Meja
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
                    onClick={() => setActiveTab('builder')}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition shadow-2xs active:scale-95 ${
                      activeTab === 'builder'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 border border-blue-200 dark:border-blue-800'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    title="Papan Susun Kalimat"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('kamus')}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition shadow-2xs active:scale-95 ${
                      activeTab === 'kamus'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 border border-blue-200 dark:border-blue-800'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    title="Kamus Kosakata Lengkap"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* MOBILE VIEW: Clean Natural Card (Always Open, No Toggle) */}
          {/* ======================================================== */}
          <div className="lg:hidden w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs space-y-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Panduan Etika Berkomunikasi Teman Tuli</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Prinsip dasar interaksi visual inklusif yang santun:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  1. Kontak Mata Langsung
                </span>
                <span>Pastikan dalam jangkauan pandangan visual sebelum berisyarat.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  2. Ekspresi Wajah (NMM)
                </span>
                <span>Wajah adalah intonasi; ekspresikan senyum atau tanda tanya secara jelas.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
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
