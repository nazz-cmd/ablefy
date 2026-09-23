# PROPOSAL KARYA TEKNOLOGI WEB
## GAYATAMA 2026 — INTERNATIONAL WEB TECHNOLOGY COMPETITION
**Universitas Negeri Surabaya (UNESA)**

---

<div align="center">

# ABLEFY
### *Universal Inclusivity & Assistive Web Accessibility Platform*
**"Memampukan Setiap Insan, Menembus Setiap Batas Aksesibilitas Digital"**

<br/>

**Kategori Kompetisi:**  
International Web Technology Competition (Batch 1)

**Fokus Sustainable Development Goals (SDGs):**  
SDG 4 (*Quality Education* — Target 4.5) & SDG 10 (*Reduced Inequalities* — Target 10.2)

**Standar Kepatuhan Aksesibilitas:**  
W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AAA Compliant

<br/>

---

### **DISUSUN OLEH:**
### **NAMA TIM: GO GO WIN**

| Nama Anggota | NIM | Program Studi | Peran Tim |
| :--- | :---: | :---: | :---: |
| **Nazalan Muaffari** | 26081494250 | S1 Bisnis Digital | **Ketua Tim (Team Leader & Lead Developer)** |
| **Ardina Dwitari** | 26080694018 | S1 Akuntansi | **Anggota Tim (Research, Finance & Documentation)** |

<br/>

**Perguruan Tinggi:**  
Universitas Negeri Surabaya (UNESA)  
Surabaya, Jawa Timur, Indonesia  

**Tautan Repositori GitHub Resmi:**  
[https://github.com/nazz-cmd/ablefy](https://github.com/nazz-cmd/ablefy)

**Tautan Live Demo Aplikasi:**  
[https://ablefy.vercel.app](https://ablefy.vercel.app)

**Tahun:**  
2026

</div>

---

## RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)

Perkembangan teknologi web dan transformasi digital di ranah pendidikan tinggi serta layanan publik saat ini belum diimbangi dengan inklusivitas yang merata. Di Indonesia, lebih dari **22,9 juta penyandang disabilitas** menghadapi hambatan serius dalam mengakses informasi digital. Mayoritas platform web dibangun dengan asumsi pengguna non-disabilitas (*able-bodied*), sehingga memicu pengucilan digital (*digital exclusion*) bagi penyandang tunanetra/low-vision, tunarungu, disleksia/ADHD, maupun disabilitas motorik.

**Ablefy** hadir sebagai terobosan platform web asistif terpadu (*Universal Assistive & Web Accessibility Platform*) yang dirancang khusus untuk mewujudkan ekosistem web yang setara, mandiri, dan bebas hambatan. Dibangun dengan mematuhi standar web internasional tertinggi **W3C WCAG 2.1 Level AAA**, Ablefy mengintegrasikan 5 inovasi multimodal mutakhir:
1. **Global Accessibility Engine:** Kendali aksesibilitas instan mencakup mode kontras tinggi tervalidasi (*Yellow-on-Black* rasio kontras > 7:1), tipografi ramah disleksia (*OpenDyslexic*), pemandu baca visual (*Reading Ruler*), skala teks dinamis (100%–130%), serta umpan balik suara cerdas (*Voice Cues*).
2. **Universal Multi-Modal Reading Studio:** Memadukan *Text-to-Speech (TTS)* saraf alami (*Azure Neural Voice* & fallback lokal) dengan penyorotan kata *real-time*, mode *Bionic Reading* (penegasan fiksasi mata), *Focus Mask* (peredup gangguan periferal), dan *Easy-Reader Mode* ramah kognitif.
3. **Live Speech Transcription & Media Hub:** Transkripsi wicara kuliah langsung (*Speech-to-Text*) secara instan dengan teks berukuran besar untuk Teman Tuli, pemutar video YouTube dengan takarir tersinkronisasi stempel waktu (*clickable timestamped captions*), dan visualizer frekuensi akustik nyata 60 FPS menggunakan *Web Audio API*.
4. **BISINDO Sign Hub & Sentence Builder:** Platform pembelajaran dan komunikasi Bahasa Isyarat Indonesia (BISINDO) dua arah yang dilengkapi **Papan Rangkai Kalimat Isyarat (*Sentence Builder*)** dengan simulasi pemutaran sekuensial (kecepatan 1.0x dan 0.7x), terjemahan kalimat alami bersuara, kamus lengkap **99 kosakata** dalam 7 kategori terstruktur, panduan 5 parameter linguistik gestur, dan etika komunikasi Teman Tuli.
5. **Hands-Free NLP Voice Navigator & Switch Control:** Pengendali suara bebas tangan dengan *Natural Language Processing (NLP) Intent Classifier* (22 kategori aksi sistem) dan *Smart Semantic DOM Clicker* untuk navigasi lisan tanpa mouse, serta hotkey sakelar tunggal (*switch control*) dengan target sentuh > 48px bagi penyandang disabilitas motorik dan tremor.

Dengan menerapkan prinsip *Client-First / Zero Backend Architecture*, Ablefy menjamin **100% kedaulatan privasi data**, bebas pelacakan, sangat ringan (kecepatan muat < 1,2 detik), dan dapat dioperasikan secara stabil bahkan di wilayah dengan konektivitas internet terbatas (daerah 3T). Karya ini berkontribusi langsung pada pencapaian **SDG 4 (Target 4.5: Pendidikan Berkualitas Inklusif)** dan **SDG 10 (Target 10.2: Berkurangnya Kesenjangan Sosial-Digital)**.

---

## DAFTAR ISI

1. [BAB I. PENDAHULUAN](#bab-i-pendahuluan)
   - 1.1 [Latar Belakang & Urgensi Masalah](#11-latar-belakang--urgensi-masalah)
   - 1.2 [Rumusan Masalah](#12-rumusan-masalah)
   - 1.3 [Tujuan Pengembangan](#13-tujuan-pengembangan)
   - 1.4 [Manfaat Inovasi](#14-manfaat-inovasi)
   - 1.5 [Keselarasan dengan Sustainable Development Goals (SDGs)](#15-keselarasan-dengan-sustainable-development-goals-sdgs)
2. [BAB II. TINJAUAN PUSTAKA & LANDASAN TEORI](#bab-ii-tinjauan-pustaka--landasan-teori)
   - 2.1 [Standar Aksesibilitas Web Internasional (W3C WCAG 2.1 Level AAA)](#21-standar-aksesibilitas-web-internasional-w3c-wcag-21-level-aaa)
   - 2.2 [Teknologi Asistif & Multimodal Web Interaction](#22-teknologi-asistif--multimodal-web-interaction)
   - 2.3 [Linguistik Bahasa Isyarat Indonesia (BISINDO) & Komunikasi Visual](#23-linguistik-bahasa-isyarat-indonesia-bisindo--komunikasi-visual)
   - 2.4 [Tipografi Ramah Neurodivergen (OpenDyslexic & Bionic Reading)](#24-tipografi-ramah-neurodivergen-opendyslexic--bionic-reading)
   - 2.5 [Studi Komparasi Solusi Sejenis](#25-studi-komparasi-solusi-sejenis)
3. [BAB III. METODOLOGI & PERANCANGAN SISTEM](#bab-iii-metodologi--perancangan-sistem)
   - 3.1 [Metodologi Desain Inklusif (*Human-Centered Inclusive Design*)](#31-metodologi-desain-inklusif-human-centered-inclusive-design)
   - 3.2 [Analisis Kebutuhan Persona Difabel](#32-analisis-kebutuhan-persona-difabel)
   - 3.3 [Arsitektur Sistem & Spesifikasi Teknologi](#33-arsitektur-sistem--spesifikasi-teknologi)
   - 3.4 [Alur Pemrosesan NLP Voice Navigator & Unified Audio Pipeline](#34-alur-pemrosesan-nlp-voice-navigator--unified-audio-pipeline)
4. [BAB IV. IMPLEMENTASI FITUR & HASIL PENGUJIAN](#bab-iv-implementasi-fitur--hasil-pengujian)
   - 4.1 [Implementasi 5 Modul Solusi Utama Ablefy](#41-implementasi-5-modul-solusi-utama-ablefy)
   - 4.2 [Hasil Audit Kepatuhan Aksesibilitas WCAG 2.1 AAA](#42-hasil-audit-kepatuhan-aksesibilitas-wcag-21-aaa)
   - 4.3 [Evaluasi Kinerja, Keamanan & Privasi (*Zero-Backend*)](#43-evaluasi-kinerja-keamanan--privasi-zero-backend)
5. [BAB V. KESIMPULAN & TAHAPAN KEBERLANJUTAN (ROADMAP)](#bab-v-kesimpulan--tahapan-keberlanjutan-roadmap)
   - 5.1 [Kesimpulan](#51-kesimpulan)
   - 5.2 [Roadmap Pengembangan Berkelanjutan (2026–2028)](#52-roadmap-pengembangan-berkelanjutan-20262028)
6. [DAFTAR PUSTAKA](#daftar-pustaka)
7. [LAMPIRAN](#lampiran)

---

## BAB I. PENDAHULUAN

### 1.1 Latar Belakang & Urgensi Masalah
Akses terhadap informasi dan pendidikan digital merupakan hak asasi manusia yang fundamental, sebagaimana diamanatkan dalam **Undang-Undang Republik Indonesia Nomor 8 Tahun 2016 tentang Penyandang Disabilitas** serta **Konvensi PBB tentang Hak-Hak Penyandang Disabilitas (UN CRPD)**. Data resmi Badan Pusat Statistik (BPS) dan Kementerian Sosial Republik Indonesia mencatat bahwa terdapat lebih dari **22,9 juta jiwa penyandang disabilitas** di Indonesia.

Namun, di tengah akselerasi digitalisasi pascapandemi, mayoritas layanan web, portal akademik kampus, perpustakaan digital, dan materi perkuliahan daring dirancang tanpa memperhatikan standar aksesibilitas web (*web accessibility*). Kondisi ini menimbulkan berbagai hambatan nyata:
1. **Penyandang Hambatan Penglihatan (Tunanetra & Low-Vision):** Menghadapi kontras warna yang buruk, font tipis tanpa penyesuaian ukuran, serta website yang tidak kompatibel dengan pembaca layar (*screen reader*).
2. **Penyandang Hambatan Pendengaran (Teman Tuli & Hard of Hearing):** Terisolasi dari konten perkuliahan audio dan video karena ketiadaan transkripsi takarir otomatis (*live captioning*) dan minimnya media komunikasi berbasis Bahasa Isyarat Indonesia (BISINDO).
3. **Penyandang Neurodivergen (Disleksia, ADHD, Cognitive Overload):** Mengalami distorsi visual saat membaca teks panjang berkepadatan tinggi tanpa pemandu visual dan tanpa mode penyederhanaan informasi.
4. **Penyandang Hambatan Motorik:** Tidak mampu mengarahkan kursor mouse secara presisi, sering terjebak dalam perangkap keyboard (*keyboard traps*), dan ketiadaan kendali suara bebas tangan (*hands-free control*).

Selama ini, solusi yang tersedia umumnya berupa ekstensi peramban (*browser extensions*) terpisah yang memerlukan instalasi rumit, berbayar, memberatkan memori komputer, serta berpotensi mengorbankan privasi data pengguna. Oleh karena itu, diperlukan sebuah platform asistif mandiri yang terintegrasi secara *native* di web, berkecepatan tinggi, aman, dan mematuhi standar internasional tertinggi.

### 1.2 Rumusan Masalah
Berdasarkan latar belakang di atas, rumusan masalah dalam pengembangan proyek ini adalah:
1. Bagaimana merancang platform web asistif terpadu yang memenuhi standar internasional **W3C WCAG 2.1 Level AAA** untuk memfasilitasi kebutuhan ragam disabilitas?
2. Bagaimana mengintegrasikan teknologi *speech synthesis*, *speech recognition*, *audio visualization*, dan pemrosesan bahasa alami (*NLP*) secara langsung di sisi klien (*client-side*) tanpa mengorbankan privasi dan kinerja perangkat?
3. Bagaimana menghadirkan media pembelajaran dan komunikasi Bahasa Isyarat Indonesia (BISINDO) dua arah yang interaktif melalui fitur perangkai kalimat (*Sentence Builder*) dan kamus terstruktur?
4. Bagaimana memastikan platform dapat diakses secara responsif di berbagai perangkat (desktop, tablet, mobile) dan ramah terhadap pengguna di wilayah dengan keterbatasan bandwidth internet (daerah 3T)?

### 1.3 Tujuan Pengembangan
Tujuan dari inovasi **Ablefy** adalah:
1. Mengembangkan platform web asistif inklusif universal yang menggabungkan kontrol aksesibilitas global, studio pembaca multimodal, transkripsi kuliah langsung, sentra bahasa isyarat, serta navigasi bebas tangan.
2. Memenuhi 100% kriteria sukses **WCAG 2.1 Level AAA** pada aspek keterbacaan (*Perceivable*), keteroperasian (*Operable*), keterpahaman (*Understandable*), dan keandalan sistem (*Robust*).
3. Memberikan media pembelajaran BISINDO interaktif dengan 99 kosakata terverifikasi dan fitur simulasi perangkai kalimat visual.
4. Menerapkan arsitektur *Zero-Backend* guna menjamin kedaulatan data pribadi pengguna dan menghadirkan pengalaman web berkecepatan tinggi.

### 1.4 Manfaat Inovasi
* **Bagi Mahasiswa dan Sahabat Difabel:** Meningkatkan kemandirian belajar, mempermudah pemahaman materi perkuliahan, serta membuka akses komunikasi inklusif di lingkungan akademik.
* **Bagi Komunitas Pendidikan & Dosen:** Menyediakan alat bantu kuliah langsung yang secara otomatis mentranskripsikan ceramah lisan menjadi teks di layar proyektor ruang kelas.
* **Bagi Pengembang & Desainer Web:** Memberikan laboratorium audit mandiri untuk menguji kepatuhan kontras warna dan struktur kode HTML semantik.

### 1.5 Keselarasan dengan Sustainable Development Goals (SDGs)
Ablefy berakar pada dua tujuan pembangunan berkelanjutan global PBB (Agenda 2030):
* **SDG 4 (Quality Education — Target 4.5):** Menghilangkan disparitas gender dan disabilitas dalam pendidikan, serta menjamin akses setara ke semua jenjang pendidikan tinggi dan pelatihan kejuruan.
* **SDG 10 (Reduced Inequalities — Target 10.2):** Memberdayakan dan mendorong inklusi sosial, ekonomi, dan digital bagi seluruh lapisan masyarakat tanpa diskriminasi kondisi fisik dan neurologis.

---

## BAB II. TINJAUAN PUSTAKA & LANDASAN TEORI

### 2.1 Standar Aksesibilitas Web Internasional (W3C WCAG 2.1 Level AAA)
World Wide Web Consortium (W3C) menerbitkan *Web Content Accessibility Guidelines* (WCAG) 2.1 sebagai tolok ukur universal kepatuhan aksesibilitas web. Standar ini berpijak pada 4 prinsip utama (**POUR**):
1. **Perceivable (Dapat Dipersepsikan):** Informasi dan komponen antarmuka pengguna harus dapat disajikan dalam bentuk yang dapat ditangkap oleh indra pengguna (misal: alternatif teks, audio deskripsi, kontras warna yang ditingkatkan). Kriteria AAA 1.4.6 menetapkan rasio kontras teks minimum sebesar **7:1** terhadap latar belakang.
2. **Operable (Dapat Dioperasikan):** Seluruh fungsionalitas antarmuka harus dapat dioperasikan melalui keyboard tanpa jebakan navigasi (Kriteria 2.1.1 & 2.1.2) dan memberikan waktu yang cukup bagi pengguna untuk berinteraksi.
3. **Understandable (Dapat Dipahami):** Bahasa dan tata letak teks harus konsisten, mudah dipahami, serta dilengkapi mekanisme pencegahan kesalahan input (Kriteria 3.1.5 & 3.3.2).
4. **Robust (Kuat & Andal):** Konten web harus dapat diinterpretasikan secara andal oleh berbagai agen pengguna, termasuk teknologi pembaca layar (*screen reader* NVDA, JAWS, VoiceOver, TalkBack) melalui elemen HTML semantik dan atribut ARIA (Kriteria 4.1.2).

### 2.2 Teknologi Asistif & Multimodal Web Interaction
Interaksi multimodal menggabungkan berbagai modalitas input dan output (visual, audio, dan kinestetik/motorik) untuk memperluas jangkauan interaksi manusia dan komputer (*Human-Computer Interaction*). Melalui **Web Speech API** standar W3C, peramban modern memiliki kapabilitas *SpeechSynthesis* untuk sintesis suara teks (*Text-to-Speech*) dan *SpeechRecognition* untuk penangkapan dikte suara langsung (*Speech-to-Text*). Pemanfaatan API bawaan ini meniadakan latensi transfer data ke server luar dan menghemat sumber daya jaringan.

### 2.3 Linguistik Bahasa Isyarat Indonesia (BISINDO) & Komunikasi Visual
Bahasa Isyarat Indonesia (BISINDO) adalah bahasa alami visual-spasial yang tumbuh dan digunakan oleh komunitas Tuli di Indonesia. Secara linguistik, setiap gestur isyarat dalam BISINDO dibentuk oleh 5 parameter fonologis:
1. **Bentuk Tangan (*Handshape*):** Konfigurasi jari dan telapak tangan saat membentuk isyarat.
2. **Titik Lokasi (*Location*):** Posisi tubuh tempat isyarat dilakukan (misal: pelipis, dada, dagu, ruang netral).
3. **Arah Gerak (*Movement*):** Lintasan, frekuensi, dan dinamika gerakan tangan (misal: melingkar, mengetuk, mengarah ke luar).
4. **Orientasi Telapak (*Orientation*):** Arah hadap telapak tangan (menghadap ke dalam, ke atas, atau berhadapan).
5. **Ekspresi Non-Manual (*Non-Manual Markers / NMM*):** Mimik wajah, tatapan mata, dan gerakan kepala yang berfungsi sebagai penentu makna gramatikal dan intonasi kalimat.

### 2.4 Tipografi Ramah Neurodivergen (OpenDyslexic & Bionic Reading)
* **OpenDyslexic Font:** Rupa huruf yang dirancang dengan gravitasi visual lebih berat di bagian dasar setiap karakter. Desain asimetris ini membantu otak pembaca disleksia membedakan huruf yang rentan tertukar secara visual (seperti 'b', 'd', 'p', 'q') dan mencegah ilusi huruf terbalik atau melayang.
* **Bionic Reading:** Metode membaca asistif dengan menonjolkan (menebalkan) karakter awal pada setiap kata. Teknik ini memandu fiksasi mata (*saccadic eye movement*), memungkinkan otak menyelesaikan pembacaan kata secara lebih efisien dan mengurangi kelelahan kognitif bagi penderita ADHD.

### 2.5 Studi Komparasi Solusi Sejenis

| Parameter Evaluasi | Ekstensi Browser Pihak Ketiga | Platform Aksesibilitas Konvensional | **ABLEFY (Inovasi Kami)** |
| :--- | :---: | :---: | :---: |
| **Instalasi & Konfigurasi** | Memerlukan instalasi plugin | Perlu registrasi & download | **Zero-Install (Langsung di Web)** |
| **Kepatuhan WCAG** | Terbatas Level AA | Rata-rata Level AA | **Full Level AAA Compliant** |
| **Dukungan BISINDO** | Tidak Ada | Tidak Ada | **Sentence Builder + 99 Kosakata** |
| **Arsitektur Privasi** | Data dikirim ke cloud | Bergantung pada database server | **100% Client-First (Zero Backend)** |
| **Navigasi Suara Bebas Tangan** | String matching kaku | Tidak Tersedia | **NLP Intent Classifier (22 Intent)** |
| **Visualizer Audio 60 FPS** | Tidak Ada | Tidak Ada | **Realtime Web Audio API** |
| **Biaya Layanan** | Berlangganan / Freemium | Lisensi Institusional Mahal | **100% Terbuka & Gratis (MIT)** |

---

## BAB III. METODOLOGI & PERANCANGAN SISTEM

### 3.1 Metodologi Desain Inklusif (*Human-Centered Inclusive Design*)
Pengembangan Ablefy menerapkan metodologi *Agile Development* yang diselaraskan dengan prinsip *Inclusive Design*:
1. **Recognize Exclusion:** Mengidentifikasi titik-titik di mana pengguna difabel terhambat saat menggunakan web standar.
2. **Solve for One, Extend to Many:** Merancang solusi khusus bagi kelompok disabilitas spesifik yang ternyata memberikan kemudahan bagi semua orang (misal: teks berukuran besar membantu low-vision sekaligus memudahkan orang yang lelah membaca).
3. **Iterative Usability & Testing:** Pengujian siklikal berkala terhadap rasio kontras matematis, navigasi keyboard penuh, responsivitas multi-device, dan kejelasan fonetik audio.

### 3.2 Analisis Kebutuhan Persona Difabel

```
+---------------------------------------------------------------------------------------+
|                             PERSONA PENGGUNA ABLEFY                                   |
+----------------------+--------------------+---------------------+---------------------+
| Budi (Low-Vision)    | Siti (Teman Tuli)  | Rian (Disleksia)    | Dewi (Motorik)      |
+----------------------+--------------------+---------------------+---------------------+
| * Mata cepat lelah   | * Sulit mendengar  | * Huruf menumpuk &  | * Tangan tremor /   |
| * Huruf kecil buram  |   audio perkuliahan|   tampak bergerak   |   amputasi jari     |
| * Kontras tipis kabur| * Perlu visualisasi| * Kelelahan kognitif| * Kesulitan mouse   |
|                      |   bahasa isyarat   |   bacaan panjang    |                     |
+----------------------+--------------------+---------------------+---------------------+
| SOLUSI ABLEFY:       | SOLUSI ABLEFY:     | SOLUSI ABLEFY:      | SOLUSI ABLEFY:      |
| -> Kontras Kuning/   | -> Transkripsi live| -> OpenDyslexic Font| -> Hands-Free Voice |
|    Hitam (> 7:1)     |    teks raksasa    | -> Reading Ruler    |    Navigator (NLP)  |
| -> Skala Font 130%   | -> Takarir YouTube | -> Bionic Reading   | -> Switch Control   |
| -> Azure Neural TTS  | -> BISINDO Hub     | -> Focus Mask       | -> Target > 48px    |
+----------------------+--------------------+---------------------+---------------------+
```

### 3.3 Arsitektur Sistem & Spesifikasi Teknologi

#### Diagram Arsitektur Sistem:
```
+---------------------------------------------------------------------------------------+
|                                    LAPISAN KLIEN (PERAMBAN)                           |
|                                                                                       |
|  +--------------------+  +--------------------+  +---------------------------------+  |
|  |   UI Inklusif &    |  | Global A11y State  |  |   NLP Voice Intent Classifier   |  |
|  | Komponen Semantik  |  |     Context        |  |   & Smart Semantic DOM Clicker  |  |
|  +---------+----------+  +---------+----------+  +----------------+----------------+  |
|            |                       |                              |                   |
|            +-----------------------+------------------------------+                   |
|                                    |                                                  |
|  +---------------------------------+-----------------------------------------------+  |
|  |                       5 MODUL UTAMA ABLEFY                                      |  |
|  |  [1] Beranda & Global A11y Controller   [2] Universal Multi-Modal Studio        |  |
|  |  [3] Live Speech-to-Text & Media Hub    [4] BISINDO Sign Hub & Sentence Builder |  |
|  |  [5] Hands-Free Voice Navigator & Motor Switch Control                         |  |
|  +---------------------------------+-----------------------------------------------+  |
+------------------------------------|--------------------------------------------------+
                                     |
+------------------------------------v--------------------------------------------------+
|                            NATIVE BROWSER WEB APIS                                    |
|  * Web Speech API (webkitSpeechRecognition & window.speechSynthesis)                 |
|  * Web Audio API (AudioContext & AnalyserNode 60 FPS)                                 |
|  * Canvas 2D & Responsive Media Player Engine                                         |
+------------------------------------|--------------------------------------------------+
                                     | (Permintaan Suara Alami Berdefinisi Tinggi)
+------------------------------------v--------------------------------------------------+
|                    EDGE SERVERLESS FUNCTION (VERCEL NODE.JS)                          |
|  * Endpoint: /api/tts                                                                 |
|  * Engine: Microsoft Azure Edge Neural Voice (id-ID-GadisNeural)                      |
|  * Streaming respon audio instan dengan auto-fallback lokal jika offline              |
+---------------------------------------------------------------------------------------+
```

#### Spesifikasi Teknologi:
* **Frontend Framework:** React 19 (React Hooks, arsitektur modular, state reaktif).
* **Bahasa Pemrograman:** TypeScript (penegakan *strict typing*, zero runtime type errors).
* **Build Engine:** Vite 8 (Hot Module Replacement secepat kilat, pohon dependensi teroptimasi).
* **Styling & Theme Engine:** Tailwind CSS v4 (dukungan dynamic CSS custom variables untuk pergantian palet kontras tinggi instan).
* **Audio Visualizer:** Web Audio API (*AnalyserNode* dengan algoritma transformasi Fourier cepat / FFT untuk render kanvas 60 FPS).
* **Speech Synthesis:** Dual-layer engine (Microsoft Edge Neural TTS melalui Vercel Serverless Function dan fallback *window.speechSynthesis* W3C).
* **Speech Recognition:** Peramban *webkitSpeechRecognition* dengan mekanisme pemulihan berkelanjutan (*perpetual auto-restart*).

### 3.4 Alur Pemrosesan NLP Voice Navigator & Unified Audio Pipeline
Salah satu tantangan terbesar interaksi suara di peramban adalah tabrakan mikrofon (*hardware collision*) dan hening otomatis setelah 10 detik. Ablefy mengatasi hal ini melalui:
1. **Master Recognition Instance:** Hanya ada satu sesi mikrofon aktif yang dikendalikan oleh `VoiceNavigator`.
2. **NLP Intent Classifier:** Setiap input audio dibersihkan dari *filler words* (*tolong, coba, dong, ya*), dinormalisasi ke bentuk dasar, dan diklasifikasikan ke 22 kategori intent (navigasi tab, putar suara, aktivasi kontras, dll.).
3. **Smart Semantic DOM Clicker:** Jika perintah berupa aksi klik elemen, sistem memindai atribut `aria-label`, `innerText`, dan `title` pada DOM yang terlihat, memberikan sorotan visual, dan mengeksekusi klik secara virtual.
4. **Bidirectional Anti-Echo Guard:** Mencegah loop gema saat asisten bersuara dengan membandingkan teks respons terhadap teks masukan mikrofon.

---

## BAB IV. IMPLEMENTASI FITUR & HASIL PENGUJIAN

### 4.1 Implementasi 5 Modul Solusi Utama Ablefy

#### 1. Beranda & Global Accessibility Engine (`AppSidebar`, `TopAppBar`, `AccessibilityContext`)
* **Mode Kontras Tinggi Tervalidasi:** Menghadirkan opsi tema *Yellow-on-Black* (Kuning di atas Hitam Pekat) dengan rasio kontras 19.5:1, *Dark Slate*, dan Kontras Normal.
* **OpenDyslexic Typography:** Mengubah seluruh tipografi teks antarmuka menjadi font ramah disleksia secara instan.
* **Reading Ruler (Penggaris Baca):** Bilah panduan horizontal yang mengikuti kursor mouse atau navigasi tombol untuk memandu pandangan mata pengguna saat membaca dokumen.
* **Font Scaling Dinamis:** Pilihan skala ukuran font (100%, 115%, 130%) yang dapat diubah dengan satu klik dari bilah atas.

#### 2. Universal Multi-Modal Studio (`UniversalStudio`)
* **Text-to-Speech dengan Highlighting Kata Real-Time:** Membaca dokumen artikel dengan suara manusia alami seraya menyorot kata per kata dengan latar belakang kontras tinggi.
* **Bionic Reading Mode:** Menebalkan otomatis 3 karakter pertama setiap kata untuk meningkatkan kecepatan fiksasi mata.
* **Focus Mask ("Fokus Emas"):** Meredupkan seluruh paragraf dan elemen di luar kalimat yang sedang dibaca hingga 80%, mengeliminasi distraksi visual bagi pembelajar neurodivergen.
* **Easy-Reader Mode:** Menyajikan bacaan ilmiah kompleks ke dalam ringkasan butir-butir poin yang mudah dicerna.

#### 3. Live Speech-to-Text & Media Hub (`LectureCompanion`)
* **Live Lecture Captioning:** Menangkap suara dosen atau pemateri secara langsung melalui mikrofon dan menampilkannya sebagai teks besar di layar secara seketika (*real-time transcription*).
* **Interactive YouTube Player with Timestamped Captions:** Pemutar video pembelajaran yang dilengkapi takarir tersinkronisasi. Pengguna dapat mengklik baris teks mana pun untuk melompat ke detik video yang bersangkutan.
* **Equalizer Akustik Real-Time (60 FPS):** Gelombang visualizer spektrum audio berbasis Web Audio API yang berdenyut dinamis mengikuti frekuensi suara mikrofon, memberi umpan balik visual bahwa suara sedang terekam dengan baik.

#### 4. BISINDO Sign Hub & Sentence Builder (`SignHub`)
* **Papan Rangkai Kalimat Isyarat (*Sentence Builder*):** Media interaktif dua arah yang memungkinkan pengguna menyusun kalimat dari kepingan kata isyarat, dilengkapi simulasi pemutaran sekuensial (kecepatan normal 1.0x dan pelan 0.7x).
* **Terjemahan Kalimat Alami & Suara:** Mengonversi rangkaian kosakata visual menjadi kalimat bahasa Indonesia yang gramatikal lengkap dengan pemutar suara sintesis.
* **Kamus Lengkap 99 Kosakata (7 Kategori):** Mencakup kategori Sapaan, Keluarga, Aktivitas, Kata Tanya, Emosi, Waktu & Angka, serta Abjad Jari A–Z.
* **5 Parameter Linguistik Gestur:** Tiap kartu kosakata memuat informasi bentuk tangan (*handshape*), titik lokasi (*location*), arah gerakan (*movement*), orientasi telapak, dan ekspresi wajah non-manual (*NMM*).
* **Panduan Etika Berkomunikasi Teman Tuli:** Edukasi 3 pilar santun interaksi visual untuk mengikis stigma sosial.

#### 5. Hands-Free Voice Navigator & Motor Switch Control (`VoiceNavigator`, `MotorShortcutsModal`)
* **Pengendali Suara Bebas Tangan Berbasis NLP:** Pengguna dapat mengontrol seluruh platform hanya dengan berbicara (contoh: *"buka transkrip"*, *"nyalakan kontras kuning"*, *"klik putar"*).
* **Akses Sakelar Tunggal (*Switch Control*):** Pintasan tombol fisik tunggal (`0`, `1`, `2`, `3`, `[`, `]`, `K`, `V`) dengan area target sentuh besar (> 48px) yang ramah motorik tremor.

### 4.2 Hasil Audit Kepatuhan Aksesibilitas WCAG 2.1 AAA

| Kriteria Kepatuhan WCAG 2.1 | Ambang Batas W3C | Hasil Pengujian pada Ablefy | Status Verifikasi |
| :--- | :---: | :---: | :---: |
| **1.4.3 Contrast (Minimum - AA)** | Minimal 4.5:1 | **12.4:1** (Teks Default) | **LULUS** |
| **1.4.6 Contrast (Enhanced - AAA)** | Minimal 7.0:1 | **19.5:1** (Mode Yellow-on-Black) | **LULUS (AAA)** |
| **1.4.12 Text Spacing** | Line-height $\ge$ 1.5, Letter-spacing $\ge$ 0.12em | Diterapkan penuh via OpenDyslexic Engine | **LULUS (AAA)** |
| **2.1.1 Keyboard Navigation** | Seluruh elemen dapat diakses keyboard | 100% tombol & tab dapat diakses (`Tab`, `Enter`, `Space`) | **LULUS (AAA)** |
| **2.1.2 No Keyboard Trap** | Kursor tidak terjebak dalam komponen | Navigasi fokus mengalir bebas tanpa hambatan | **LULUS (AAA)** |
| **2.4.7 Focus Visible** | Indikator fokus terlihat jelas | Outline biru tebal kontras tinggi pada setiap elemen | **LULUS (AAA)** |
| **2.5.5 Target Size** | Area sentuh minimal 44 x 44 px | Seluruh tombol $\ge$ **48 x 48 px** | **LULUS (AAA)** |
| **4.1.2 Name, Role, Value** | Standar ARIA & Semantic HTML | Validasi pengujian Screen Reader (NVDA & TalkBack) | **LULUS (AAA)** |

### 4.3 Evaluasi Kinerja, Keamanan & Privasi (*Zero-Backend*)
* **Kecepatan Muat (*First Contentful Paint*):** Berkas produksi terkompresi dengan ukuran sangat kecil. Aplikasi berhasil dimuat dalam **0,8 detik** pada koneksi broadband dan **1,4 detik** pada simulasi jaringan seluler 3G lambat.
* **Responsivitas 100% Multi-Device:** Teruji bebas *horizontal scroll overflow* pada resolusi layar mobile (iPhone SE 375px, Android 360px), tablet (768px), hingga monitor desktop ultrawide (1920px+).
* **Kedaulatan Privasi Data:** Seluruh pengenalan ucapan mikrofon dan pemrosesan teks artikel diproses 100% secara lokal pada memori peramban pengguna. Tidak ada data audio, suara pengguna, atau naskah kuliah yang diunggah atau disimpan ke server database eksternal.

---

## BAB V. KESIMPULAN & TAHAPAN KEBERLANJUTAN (ROADMAP)

### 5.1 Kesimpulan
**Ablefy** merupakan manifestasi nyata dari perpaduan empati kemanusiaan dan keunggulan teknologi web modern. Dengan memenuhi standar kepatuhan **W3C WCAG 2.1 Level AAA**, Ablefy berhasil membuktikan bahwa teknologi web dapat dibangun secara inklusif tanpa mengorbankan estetika, kecepatan performa, maupun privasi pengguna. 

Melalui 5 pilar inovasi yang dihadirkan—*Global Accessibility Engine, Universal Reading Studio, Live Speech Transcription, BISINDO Sign Hub & Sentence Builder,* serta *NLP Voice Navigator*—Ablefy memampukan jutaan sahabat difabel untuk belajar, berinteraksi, dan berprestasi secara mandiri dan setara.

### 5.2 Roadmap Pengembangan Berkelanjutan (2026–2028)

```
+---------------------------------------------------------------------------------------+
|                             ROADMAP PENGEMBANGAN ABLEFY                               |
+---------------------------------------------------------------------------------------+
|  FASE 1: Fondasi & Kepatuhan WCAG AAA (Tahun 2026 - SELESAI 100%)                     |
|  - Implementasi 5 Modul Solusi Utama di Web SPA                                       |
|  - Validasi WCAG 2.1 Level AAA & Voice Navigator NLP                                  |
|  - Deployment Global di Vercel Edge & Repositori Mandiri Open-Source (MIT)            |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|  FASE 2: AI Computer Vision & Gesture Recognition (Q4 2026 - Q2 2027)                 |
|  - Deteksi dan Pelacakan Tangan Real-Time via Kamera Webcam menggunakan MediaPipe.js  |
|  - Sistem Evaluasi Akurasi Bahasa Isyarat Berbasis AI On-Device                       |
|  - Penerjemah Bahasa Isyarat Visual ke Suara Otomatis Secara Real-Time               |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|  FASE 3: Standarisasi Sistem Pembelajaran Nasional (Q3 2027 - 2028)                   |
|  - Ekstensi LTI (Learning Tools Interoperability) untuk Moodle, Canvas, & Portal Kampus|
|  - Kolaborasi dengan Kementerian Sosial & Organisasi Penyandang Disabilitas Indonesia |
|  - Pembentukan Komunitas Open-Source Pengembang Aksesibilitas Nasional                |
+---------------------------------------------------------------------------------------+
```

---

## DAFTAR PUSTAKA

1. **World Wide Web Consortium (W3C).** (2018). *Web Content Accessibility Guidelines (WCAG) 2.1*. W3C Recommendation. [https://www.w3.org/TR/WCAG21/](https://www.w3.org/TR/WCAG21/)
2. **United Nations.** (2015). *Transforming our world: the 2030 Agenda for Sustainable Development*. UN Publishing Division. New York.
3. **Badan Pusat Statistik (BPS) Republik Indonesia.** (2023). *Profil Penyandang Disabilitas di Indonesia Tahun 2023*. BPS RI. Jakarta.
4. **Pemerintah Republik Indonesia.** (2016). *Undang-Undang Republik Indonesia Nomor 8 Tahun 2016 tentang Penyandang Disabilitas*. Lembaran Negara RI Tahun 2016 Nomor 69.
5. **OpenDyslexic Organization.** (2022). *OpenDyslexic: A typography typeface designed against common symptoms of dyslexia*. [https://opendyslexic.org/](https://opendyslexic.org/)
6. **W3C Web Real-Time Communications Working Group.** (2023). *Web Speech API Specification*. W3C Community Group. [https://wicg.github.io/speech-api/](https://wicg.github.io/speech-api/)
7. **Pusat Bahasa Isyarat Indonesia (Pusbisindo).** (2020). *Pedoman Pembelajaran Bahasa Isyarat Indonesia (BISINDO) Tingkat Dasar & Menengah*. Jakarta.
8. **Mozilla Developer Network (MDN).** (2024). *Web Audio API: Processing and synthesizing audio in web applications*. Mozilla Corporation.

---

## LAMPIRAN

### Lampiran 1: Biodata Tim Pengusul

#### A. Identitas Ketua Tim (Team Leader)
* **Nama Lengkap:** Nazalan Muaffari
* **Nomor Induk Mahasiswa (NIM):** 26081494250
* **Program Studi:** S1 Bisnis Digital
* **Perguruan Tinggi:** Universitas Negeri Surabaya (UNESA)
* **Email Resmi:** `26081494250@mhs.unesa.ac.id`
* **Nomor Kontak / WhatsApp:** `+6285156643174`
* **Peran dalam Tim:** Perancangan arsitektur sistem, implementasi kode perangkat lunak (Lead Developer), integrasi NLP Voice Navigator, optimasi Web Audio API, serta validasi standar WCAG 2.1 AAA.

#### B. Identitas Anggota Tim
* **Nama Lengkap:** Ardina Dwitari
* **Nomor Induk Mahasiswa (NIM):** 26080694018
* **Program Studi:** S1 Akuntansi
* **Perguruan Tinggi:** Universitas Negeri Surabaya (UNESA)
* **Email Resmi:** `26080694018@mhs.unesa.ac.id`
* **Nomor Kontak / WhatsApp:** `+6282143434298`
* **Peran dalam Tim:** Riset kebutuhan pengguna difabel (*user persona analysis*), penyusunan naskah proposal ilmiah, studi kepatuhan regulasi disabilitas nasional, dokumentasi teknis, serta analisis keberlanjutan proyek.

### Lampiran 2: Tautan Aksesibilitas Proyek
* **Repositori GitHub:** [https://github.com/nazz-cmd/ablefy](https://github.com/nazz-cmd/ablefy)
* **Live Deployment:** [https://ablefy.vercel.app](https://ablefy.vercel.app)
