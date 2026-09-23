import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Code,
  Palette,
  CheckSquare
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export const AccessibilityChecker: React.FC = () => {
  const { speakText } = useAccessibility();
  const [activeTab, setActiveTab] = useState<'contrast' | 'auditor' | 'checklist'>('contrast');

  // --- CONTRAST CALCULATOR STATE ---
  const [textColor, setTextColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');

  // Relative Luminance calculation per WCAG standard
  const getLuminance = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) return 0;
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

    const [R, G, B] = [r, g, b].map((c) => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };

  const lum1 = getLuminance(textColor);
  const lum2 = getLuminance(bgColor);
  const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  const contrastRatio = Number(ratio.toFixed(2));

  // WCAG Compliance Checks
  const passAANormal = contrastRatio >= 4.5;
  const passAALarge = contrastRatio >= 3.0;
  const passAAANormal = contrastRatio >= 7.0;
  const passAAALarge = contrastRatio >= 4.5;

  // --- CODE AUDITOR STATE (Lighthouse inspired) ---
  const sampleSnippets = [
    {
      name: 'Elemen Banyak Pelanggaran',
      code: `<div class="card">\n  <img src="materi.jpg">\n  <button onclick="submit()">Kirim</button>\n  <input type="text" placeholder="Nama Lengkap">\n  <a href="#">klik di sini</a>\n</div>`,
    },
    {
      name: 'Elemen Standar WCAG 2.1 AAA',
      code: `<div class="card" role="region" aria-label="Formulir Pendaftaran">\n  <img src="materi.jpg" alt="Ilustrasi peserta belajar berdiskusi">\n  <label for="nama-user" class="sr-only">Nama Lengkap:</label>\n  <input id="nama-user" type="text" placeholder="Nama Lengkap">\n  <button onclick="submit()" aria-label="Kirim formulir pendaftaran">Kirim Pendaftaran</button>\n  <a href="/panduan" aria-label="Baca panduan pendaftaran">Baca Panduan</a>\n</div>`,
    }
  ];

  const [inputCode, setInputCode] = useState(sampleSnippets[0].code);
  const [auditScore, setAuditScore] = useState(40);
  const [issues, setIssues] = useState<{
    critical: string[];
    warnings: string[];
    passed: string[];
  }>({
    critical: [
      'Tag <img> tidak memiliki atribut alt (tunanetra tidak dapat mengidentifikasi gambar)',
      'Tag <input> tidak memiliki label terkait (tidak ramah screen reader)'
    ],
    warnings: [
      'Teks tombol "Kirim" terlalu ringkas tanpa aria-label pelengkap',
      'Tautan menggunakan kata ambigu "klik di sini"'
    ],
    passed: [
      'Struktur tag HTML valid'
    ]
  });

  const runAudit = (code: string) => {
    let score = 100;
    const critical: string[] = [];
    const warnings: string[] = [];
    const passed: string[] = [];

    if (code.includes('<img')) {
      if (!code.includes('alt=')) {
        critical.push('Tag <img> tidak memiliki atribut alt pendukung screen reader.');
        score -= 30;
      } else {
        passed.push('Tag <img> menyertakan atribut alt yang valid.');
      }
    }

    if (code.includes('<input')) {
      if (!code.includes('<label') && !code.includes('aria-label') && !code.includes('aria-labelledby')) {
        critical.push('Tag <input> wajib memiliki <label> eksplisit atau aria-label.');
        score -= 30;
      } else {
        passed.push('Tag <input> terhubung dengan label aksesibel.');
      }
    }

    if (code.includes('<button')) {
      if (code.includes('>Kirim<') || code.includes('>Click<') || code.includes('>Klik<')) {
        warnings.push('Tombol memiliki teks umum tanpa keterangan konteks aria-label.');
        score -= 15;
      } else {
        passed.push('Tombol memiliki penamaan tujuan yang jelas.');
      }
    }

    if (code.includes('<a')) {
      if (code.toLowerCase().includes('klik di sini') || code.toLowerCase().includes('baca selengkapnya')) {
        if (!code.includes('aria-label')) {
          warnings.push('Tautan "klik di sini" membingungkan navigasi suara pengguna disabilitas.');
          score -= 15;
        } else {
          passed.push('Tautan dilengkapi penjelasan kontekstual.');
        }
      }
    }

    score = Math.max(10, score);
    setAuditScore(score);
    setIssues({ critical, warnings, passed });
    speakText(`Skor kepatuhan aksesibilitas Anda: ${score} dari 100`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Segmented Tab Switcher */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('contrast')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'contrast'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Kalkulator Kontras WCAG</span>
          </button>

          <button
            onClick={() => setActiveTab('auditor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'auditor'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Auditor Kode HTML</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Panduan POUR</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono hidden sm:inline mr-2">
          W3C Web Content Accessibility Guidelines 2.1
        </div>
      </div>

      {/* TAB 1: COLOR CONTRAST (Lighthouse swatch style) */}
      {activeTab === 'contrast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Controls */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Parameter Warna
            </span>

            {/* Text Color Input */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Warna Teks (Foreground)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-32 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs uppercase bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>
            </div>

            {/* Background Color Input */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Warna Latar Belakang (Background)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-32 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs uppercase bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 block mb-2">Preset Cepat:</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Kuning di Hitam (7:1+)', text: '#ffff00', bg: '#000000' },
                  { label: 'Teks Gelap di Putih', text: '#0f172a', bg: '#ffffff' },
                  { label: 'Putih di Biru Tua', text: '#ffffff', bg: '#1e3a8a' },
                  { label: 'Abu Lemah (Gagal)', text: '#94a3b8', bg: '#ffffff' },
                ].map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setTextColor(p.text);
                      setBgColor(p.bg);
                    }}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ratio & Compliance Matrix (Lighthouse style) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Live Swatch Preview */}
            <div
              className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center flex flex-col items-center justify-center min-h-[160px] transition-all"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              <div className="text-2xl font-black mb-1">Pratinjau Keterbacaan</div>
              <p className="text-xs opacity-90 max-w-xs">
                Contoh tampilan teks materi atau dokumen pada latar belakang pilihan Anda.
              </p>
            </div>

            {/* Matrix Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Rasio Kontras
                </span>
                <span className="text-3xl font-black text-blue-600 font-mono">
                  {contrastRatio} : 1
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">WCAG AA Normal</div>
                    <div className="text-xs text-slate-400">Min. 4.5:1</div>
                  </div>
                  {passAANormal ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">WCAG AAA Normal</div>
                    <div className="text-xs text-slate-400">Min. 7.0:1</div>
                  </div>
                  {passAAANormal ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-amber-500" />
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">WCAG AA Large</div>
                    <div className="text-xs text-slate-400">Min. 3.0:1</div>
                  </div>
                  {passAALarge ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">WCAG AAA Large</div>
                    <div className="text-xs text-slate-400">Min. 4.5:1</div>
                  </div>
                  {passAAALarge ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-amber-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CODE AUDITOR (Lighthouse Gauge Meter style) */}
      {activeTab === 'auditor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Code Input */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Editor Cuplikan HTML
              </span>
              <button
                onClick={() => runAudit(inputCode)}
                className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition"
              >
                Jalankan Audit
              </button>
            </div>

            <div className="flex gap-2">
              {sampleSnippets.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputCode(s.code);
                    runAudit(s.code);
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-400 font-medium"
                >
                  {s.name}
                </button>
              ))}
            </div>

            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full h-72 p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
            />
          </div>

          {/* Score Gauge & Issues List (Google Lighthouse style) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            {/* Score Banner */}
            <div className="flex items-center gap-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              {/* Circular Gauge */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      auditScore >= 80 ? 'text-emerald-500' : auditScore >= 50 ? 'text-amber-500' : 'text-red-500'
                    }
                    strokeDasharray={`${auditScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xl font-black text-slate-900 dark:text-white font-mono">
                  {auditScore}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Lighthouse Accessibility Score
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {auditScore >= 80 ? 'Sangat Aksesibel' : auditScore >= 50 ? 'Perlu Ditingkatkan' : 'Banyak Pelanggaran'}
                </div>
                <div className="text-xs text-slate-400">
                  {issues.critical.length} Isu Kritis &bull; {issues.warnings.length} Peringatan
                </div>
              </div>
            </div>

            {/* Diagnostic Breakdown */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {issues.critical.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-start gap-2">
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{item}</span>
                </div>
              ))}

              {issues.warnings.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>{item}</span>
                </div>
              ))}

              {issues.passed.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: POUR PRINCIPLES */}
      {activeTab === 'checklist' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: '1. Perceivable (Dapat Dipersepsikan)',
              desc: 'Informasi dan antarmuka harus dapat diserap melalui indera alternatif (teks alternatif gambar, subtitle audio, kontras tinggi).',
            },
            {
              title: '2. Operable (Dapat Dioperasikan)',
              desc: 'Seluruh kontrol navigasi dapat dioperasikan penuh melalui tombol keyboard (Tab, Enter) tanpa harus menggunakan mouse.',
            },
            {
              title: '3. Understandable (Dapat Dipahami)',
              desc: 'Bahasa teks jelas, tata letak konsisten, dan pesan kesalahan form memberikan petunjuk perbaikan yang terarah.',
            },
            {
              title: '4. Robust (Kuat & Kompatibel)',
              desc: 'Kode HTML semantic valid sehingga dapat dibaca dengan stabil oleh Screen Reader (NVDA, JAWS, VoiceOver).',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
