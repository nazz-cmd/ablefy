export interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  fullText: string;
  simplifiedPoints: string[];
}

export const SAMPLE_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Transformasi Pembelajaran Inklusif & Literasi Digital Terbuka',
    category: 'Edukasi & Inklusi',
    summary: 'Membangun ekosistem belajar yang ramah disabilitas melalui teknologi asistif, materi adaptif, dan literasi digital terbuka.',
    fullText: `Pendidikan dan literasi bermutu merupakan hak fundamental bagi seluruh warga negara Indonesia tanpa memandang latar belakang kondisi fisik, sensorik, maupun kognitif. Dalam era kemajuan teknologi saat ini, kesadaran berbagai institusi pendidikan, sekolah inklusi, balai pelatihan, maupun komunitas masyarakat terhadap pentingnya penyediaan fasilitas ramah disabilitas meningkat secara signifikan.

Teknologi asistif memainkan peranan yang sangat sentral dalam meruntuhkan batasan belajar konvensional. Pembelajar dengan tantangan penglihatan dapat mengakses jutaan buku dan modul pengetahuan melalui pembaca layar digital dan format audio terstruktur. Di sisi lain, rekan-rekan teman Tuli mendapatkan kemudahan menyerap penjelasan materi melalui sistem transkripsi wicara-ke-teks otomatis serta visualisasi bahasa isyarat.

Keberhasilan integrasi pembelajaran inklusif tidak hanya diukur dari tersedianya fasilitas fisik seperti rampa tangga atau pemandu jalan, melainkan juga keterbukaan ekosistem informasi digital. Ketika platform pembelajaran digital dirancang dengan standar aksesibilitas universal, setiap individu diberikan kesempatan yang setara untuk bereksplorasi, berkarya, dan menggapai potensi terbaik mereka.`,
    simplifiedPoints: [
      'Pendidikan dan ilmu pengetahuan adalah hak semua orang tanpa terkecuali.',
      'Teknologi digital membantu pembelajar disabilitas membaca, mendengar, dan menyerap aneka materi.',
      'Lingkungan belajar inklusif membutuhkan akses digital yang mudah, bukan hanya fasilitas fisik.',
      'Dengan akses materi yang setara, semua orang dapat belajar dan berprestasi optimal.'
    ]
  },
  {
    id: 'art-2',
    title: 'Mengenal Kekuatan Visual Bahasa Isyarat Indonesia (BISINDO)',
    category: 'Budaya & Bahasa',
    summary: 'Bagaimana BISINDO menjadi identitas kultural dan media komunikasi yang kaya rasa bagi komunitas Tuli.',
    fullText: `Bahasa Isyarat Indonesia atau BISINDO adalah bahasa alami yang tumbuh secara organik di dalam kebudayaan masyarakat Tuli Indonesia. Berbeda dari sekadar gestur tangan sederhana, BISINDO memiliki tata bahasa, sintaksis, dan kaidah linguistik yang utuh dan kompleks.

Dalam berkomunikasi menggunakan BISINDO, pesan tidak hanya disampaikan melalui konfigurasi jari dan gerakan tangan, melainkan juga didukung oleh ekspresi wajah atau non-manual markers. Gerakan alis, kedipan mata, hingga bentuk mulut memberikan intonasi dan kedalaman emosional pada setiap kata yang diisyaratkan.

Mempelajari bahasa isyarat bukan semata tentang membantu penyandang disabilitas pendengaran, melainkan memperluas wawasan kemanusiaan kita dalam memandang keberagaman cara manusia mengekspresikan pikiran dan perasaan. Melalui media pembelajaran digital yang interaktif, jembatan komunikasi antara teman dengar dan teman Tuli dapat terbangun semakin erat.`,
    simplifiedPoints: [
      'BISINDO adalah bahasa resmi alami komunitas Tuli di Indonesia.',
      'Komunikasi isyarat melibatkan gerakan tangan dan ekspresi wajah yang kaya arti.',
      'Ekspresi wajah berfungsi seperti intonasi suara dalam bahasa lisan.',
      'Belajar bahasa isyarat membangun empati dan mempererat silaturahmi antar-sesama.'
    ]
  },
  {
    id: 'art-3',
    title: 'Strategi Belajar Efektif bagi Pembelajar dengan Disleksia',
    category: 'Kognitif & Neurodivergent',
    summary: 'Mengubah tantangan membaca menjadi kekuatan kreativitas melalui penyesuaian visual dan tipografi.',
    fullText: `Disleksia merupakan salah satu variasi pemrosesan neurologis yang memengaruhi cara otak menginterpretasikan simbol tulisan, kata, dan fonem. Disleksia sama sekali tidak berkaitan dengan tingkat kecerdasan seseorang; sebaliknya, banyak individu disleksia memiliki kemampuan penalaran spasial, pemikiran holistik, dan kreativitas yang luar biasa tinggi.

Tantangan utama yang dihadapi pembaca dengan disleksia adalah fenomena huruf yang tampak berputar, bergeser, atau bertumpuk saat membaca paragraf panjang yang padat. Desain antarmuka web modern kini menawarkan solusi nyata melalui penggunaan tipografi berbobot asimetris pada bagian bawah huruf seperti font OpenDyslexic, peningkatan jarak antar-baris, serta latar belakang warna yang lembut untuk mengurangi kelelahan visual.

Fitur pemandu baca seperti garis fokus horizontal dan konversi teks menjadi audio memungkinkan pembelajar disleksia menavigasi informasi tanpa rasa cemas, mengubah proses membaca menjadi pengalaman yang memberdayakan dan menyenangkan.`,
    simplifiedPoints: [
      'Disleksia adalah perbedaan cara kerja otak dalam membaca, bukan tanda kurang cerdas.',
      'Banyak orang dengan disleksia memiliki daya imajinasi dan kreativitas di atas rata-rata.',
      'Font khusus dan jarak baris yang lapang membantu huruf tetap stabil di mata.',
      'Kombinasi suara (audio) dan teks membuat belajar menjadi jauh lebih mudah.'
    ]
  }
];
