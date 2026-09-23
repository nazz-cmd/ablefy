import React from 'react';
import {
  Award,
  Lock,
  CheckCircle
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>Visi Berkelanjutan & Dampak Nyata</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Menjawab Tantangan Global Melalui Teknologi Web
        </h2>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Ablefy dirancang untuk mewujudkan ekosistem digital yang adil dan beradab, sejalan dengan nilai inklusi Universitas Negeri Surabaya (UNESA) serta Agenda Pembangunan Berkelanjutan (SDGs).
        </p>
      </div>

      {/* 2 Key SDGs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* SDG 4 */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 dark:bg-slate-900">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
              4
            </div>
            <div>
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">
                Sustainable Development Goal 4
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Pendidikan Berkualitas & Inklusif
              </h3>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Menjamin pendidikan yang inklusif dan merata serta meningkatkan kesempatan belajar sepanjang hayat untuk semua orang, khususnya kelompok rentan dan penyandang disabilitas (Target 4.5).
          </p>
          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>Materi belajar dapat diakses dalam audio, teks, dan visual isyarat.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>Memutus hambatan ketergantungan pada pendamping fisik.</span>
            </div>
          </div>
        </div>

        {/* SDG 10 */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 dark:bg-slate-900">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-pink-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
              10
            </div>
            <div>
              <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider block">
                Sustainable Development Goal 10
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Berkurangnya Kesenjangan
              </h3>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Memberdayakan dan mempromosikan inklusi sosial, ekonomi, dan politik bagi semua, terlepas dari status usia, disabilitas, atau latar belakang lainnya (Target 10.2).
          </p>
          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-pink-500 shrink-0" />
              <span>Menjamin kesetaraan hak bersuara dan menyerap informasi di internet.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-pink-500 shrink-0" />
              <span>Menghilangkan stigma bahwa difabel tidak mampu mengakses teknologi maju.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tech & Privacy Guarantees */}
      <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-600" />
          Komitmen Keamanan Data & Etika Aksesibilitas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">
              100% Client-Side Processing
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pemrosesan suara dan mikrofon menggunakan Web Speech API browser bawaan. Tidak ada audio percakapan pribadi yang dikirim ke server penyimpanan pihak ketiga.
            </p>
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">
              Bebas Biaya & Hemat Bandwidth
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Arsitektur web dibuat sangat ringan tanpa backend yang berat, sehingga dapat dibuka secara mulus meski pada koneksi internet terbatas di wilayah 3T.
            </p>
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">
              Kepatuhan Standar WCAG 2.1
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Menerapkan rasio kontras 7:1 (AAA), semantic HTML5, aria-labels lengkap, dan navigasi keyboard ramah pembaca layar (screen reader).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
