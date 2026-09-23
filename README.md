# Ablefy — Universal Inclusivity & Web Accessibility Platform

<div align="center">

![Ablefy Logo](https://img.shields.io/badge/Ablefy-Platform%20Inklusi%20Universal-4F46E5?style=for-the-badge&logo=accessibility&logoColor=white)
![WCAG Standard](https://img.shields.io/badge/WCAG-2.1%20AAA%20Compliant-10B981?style=for-the-badge)
![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite%208-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge)

**"Menyerap Informasi Tanpa Batas. Membuka Ruang Literasi untuk Semua."**  
*Platform web aksesibilitas multi-modal terpadu untuk penyandang disabilitas (Tunanetra, Teman Tuli, Disleksia, dan Disabilitas Fisik).*

🌐 **Live Demo:** [https://ablefy.vercel.app](https://ablefy.vercel.app)

</div>

---

## 📖 1. Latar Belakang Masalah & Urgensi

Di era transformasi digital saat ini, akses terhadap informasi, literasi, dan materi pembelajaran adalah hak fundamental bagi seluruh individu. Namun, lebih dari **22,9 juta penyandang disabilitas di Indonesia** masih kerap menghadapi hambatan aksesibilitas di dunia web:

1. **Sahabat Netra & Low-Vision:** Menghadapi kontras warna yang buruk serta ketiadaan pembaca suara terstruktur dengan sorotan kata visual.
2. **Teman Tuli & Gangguan Pendengaran:** Mengalami kendala menyerap materi percakapan, rapat, atau siaran audio-visual tanpa adanya takarir waktu-nyata (*real-time speech-to-text*) dan media komunikasi bahasa isyarat.
3. **Pembelajar Disleksia & ADHD:** Cepat mengalami kelelahan kognitif (*cognitive fatigue*) akibat tipografi yang rapat dan huruf yang tampak bertumpuk atau melompat.
4. **Disabilitas Fisik & Motorik:** Kesulitan mengoperasikan mouse atau keyboard standar akibat keterbatasan fungsi tangan, tremor, atau kelumpuhan fisik.

**Ablefy** hadir sebagai solusi komprehensif tanpa hambatan (*barrier-free*) yang menerapkan standar kepatuhan aksesibilitas web tertinggi (**WCAG 2.1 Level AAA**) dan teknologi Web API modern.

---

## 🛠️ 2. Teknologi & Arsitektur Sistem (Technology Stack)

Ablefy dibangun dengan standar rekayasa perangkat lunak modern untuk performa tinggi, nol latensi, dan kepatuhan aksesibilitas penuh:

| Kategori | Teknologi | Deskripsi / Peran |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** + **TypeScript** | Arsitektur komponen reaktif dengan *type safety* ketat. |
| **Build Tool & Bundler** | **Vite 8** + **Rolldown** | *Lightning-fast* HMR development dan *minified production bundle*. |
| **Styling & Design System** | **Tailwind CSS v4** | Desain antarmuka modern ala SaaS ramah aksesibilitas (*WCAG AAA*). |
| **Icons & Visuals** | **Lucide React** | Ikon visual yang konsisten dan semantik. |
| **Voice Synthesis (TTS)** | **Web Speech API** + **Microsoft Azure Neural** + **Google Cloud WaveNet** | Sintesis suara alami bahasa Indonesia (Persona Gadis, Ardi, Nadia, Budi, Siti). |
| **AI Transcription (STT)** | **Google Gemini API** (Multimodal) | Transkripsi berkas audio (.mp3, .wav, .m4a) dan ekstraksi takarir video YouTube. |
| **Audio Visualizer** | **Web Audio API** | Analisis spektrum frekuensi vokal nyata 60 FPS tanpa re-render React. |
| **Accessibility Typography** | **OpenDyslexic CDN** + **Plus Jakarta Sans** | Tipografi anti-mirroring untuk pembelajar disleksia. |
| **Hosting & Deployment** | **Vercel** + **Vercel Serverless Functions** | CDN Edge global dengan rute `/api/tts` serverless function. |

---

## ✨ 3. Modul & Fitur Unggulan (Core Features)

### 🎛️ A. Engine Aksesibilitas Terintegrasi (Global Accessibility Engine)
* **Mode Kontras Tinggi (7:1+ Contrast Ratio):** Mode *Yellow-on-Black* (Kuning-Hitam) yang teruji secara klinis bagi pengguna *low vision* dan fotofobia.
* **Tipografi Ramah Disleksia:** Pengaktifan satu klik font **OpenDyslexic** dengan penyesuaian bobot bawah huruf guna mencegah rotasi visual.
* **Garis Pemandu Baca (*Reading Ruler*):** Batang pemandu horizontal yang mengikuti kursor untuk menjaga fokus baris membaca bagi pengguna ADHD/disleksia.
* **Panduan Suara (*Voice Cues*):** Umpan balik vokal otomatis setiap kali aksi atau perpindahan halaman dilakukan.
* **Skala Font Dinamis:** Skala instan 100%, 115%, hingga 130% tanpa merusak tata letak responsif.

### 📖 B. Studio Pembaca Teks & Bionic Focus (`UniversalStudio`)
* **Sintesis Suara Alami Berirama Manusia:** Pembacaan kalimat demi kalimat dengan intonasi natural (pilihan suara pria/wanita).
* **Sorotan Kata Karaoke (*Word Highlighting*):** Kata yang sedang diucapkan menyala secara dinamis untuk melatih korelasi auditori-visual.
* **Mode Bionic Reading:** Penebalan otomatis huruf awal setiap kata untuk mempercepat pemindaian visual otak pembaca.
* **Multi-Input Dokumen:** Mendukung salinan teks (clipboard), pengetikan langsung, unggah berkas (`.txt`, `.pdf`, `.md`), serta ekstraksi artikel web via AI.

### 🎙️ C. Transkripsi Wicara & Takarir Video (`LectureCompanion`)
* **Transkripsi Mikrofon Langsung (*Real-Time Speech-to-Text*):** Menangkap suara pembicara seketika dan menampilkannya sebagai takarir terstruktur dengan pemisahan jeda alami.
* **Transkripsi Berkas Audio Digital:** Mendengarkan dan mentranskripsikan berkas audio (`.mp3`, `.wav`, `.m4a`) menggunakan integrasi Google Gemini API.
* **Video & Subtitle Otomatis:** Pemutar video YouTube dengan sinkronisasi takarir berstempel waktu (*timestamped clickable transcript*).
* **Equalizer Akustik Nyata (Web Audio API):** Gelombang equalizer 60 FPS yang merespons frekuensi suara mikrofon secara langsung.

### 🤲 D. BISINDO Sign Hub (`SignHub`)
* **Papan Rangkai Kalimat Isyarat (*Sentence Builder*):** Papan interaktif dua arah untuk merangkai gestur isyarat dengan simulasi pemutaran berurutan (kecepatan 1.0x dan 0.7x pelan).
* **Terjemahan Kalimat Alami:** Mengubah urutan kata isyarat menjadi kalimat bahasa Indonesia yang mengalir lengkap dengan tombol suara.
* **Kamus Kosakata Lengkap (99 Kosakata + Abjad Jari A–Z):** Terbagi dalam 7 kategori (Sapaan, Keluarga, Aktivitas, Kata Tanya, Emosi, Waktu & Angka, serta Abjad Jari A-Z).
* **Rincian Struktur Linguistik Gestur:** Tiap kata memuat bentuk tangan (*handshape*), titik lokasi (*location*), arah gerak (*movement*), ekspresi wajah (*NMM*), dan instruksi langkah bertahap.
* **Panduan Etika Berkomunikasi Teman Tuli:** 3 pilar santun interaksi visual.

### 🗣️ E. Navigasi Bebas Tangan & Switch Control (`VoiceNavigator` & `MotorShortcutsModal`)
* **Pengendali Perintah Suara Vokal (*Hands-Free Voice Navigator*):** Mengendalikan seluruh perpindahan tab, pemutaran suara, dan pengaturan kontras melalui perintah lisan bagi penderita kelumpuhan atau amputasi.
* **Pintasan Akses Sakelar Tunggal (*Switch Device Shortcuts*):** Hotkey satu tombol (misal: tombol `0`, `1`, `2`, `3`, `[`, `]`, `K`, `V`) dengan area target sentuh besar (> 48px) yang ramah motorik tremor.

---

## 📂 4. Struktur Direktori Proyek (Repository Structure)

```text
.
├── LICENSE                    # Lisensi Open-Source MIT
├── api/
│   └── tts.js                 # Vercel Serverless Function untuk sintesis suara Azure Neural
├── public/
│   ├── favicon.svg                # Favicon identitas Ablefy
│   └── icons.svg                  # Asset simbol & SVG
├── src/
│   ├── assets/                    # Asset gambar & ilustrasi
│   ├── components/
│   │   ├── accessibility/         # Komponen aksesibilitas (VoiceNavigator, MotorShortcuts, ReadingRuler)
│   │   ├── bisindo/               # Modul Bahasa Isyarat (SignHub, Sentence Builder, Kamus)
│   │   ├── checker/               # Laboratorium audit rasio kontras warna
│   │   ├── common/                # Komponen bersama (AblefyLogo, RealtimeAudioWave)
│   │   ├── home/                  # Halaman Beranda internal (HomeWorkspace, Hero)
│   │   ├── landing/               # Halaman publik depan (LandingPage)
│   │   ├── layout/                # Navigasi & Shell (AppSidebar, TopAppBar, SkipToContent)
│   │   ├── studio/                # Studio Pembaca Teks & Bionic Focus (UniversalStudio)
│   │   └── workspace/             # Transkripsi Wicara Langsung (LectureCompanion)
│   ├── context/
│   │   └── AccessibilityContext.tsx # Global State Aksesibilitas (Kontras, Disleksia, Suara, Font Scale)
│   ├── data/
│   │   ├── bisindoData.ts         # Basis data 99 kosakata BISINDO & gestur A-Z
│   │   ├── sampleArticles.ts      # Dokumen bacaan sampel
│   │   └── videoCaptions.ts       # Takarir video sampel berstempel waktu
│   ├── hooks/
│   │   └── useAudioVisualizer.ts  # Hook integrasi visualizer Web Audio API
│   ├── services/
│   │   ├── geminiAudioTranscribeService.ts # Layanan transkripsi Gemini API
│   │   ├── googleTtsService.ts             # Layanan Google Cloud TTS WaveNet
│   │   ├── microsoftTtsService.ts          # Layanan Azure Neural TTS
│   │   └── webArticleExtractorService.ts   # Layanan pembersih artikel web
│   ├── utils/
│   │   ├── audioVisualizerService.ts       # Singleton Web Audio API AnalyserNode 60fps
│   │   ├── nlpIntentClassifier.ts          # NLP classifier untuk perintah suara navigasi
│   │   └── speechTextEnhancer.ts           # Algoritma pemisah jeda hening wicara
│   ├── App.tsx                    # Routing tampilan utama (Landing Page vs Workspace Canvas)
│   ├── index.css                  # Tailwind CSS v4 & WCAG base layer
│   └── main.tsx                   # Entry point aplikasi React
├── .env.example                   # Contoh konfigurasi variabel lingkungan
├── .gitignore                     # Proteksi kunci rahasia dari git commit
├── package.json                   # Dependensi & script proyek
├── tsconfig.json                  # Konfigurasi TypeScript compiler
├── vercel.json                    # Konfigurasi deployment & URL rewrites Vercel
└── vite.config.ts                 # Konfigurasi build bundler Vite
```

---

## 🚀 5. Panduan Instalasi & Menjalankan Lokal (Quick Start)

### Prasyarat:
* **Node.js** versi 18.0.0 atau lebih baru
* **npm** (atau pnpm / yarn)

### Langkah Instalasi:

1. **Clone Repositori:**
   ```bash
   git clone https://github.com/nazz-cmd/ablefy.git
   cd ablefy
   ```

2. **Instalasi Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Variabel Lingkungan:**
   Salin berkas `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Isi kunci API Google Gemini pada berkas `.env`:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Jalankan Server Pengembangan (Dev Server):**
   ```bash
   npm run dev
   ```
   Aplikasi akan terbuka di `http://localhost:5173`.

5. **Uji Build Produksi (Production Build):**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🌐 6. Panduan Deployment ke Vercel

Proyek ini telah dikonfigurasi secara optimal untuk **Vercel**:

1. Buka [Vercel Dashboard](https://vercel.com) dan impor repositori `https://github.com/nazz-cmd/ablefy`.
2. Pengaturan build otomatis terdeteksi:
   * **Framework Preset:** `Vite`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
3. Tambahkan Environment Variable di Vercel:
   * **Key:** `VITE_GEMINI_API_KEY`
   * **Value:** *(Kunci API Gemini Anda)*
4. Klik **Deploy**. Aplikasi akan langsung aktif secara global.

---

## 🔒 7. Keamanan & Privasi Pengguna

* **Client-First Processing:** Transkripsi wicara mikrofon langsung dan pembacaan teks dasar diproses secara lokal pada peramban pengguna menggunakan browser Web Speech API.
* **Perlindungan Kredensial:** Kunci rahasia API dilindungi dengan `.gitignore` dan aturan enkripsi environment variable di serverless function.
* **Nol Penyimpanan Data Pribadi:** Ablefy tidak menyimpan rekaman audio atau naskah transkripsi di database eksternal untuk menjamin privasi penuh.

---

## 📄 8. Lisensi & Hak Cipta

Proyek ini dikembangkan di bawah lisensi terbuka [MIT License](LICENSE).  
Didedikasikan untuk kemandirian akses digital sahabat difabel di seluruh dunia.
