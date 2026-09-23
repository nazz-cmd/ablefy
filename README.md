# Ablefy — Universal Inclusivity & Web Accessibility Platform

<div align="center">

![Ablefy Logo](https://img.shields.io/badge/Ablefy-Platform%20Inklusi%20Universal-4F46E5?style=for-the-badge&logo=accessibility&logoColor=white)
![WCAG Standard](https://img.shields.io/badge/WCAG-2.1%20AAA%20Compliant-10B981?style=for-the-badge)
![SDG Alignment](https://img.shields.io/badge/SDGs-Goal%204%20%26%20Goal%2010-E11D48?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Vite%20%7C%20Tailwind-38BDF8?style=for-the-badge)

**"Memampukan Setiap Insan, Menembus Setiap Batas Akses."**  
*Karya Inovasi Teknologi Web untuk Kompetisi **Gayatama 2026** — Universitas Negeri Surabaya (UNESA)*

</div>

---

## 📖 Latar Belakang Masalah
Pendidikan dan informasi digital adalah hak asasi setiap warga negara. Namun, lebih dari **22,9 juta penyandang disabilitas di Indonesia** masih sering menghadapi diskriminasi akses di dunia web:
1. **Tunanetra & Low-Vision:** Terhambat oleh rasio kontras warna yang buruk serta ketiadaan pembaca suara terstruktur.
2. **Teman Tuli & Gangguan Pendengaran:** Mengalami kendala menyerap materi perkuliahan audio-visual tanpa adanya subtitle (*live captioning*) dan jembatan bahasa isyarat.
3. **Pembelajar Disleksia & ADHD:** Mengalami kelelahan kognitif (*cognitive fatigue*) akibat tipografi padat dan huruf yang tampak bertumpuk atau berputar.

**Ablefy** hadir sebagai platform web asistif multi-modal terpadu yang membalikkan stigma *"disability"* menjadi *"ability"* melalui pemanfaatan standar aksesibilitas web tertinggi (**WCAG 2.1 AAA**) dan teknologi Web API modern.

---

## ✨ Fitur Unggulan (Core Features)

### 1. 🎛️ Global Accessibility Engine (Floating Controller)
Pengguna dapat mengkustomisasi seluruh antarmuka secara instan melalui toolbar aksesibilitas:
* **Mode Kontras Tinggi:** Pilihan kontras standar, *Yellow-on-Black* (Night Vision/Low Vision dengan rasio > 7:1), Gelap Pekat, dan Monokrom.
* **Mode Ramah Disleksia:** Integrasi tipografi **OpenDyslexic** dengan penambahan *letter-spacing* dan *line-height* otomatis.
* **Garis Pemandu Baca (*Reading Ruler*):** Pemandu mata horizontal interaktif yang mengikuti kursor untuk menjaga fokus pembaca.
* **Panduan Suara Interaktif (*Voice Cues*):** Notifikasi vokal otomatis setiap kali pengaturan diubah untuk membantu tunanetra.
* **Navigasi Keyboard Penuh (*Full Tab-Nav*):** 100% dapat dioperasikan hanya dengan tombol `Tab` dan `Enter` dilengkapi *focus indicator* yang sangat jelas.

### 2. 🎙️ Universal Multi-Modal Studio
* **Text-to-Speech (TTS) dengan Sorotan Kata (*Word Highlighting*):** Teks materi dibacakan dengan suara alami bahasa Indonesia, sementara kata yang sedang diucapkan menyala secara dinamis dengan warna kontras.
* **Speech-to-Text (STT Live Dictation):** Merekam suara dosen/pemateri secara *real-time* dan menampilkannya sebagai subtitle berukuran besar di layar untuk Teman Tuli.
* **Penyederhana Teks (*Easy-Reader Mode*):** Meringkas materi akademik yang padat menjadi poin-poin sederhana yang ramah kognitif.

### 3. 🤲 BISINDO Sign Hub (Kamus & Kuis Isyarat)
* **Kamus Kosakata Interaktif:** Pilihan kosakata sapaan, kampus, emosi, dan abjad lengkap dengan panduan langkah gestur jari dan ekspresi non-manual.
* **Kuis Gamifikasi Edukatif:** Mode latihan tebak isyarat dengan penghitung skor dan animasi perayaan *confetti*.

### 4. 🛡️ Laboratorium Audit Aksesibilitas (WCAG 2.1 Compliance Lab)
* **Kalkulator Kontras Warna Matematis:** Menghitung rasio kontras berdasarkan *Relative Luminance* standar W3C untuk pengujian kepatuhan level AA dan AAA.
* **Auditor Cuplikan Kode HTML:** Memeriksa keberadaan atribut `alt` gambar, label formulir, deskripsi tautan, dan hierarki *heading*.
* **Panduan 4 Pilar POUR:** Panduan edukatif *Perceivable, Operable, Understandable, Robust*.

---

## 🎯 Keselarasan dengan Sustainable Development Goals (SDGs)
* **SDG 4 (Pendidikan Berkualitas):** Target 4.5 — Menghapus disparitas disabilitas dalam akses pendidikan tinggi dan pelatihan vokasi melalui teknologi asistif.
* **SDG 10 (Berkurangnya Kesenjangan):** Target 10.2 — Mendorong inklusi sosial dan kesetaraan hak bersuara bagi komunitas difabel.

---

## 🔒 Keamanan & Privasi (Zero Backend Architecture)
* **100% Client-Side:** Seluruh sintesis dan transkripsi suara diproses di sisi *browser* peramban pengguna melalui **Web Speech API**.
* **Tanpa Penyimpanan Server:** Tidak ada rekaman suara atau teks pribadi mahasiswa yang dikirim ke server pihak ketiga.
* **Super Ringan & Hemat Kuota:** Memastikan aksesibilitas tetap lancar di wilayah dengan jaringan internet terbatas (daerah 3T).

---

## 🚀 Panduan Menjalankan Proyek (Local Setup)

Pastikan telah menginstal **Node.js (versi 18+)**.

```bash
# 1. Masuk ke direktori proyek
cd ablefy

# 2. Instalasi dependensi
npm install

# 3. Jalankan server pengembangan lokal
npm run dev
```

Buka peramban di `http://localhost:5173`.

Untuk membangun berkas produksi (*production build*):
```bash
npm run build
npm run preview
```

---

## 👥 Pengembang & Atribusi
* **Ajang Kompetisi:** Gayatama 2026 (International Web Technology Competition)
* **Penyelenggara:** Universitas Negeri Surabaya (UNESA)
* **Lisensi:** MIT License
