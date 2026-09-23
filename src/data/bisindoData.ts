export interface SignItem {
  id: string;
  word: string;
  category: 'sapaan' | 'keluarga' | 'aktivitas' | 'tanya' | 'emosi' | 'waktu' | 'abjad';
  description: string;
  handshape?: string;
  location?: string;
  movement?: string;
  facialExpression?: string;
  gestureInstructions: string[];
  exampleSentence: string;
  visualCue: string;
}

export const BISINDO_DATA: SignItem[] = [
  // ========================================================
  // 1. SAPAAN & PERKENALAN (15 KATA)
  // ========================================================
  {
    id: 's-1',
    word: 'Halo / Hai',
    category: 'sapaan',
    description: 'Bentuk tangan terbuka di dekat pelipis kepala, diayunkan sedikit ke depan dan keluar seperti lambaian santun.',
    handshape: 'Telapak tangan terbuka dengan jari-jari lurus rapat.',
    location: 'Samping kening / pelipis kanan.',
    movement: 'Ayunkan perlahan ke luar ke arah lawan bicara.',
    facialExpression: 'Tersenyum ramah dan kontak mata langsung.',
    gestureInstructions: [
      'Buka telapak tangan kanan menghadap ke depan lawan bicara.',
      'Posisikan di samping kening atau pelipis.',
      'Ayunkan tangan secara perlahan ke arah luar sambil tersenyum hangat.'
    ],
    exampleSentence: 'Halo, senang sekali bisa berkenalan dan mengobrol hari ini!',
    visualCue: '👋'
  },
  {
    id: 's-2',
    word: 'Selamat Pagi',
    category: 'sapaan',
    description: 'Kombinasi isyarat Selamat (tangan menyapu dada ke atas) diikuti isyarat Pagi (tangan muncul seperti matahari terbit).',
    handshape: 'Telapak tangan kanan terbuka mengusap lalu merekah ke atas.',
    location: 'Dari dada naik setinggi bahu.',
    movement: 'Usap dada ke atas lalu buka tangan ke atas.',
    facialExpression: 'Penuh energi, ceria, dan optimis.',
    gestureInstructions: [
      'Usap tangan kanan ke atas dada (Selamat).',
      'Tangan kanan muncul perlahan dari bawah lengan kiri ke atas (Pagi).'
    ],
    exampleSentence: 'Selamat pagi kawan, semoga hari ini menyenangkan!',
    visualCue: '🌅'
  },
  {
    id: 's-3',
    word: 'Selamat Siang',
    category: 'sapaan',
    description: 'Isyarat Selamat diikuti tangan kanan tegak lurus di atas kepala menggambarkan matahari tepat di atas.',
    handshape: 'Tangan kanan terbuka tegak lurus.',
    location: 'Di atas kepala / tengah dahi.',
    movement: 'Tegakkan tangan lurus ke atas kepala.',
    facialExpression: 'Tersenyum cerah dan ramah.',
    gestureInstructions: [
      'Lakukan isyarat Selamat (usap dada ke atas).',
      'Posisikan lengan kanan tegak lurus mengarah ke atas kepala.'
    ],
    exampleSentence: 'Selamat siang semuanya, mari kita istirahat sejenak.',
    visualCue: '☀️'
  },
  {
    id: 's-4',
    word: 'Selamat Sore',
    category: 'sapaan',
    description: 'Isyarat Selamat diikuti tangan kanan yang mulai condong turun ke samping kanan melambangkan matahari sore.',
    handshape: 'Tangan kanan terbuka sedikit miring.',
    location: 'Samping kanan setinggi bahu.',
    movement: 'Turunkan tangan perlahan ke arah samping.',
    facialExpression: 'Hangat dan santai.',
    gestureInstructions: [
      'Lakukan isyarat Selamat.',
      'Arahkan tangan kanan miring condong turun ke kanan perlahan.'
    ],
    exampleSentence: 'Selamat sore, udara hari ini sangat sejuk.',
    visualCue: '🌇'
  },
  {
    id: 's-5',
    word: 'Selamat Malam',
    category: 'sapaan',
    description: 'Isyarat Selamat diikuti kedua telapak tangan saling menutup ke bawah melambangkan malam dan gelap yang tiba.',
    handshape: 'Kedua telapak tangan datar melengkung.',
    location: 'Depan dada.',
    movement: 'Kedua tangan bergerak saling menutup turun ke bawah.',
    facialExpression: 'Tenang, teduh, dan ramah.',
    gestureInstructions: [
      'Lakukan isyarat Selamat.',
      'Tutup kedua tangan perlahan ke bawah menandakan malam hari.'
    ],
    exampleSentence: 'Selamat malam, selamat beristirahat dan sampai jumpa besok.',
    visualCue: '🌙'
  },
  {
    id: 's-6',
    word: 'Terima Kasih',
    category: 'sapaan',
    description: 'Ujung jari tangan kanan menyentuh dagu atau bibir bawah, lalu digerakkan maju santun ke arah lawan bicara.',
    handshape: 'Jari-jari tangan kanan rapat mendatar.',
    location: 'Dagu atau bibir bawah.',
    movement: 'Gerakkan maju ke arah lawan bicara dengan ritme teratur.',
    facialExpression: 'Mengangguk pelan dengan ekspresi tulus dan bersyukur.',
    gestureInstructions: [
      'Rapatkan jari-jari tangan kanan secara mendatar.',
      'Sentuhkan ujung jari ke dagu atau bibir bawah.',
      'Gerakkan tangan maju ke depan secara santun ke arah lawan bicara.'
    ],
    exampleSentence: 'Terima kasih banyak atas kebaikan dan bantuannya.',
    visualCue: '🙏'
  },
  {
    id: 's-7',
    word: 'Sama-sama',
    category: 'sapaan',
    description: 'Kedua telapak tangan terbuka menghadap ke atas setinggi dada, lalu diayunkan sedikit melingkar atau maju bersamaan.',
    handshape: 'Kedua telapak tangan terbuka rileks menghadap ke atas.',
    location: 'Depan dada.',
    movement: 'Ayunkan lembut ke depan menyambut rasa terima kasih.',
    facialExpression: 'Senyum ramah menyambut kawan.',
    gestureInstructions: [
      'Buka kedua telapak tangan menghadap ke atas setinggi dada.',
      'Ayunkan sedikit ke depan secara bersamaan tanda menyambut hangat.'
    ],
    exampleSentence: 'Sama-sama, senang sekali bisa saling membantu.',
    visualCue: '🤲'
  },
  {
    id: 's-8',
    word: 'Maaf',
    category: 'sapaan',
    description: 'Tangan kanan mengepal lalu digosokkan membentuk lingkaran kecil di atas dada kiri (area hati).',
    handshape: 'Kepalan tangan kanan (huruf A).',
    location: 'Dada sebelah kiri.',
    movement: 'Gosokkan melingkar 2–3 kali searah jarum jam.',
    facialExpression: 'Ekspresi wajah tulus memohon permakluman dan menyesal.',
    gestureInstructions: [
      'Bentuk kepalan tangan kanan.',
      'Tempelkan pada dada sebelah kiri.',
      'Putar melingkar secara lembut menandakan ketulusan hati.'
    ],
    exampleSentence: 'Maaf, saya tidak sengaja membuat Anda menunggu.',
    visualCue: '🙇‍♂️'
  },
  {
    id: 's-9',
    word: 'Tolong / Mohon',
    category: 'sapaan',
    description: 'Kedua telapak tangan ditangkupkan di depan dada lalu diayunkan sedikit maju-mundur santun.',
    handshape: 'Kedua telapak tangan rapat menangkup.',
    location: 'Depan dada.',
    movement: 'Ayunkan perlahan turun-naik santun.',
    facialExpression: 'Wajah santun dan bersahabat.',
    gestureInstructions: [
      'Tangkupkan kedua telapak tangan di depan dada seperti memohon.',
      'Ayunkan perlahan ke depan dengan sikap santun.'
    ],
    exampleSentence: 'Tolong bantu saya membawakan barang ini.',
    visualCue: '🤝'
  },
  {
    id: 's-10',
    word: 'Permisi',
    category: 'sapaan',
    description: 'Ujung jari tangan kanan mengusap lembut telapak tangan kiri dari pangkal ke ujung jari mengisyaratkan izin lewat.',
    handshape: 'Jari tangan kanan menyapu telapak tangan kiri terbuka.',
    location: 'Depan dada.',
    movement: 'Usap maju dari pangkal telapak ke ujung jari.',
    facialExpression: 'Sedikit membungkuk santun dan tersenyum ramah.',
    gestureInstructions: [
      'Buka telapak tangan kiri datar di depan dada.',
      'Usap jari tangan kanan ke arah depan di atas telapak kiri.'
    ],
    exampleSentence: 'Permisi, bolehkah saya lewat di depan Anda?',
    visualCue: '🚶‍♂️'
  },
  {
    id: 's-11',
    word: 'Sampai Jumpa',
    category: 'sapaan',
    description: 'Kedua jari telunjuk saling mendekat di depan dada lalu tangan kanan melambai perpisahan.',
    handshape: 'Jari telunjuk kedua tangan lalu telapak melambai.',
    location: 'Depan dada setinggi bahu.',
    movement: 'Dua telunjuk bertemu (bertemu lagi) lalu melambai ke kanan.',
    facialExpression: 'Tersenyum ramah penuh kehangatan.',
    gestureInstructions: [
      'Dekatkan kedua telunjuk di depan dada.',
      'Lambaikan telapak tangan kanan dengan santai.'
    ],
    exampleSentence: 'Sampai jumpa kawan, hati-hati di perjalanan pulang!',
    visualCue: '🙋'
  },
  {
    id: 's-12',
    word: 'Apa Kabar?',
    category: 'sapaan',
    description: 'Kombinasi isyarat Apa (kedua tangan goyang terbuka) diikuti isyarat Kabar/Kondisi dengan senyuman hangat.',
    handshape: 'Kedua tangan terbuka menghadap atas.',
    location: 'Depan dada.',
    movement: 'Goyangkan telapak tangan sedikit dengan ekspresi menanyakan keadaan.',
    facialExpression: 'Alis terangkat santun dan mata memandang peduli.',
    gestureInstructions: [
      'Buka kedua telapak tangan menghadap atas di depan dada.',
      'Goyangkan lembut sambil tersenyum menanyakan kabar.'
    ],
    exampleSentence: 'Halo sahabatku, apa kabar hari ini?',
    visualCue: '💬'
  },
  {
    id: 's-13',
    word: 'Baik / Sehat',
    category: 'sapaan',
    description: 'Kedua tangan terbuka menyentuh pundak/dada lalu ditarik ke depan mengepal kuat menandakan tubuh bugar.',
    handshape: 'Tangan terbuka lalu mengepal kuat ke depan.',
    location: 'Dari dada ke depan.',
    movement: 'Tarik dari dada maju ke depan membentuk kepalan mantap.',
    facialExpression: 'Wajah cerah, senyum bugar dan segar.',
    gestureInstructions: [
      'Tempelkan ujung jari kedua tangan di dada.',
      'Tarik tangan maju ke depan sambil mengepal mantap.'
    ],
    exampleSentence: 'Kabar saya sangat baik dan sehat walafiat.',
    visualCue: '😊'
  },
  {
    id: 's-14',
    word: 'Nama Saya',
    category: 'sapaan',
    description: 'Jari telunjuk dan jari tengah tangan kanan ditempelkan mendatar di dada seperti papan nama diri.',
    handshape: 'Dua jari (telunjuk dan tengah) rapat mendatar (huruf H).',
    location: 'Dada bagian atas.',
    movement: 'Ketukkan ujung dua jari ke dada dua kali.',
    facialExpression: 'Tersenyum percaya diri dan bersahabat.',
    gestureInstructions: [
      'Rapatkan telunjuk dan jari tengah mendatar.',
      'Ketukkan ujung dua jari tersebut ke dada dua kali.',
      'Lalu eja nama Anda menggunakan abjad jari.'
    ],
    exampleSentence: 'Halo kawan baru, nama saya adalah Rizki.',
    visualCue: '🏷️'
  },
  {
    id: 's-15',
    word: 'Senang Bertemu',
    category: 'sapaan',
    description: 'Isyarat Senang (usap dada ke atas) diikuti kedua telunjuk saling mendekat bertemu muka.',
    handshape: 'Telapak tangan mengusap dada lalu dua telunjuk bertemu.',
    location: 'Dari dada ke depan bahu.',
    movement: 'Usap dada riang lalu pertemukan dua telunjuk tangan.',
    facialExpression: 'Tersenyum lebar dengan mata berbinar bahagia.',
    gestureInstructions: [
      'Usap dada ke atas dengan telapak tangan (Senang).',
      'Pertemukan jari telunjuk kanan dan kiri saling berhadapan (Bertemu).'
    ],
    exampleSentence: 'Saya sangat senang bertemu dengan Anda hari ini.',
    visualCue: '🤝'
  },

  // ========================================================
  // 2. KELUARGA & RELASI SOSIAL (12 KATA)
  // ========================================================
  {
    id: 'k-1',
    word: 'Saya / Aku',
    category: 'keluarga',
    description: 'Jari telunjuk tangan kanan menunjuk secara lembut ke tengah dada sendiri.',
    handshape: 'Jari telunjuk menunjuk dada.',
    location: 'Tengah dada.',
    movement: 'Arahkan telunjuk menyentuh dada sendiri sekali.',
    facialExpression: 'Tenang dan wajar.',
    gestureInstructions: [
      'Arahkan jari telunjuk tangan kanan ke tengah dada Anda.',
      'Sentuh perlahan tanpa ragu.'
    ],
    exampleSentence: 'Saya siap membantu kapan saja dibutuhkan.',
    visualCue: '👤'
  },
  {
    id: 'k-2',
    word: 'Kamu / Anda',
    category: 'keluarga',
    description: 'Jari telunjuk tangan kanan menunjuk santun ke arah lawan bicara.',
    handshape: 'Jari telunjuk lurus ke depan.',
    location: 'Depan dada mengarah ke depan.',
    movement: 'Arahkan telunjuk ke arah lawan bicara dengan sopan.',
    facialExpression: 'Kontak mata ramah dan bersahabat.',
    gestureInstructions: [
      'Tunjukkan jari telunjuk ke arah orang yang diajak bicara.',
      'Jaga tinggi tangan setinggi dada.'
    ],
    exampleSentence: 'Apakah kamu sudah sarapan pagi ini?',
    visualCue: '👉'
  },
  {
    id: 'k-3',
    word: 'Kita / Kami',
    category: 'keluarga',
    description: 'Jari telunjuk kanan menunjuk bahu kanan lalu melengkung ke depan dan menunjuk bahu kiri merangkul kebersamaan.',
    handshape: 'Jari telunjuk melingkar horizontal.',
    location: 'Dari bahu kanan melingkari depan dada ke bahu kiri.',
    movement: 'Buat lingkaran setengah kurva di depan dada.',
    facialExpression: 'Senyum hangat melambangkan persatuan.',
    gestureInstructions: [
      'Sentuhkan telunjuk ke dada kanan.',
      'Putar melingkar di depan dada hingga menyentuh dada kiri.'
    ],
    exampleSentence: 'Kita semua adalah satu keluarga besar yang saling peduli.',
    visualCue: '👥'
  },
  {
    id: 'k-4',
    word: 'Teman / Sahabat',
    category: 'keluarga',
    description: 'Kedua jari telunjuk saling mengait satu sama lain secara bergantian melambangkan ikatan persahabatan erat.',
    handshape: 'Kedua telunjuk melengkung seperti kait.',
    location: 'Depan dada.',
    movement: 'Kaitkan telunjuk kanan di atas kiri, lalu balik kaitkan.',
    facialExpression: 'Senyum akrab dan hangat.',
    gestureInstructions: [
      'Lengkungkan kedua jari telunjuk.',
      'Kaitkan kedua jari tersebut bersama di depan dada.'
    ],
    exampleSentence: 'Dia adalah sahabat baik saya sejak kecil.',
    visualCue: '🧑‍🤝‍🧑'
  },
  {
    id: 'k-5',
    word: 'Keluarga',
    category: 'keluarga',
    description: 'Kedua tangan membentuk huruf F atau lingkaran kecil, dimulai dari saling menempel lalu melingkar bertemu kembali di depan dada.',
    handshape: 'Kedua tangan melingkar (ibu jari dan telunjuk menyatu).',
    location: 'Depan dada.',
    movement: 'Gerakkan kedua tangan melingkar ke luar lalu menyatu kembali di depan.',
    facialExpression: 'Penuh kehangatan dan rasa cinta.',
    gestureInstructions: [
      'Satukan ujung jempol dan telunjuk kedua tangan membentuk lingkaran.',
      'Putar kedua tangan melingkar ke luar lalu pertemukan kembali jari kelingking.'
    ],
    exampleSentence: 'Keluarga selalu menjadi tempat kita pulang dan berbagi cerita.',
    visualCue: '👨‍👩‍👧‍👦'
  },
  {
    id: 'k-6',
    word: 'Ayah / Bapak',
    category: 'keluarga',
    description: 'Ibu jari tangan kanan terbuka menyentuh kening atau dahi samping (melambangkan topi/garis kehormatan kepala keluarga).',
    handshape: 'Telapak tangan terbuka dengan jempol menempel di dahi.',
    location: 'Kening / dahi sebelah kanan.',
    movement: 'Ketukkan jempol lembut di dahi 2 kali.',
    facialExpression: 'Hormat, bangga, dan hangat.',
    gestureInstructions: [
      'Buka telapak tangan kanan dengan jari tegak.',
      'Tempelkan ujung ibu jari di kening bagian atas.',
      'Ketukkan pelan dua kali.'
    ],
    exampleSentence: 'Ayah sedang membaca kabar harian di teras rumah.',
    visualCue: '👨'
  },
  {
    id: 'k-7',
    word: 'Ibu / Mama',
    category: 'keluarga',
    description: 'Ibu jari tangan kanan terbuka menyentuh dagu atau pipi bagian bawah dengan kelembutan kasih sayang.',
    handshape: 'Telapak tangan terbuka dengan jempol menyentuh dagu.',
    location: 'Dagu / pipi bawah kanan.',
    movement: 'Ketukkan jempol lembut di dagu 2 kali.',
    facialExpression: 'Penuh kelembutan, kasih sayang, dan senyum manis.',
    gestureInstructions: [
      'Buka telapak tangan kanan dengan jari tegak.',
      'Tempelkan ujung ibu jari di dagu atau pipi bawah.',
      'Ketukkan pelan dua kali.'
    ],
    exampleSentence: 'Ibu memasak makanan lezat untuk makan siang bersama.',
    visualCue: '👩'
  },
  {
    id: 'k-8',
    word: 'Kakak',
    category: 'keluarga',
    description: 'Isyarat saudara diikuti telapak tangan kanan mendatar naik ke atas mengisyaratkan usia yang lebih tinggi.',
    handshape: 'Telapak tangan datar menghadap bawah.',
    location: 'Depan dada naik ke atas kening.',
    movement: 'Gerakkan telapak tangan mendatar naik ke atas secara mantap.',
    facialExpression: 'Rasa hormat dan bersahabat.',
    gestureInstructions: [
      'Posisikan telapak tangan kanan mendatar di depan dada.',
      'Angkat ke atas setinggi bahu atau kepala.'
    ],
    exampleSentence: 'Kakak membantu saya merapikan meja belajar.',
    visualCue: '🧑'
  },
  {
    id: 'k-9',
    word: 'Adik',
    category: 'keluarga',
    description: 'Isyarat saudara diikuti telapak tangan kanan mendatar turun ke bawah mengisyaratkan usia yang lebih muda.',
    handshape: 'Telapak tangan datar menghadap bawah.',
    location: 'Depan dada turun ke bawah pinggang.',
    movement: 'Gerakkan telapak tangan mendatar turun ke bawah perlahan.',
    facialExpression: 'Penuh rasa sayang dan mengayomi.',
    gestureInstructions: [
      'Posisikan telapak tangan kanan mendatar di depan dada.',
      'Turunkan ke bawah ke arah pinggang.'
    ],
    exampleSentence: 'Adik sangat senang bermain tebak gambar di ruang keluarga.',
    visualCue: '👶'
  },
  {
    id: 'k-10',
    word: 'Orang / Manusia',
    category: 'keluarga',
    description: 'Kedua telapak tangan datar menghadap tubuh lalu diturunkan sejajar di sisi tubuh menggambarkan sosok tubuh manusia.',
    handshape: 'Kedua telapak tangan datar menghadap ke dalam.',
    location: 'Sisi kanan dan kiri dada turun ke pinggang.',
    movement: 'Turunkan kedua tangan tegak sejajar.',
    facialExpression: 'Netral dan informatif.',
    gestureInstructions: [
      'Buka kedua telapak tangan sejajar di samping dada.',
      'Turunkan lurus ke bawah secara bersamaan.'
    ],
    exampleSentence: 'Setiap orang memiliki keunikan dan potensi yang luar biasa.',
    visualCue: '🧍'
  },
  {
    id: 'k-11',
    word: 'Komunitas Tuli',
    category: 'keluarga',
    description: 'Jari telunjuk menyentuh telinga lalu ke bibir (Tuli) diikuti gestur merangkul kelompok/komunitas.',
    handshape: 'Jari telunjuk menyentuh telinga lalu bibir.',
    location: 'Telinga ke mulut lalu kedua tangan melingkar.',
    movement: 'Sentuh telinga lalu bibir secara berurutan dan buat lingkaran kebersamaan.',
    facialExpression: 'Bangga, percaya diri, dan tersenyum inklusif.',
    gestureInstructions: [
      'Sentuhkan telunjuk ke telinga kanan lalu ke bibir (Tuli).',
      'Buat lingkaran kedua tangan menyatu melambangkan komunitas yang erat.'
    ],
    exampleSentence: 'Komunitas Tuli aktif membagikan pembelajaran bahasa isyarat alami.',
    visualCue: '🤟'
  },
  {
    id: 'k-12',
    word: 'Teman Dengar',
    category: 'keluarga',
    description: 'Jari telunjuk menyentuh telinga (Dengar) diikuti isyarat Teman (kedua telunjuk mengait erat).',
    handshape: 'Jari telunjuk menyentuh telinga lalu kait persahabatan.',
    location: 'Telinga kanan lalu depan dada.',
    movement: 'Sentuh telinga lalu kaitkan kedua telunjuk tangan di depan dada.',
    facialExpression: 'Ramah dan terbuka menjalin persahabatan.',
    gestureInstructions: [
      'Sentuhkan jari telunjuk ke telinga kanan (isyarat mendengar).',
      'Kaitkan kedua jari telunjuk di depan dada (isyarat teman).'
    ],
    exampleSentence: 'Teman Dengar dan Teman Tuli saling berkomunikasi dengan akrab.',
    visualCue: '👂'
  },

  // ========================================================
  // 3. AKTIVITAS SEHARI-HARI & KERJA (18 KATA)
  // ========================================================
  {
    id: 'a-1',
    word: 'Belajar',
    category: 'aktivitas',
    description: 'Telapak tangan kiri mendatar sebagai buku, ujung jari tangan kanan seolah mengambil ilmu lalu diletakkan ke dahi.',
    handshape: 'Telapak kiri datar (buku), jari tangan kanan menguncup.',
    location: 'Dari telapak tangan kiri ke dahi.',
    movement: 'Ambil ilmu 2 kali secara mantap dari telapak kiri ke kening.',
    facialExpression: 'Fokus, antusias, dan tekun.',
    gestureInstructions: [
      'Buka telapak tangan kiri datar di depan dada.',
      'Gunakan jari tangan kanan menyentuh telapak kiri lalu angkat ke dahi.',
      'Lakukan gerakan 2 kali secara teratur.'
    ],
    exampleSentence: 'Mari kita belajar hal baru setiap hari dengan gembira.',
    visualCue: '📖'
  },
  {
    id: 'a-2',
    word: 'Bekerja',
    category: 'aktivitas',
    description: 'Kedua tangan mengepal lalu pergelangan tangan kanan mengetuk bagian atas pergelangan tangan kiri berulang.',
    handshape: 'Kedua tangan mengepal (huruf S).',
    location: 'Depan dada.',
    movement: 'Ketukkan pergelangan tangan kanan ke pergelangan kiri 2 kali.',
    facialExpression: 'Fokus, produktif, dan bersemangat.',
    gestureInstructions: [
      'Kepalkan kedua tangan di depan dada.',
      'Ketukkan pergelangan tangan kanan di atas pergelangan tangan kiri secara mantap.'
    ],
    exampleSentence: 'Kami bekerja sama menyelesaikan proyek ini tepat waktu.',
    visualCue: '💼'
  },
  {
    id: 'a-3',
    word: 'Membaca',
    category: 'aktivitas',
    description: 'Telapak tangan kiri datar sebagai halaman bacaan, dua jari telunjuk dan tengah kanan bergerak memindai baris teks.',
    handshape: 'Tangan kiri datar, tangan kanan bentuk huruf V (dua mata memindai).',
    location: 'Di atas telapak tangan kiri.',
    movement: 'Ayunkan dua jari menyapu turun di atas telapak tangan kiri.',
    facialExpression: 'Mata menatap telapak tangan dengan saksama.',
    gestureInstructions: [
      'Buka telapak tangan kiri datar di depan dada.',
      'Arahkan telunjuk dan jari tengah kanan menatap ke telapak kiri.',
      'Gerakkan turun dari atas ke bawah seolah memindai baris bacaan.'
    ],
    exampleSentence: 'Membaca buku membuka jendela pengetahuan dunia.',
    visualCue: '👓'
  },
  {
    id: 'a-4',
    word: 'Menulis',
    category: 'aktivitas',
    description: 'Jari tangan kanan seolah memegang pena lalu menggoreskan tulisan di atas telapak tangan kiri yang terbuka.',
    handshape: 'Tangan kanan memegang pena imajiner, tangan kiri datar.',
    location: 'Di atas telapak tangan kiri.',
    movement: 'Goreskan ujung jari tangan kanan menyamping di atas telapak kiri.',
    facialExpression: 'Fokus dan teliti.',
    gestureInstructions: [
      'Buka telapak tangan kiri menghadap ke atas.',
      'Posisikan jempol dan telunjuk kanan seperti memegang pena.',
      'Gerakkan seolah menulis di atas telapak kiri.'
    ],
    exampleSentence: 'Tolong tuliskan alamat rumah Anda di lembar formulir.',
    visualCue: '✍️'
  },
  {
    id: 'a-5',
    word: 'Makan',
    category: 'aktivitas',
    description: 'Ujung jari-jari tangan kanan menguncup di depan mulut lalu digerakkan mendekati mulut berulang.',
    handshape: 'Jari-jari tangan kanan menguncup menyatu.',
    location: 'Depan mulut.',
    movement: 'Gerakkan ujung jari mendekati mulut 2 kali.',
    facialExpression: 'Menyenangkan dan wajar.',
    gestureInstructions: [
      'Satukan ujung jari tangan kanan menguncup.',
      'Arahkan ke depan mulut seperti menyuap makanan dua kali.'
    ],
    exampleSentence: 'Ayo kita makan siang bersama di meja makan.',
    visualCue: '🍽️'
  },
  {
    id: 'a-6',
    word: 'Minum',
    category: 'aktivitas',
    description: 'Tangan kanan membentuk huruf C seperti memegang gelas lalu diangkat ke arah mulut sambil mendongak sedikit.',
    handshape: 'Tangan melengkung seperti memegang gelas.',
    location: 'Depan bibir.',
    movement: 'Miringkan tangan ke arah mulut seperti menuang air minum.',
    facialExpression: 'Santai dan segar.',
    gestureInstructions: [
      'Bentuk tangan kanan melengkung memegang cangkir imajiner.',
      'Dekatkan ke mulut lalu miringkan seperti minum air segar.'
    ],
    exampleSentence: 'Jangan lupa minum air putih yang cukup agar tetap sehat.',
    visualCue: '🥤'
  },
  {
    id: 'a-7',
    word: 'Istirahat / Santai',
    category: 'aktivitas',
    description: 'Kedua lengan disilangkan santai di depan dada sambil bahu sedikit rileks.',
    handshape: 'Kedua telapak tangan menempel di bahu bersilangan.',
    location: 'Depan dada/bahu.',
    movement: 'Tepukkan tangan santai di bahu berlawanan sambil menghela nafas lega.',
    facialExpression: 'Rileks, tenang, dan damai.',
    gestureInstructions: [
      'Silangkan kedua lengan di depan dada.',
      'Sentuhkan telapak tangan di pundak yang berlawanan dengan santai.'
    ],
    exampleSentence: 'Setelah seharian beraktivitas, saatnya kita istirahat sejenak.',
    visualCue: '☕'
  },
  {
    id: 'a-8',
    word: 'Pulang',
    category: 'aktivitas',
    description: 'Ujung jari tangan terbuka menyentuh pipi dekat mulut lalu ditarik mundur ke dekat telinga (kembali ke rumah).',
    handshape: 'Ujung jari rapat menguncup.',
    location: 'Dari pipi ditarik mundur ke dekat telinga.',
    movement: 'Tarik tangan mundur santai menyusuri pipi.',
    facialExpression: 'Tenang dan senang hendak kembali ke rumah.',
    gestureInstructions: [
      'Sentuhkan ujung jari tangan kanan di pipi dekat bibir.',
      'Tarik tangan menyusuri pipi ke arah telinga belakang.'
    ],
    exampleSentence: 'Hari sudah sore, ayo kita siap-siap pulang ke rumah.',
    visualCue: '🏠'
  },
  {
    id: 'a-9',
    word: 'Pergi / Berangkat',
    category: 'aktivitas',
    description: 'Kedua tangan terbuka di depan dada lalu digerakkan melesat maju ke depan menjauh dari tubuh.',
    handshape: 'Jari-jari tangan lurus mengarah ke depan.',
    location: 'Depan dada menuju ke luar.',
    movement: 'Dorong tangan maju ke depan secara mantap.',
    facialExpression: 'Fokus pada arah tujuan perjalanan.',
    gestureInstructions: [
      'Posisikan kedua tangan di depan dada.',
      'Ayunkan tangan maju ke depan seolah melangkah pergi.'
    ],
    exampleSentence: 'Pukul tujuh pagi kita akan berangkat bersama.',
    visualCue: '🚶'
  },
  {
    id: 'a-10',
    word: 'Bertanya',
    category: 'aktivitas',
    description: 'Jari telunjuk tegak di depan dada lalu menekuk membentuk tanda tanya mengarah ke lawan bicara.',
    handshape: 'Jari telunjuk lurus lalu menekuk melengkung.',
    location: 'Depan dada mengarah ke depan.',
    movement: 'Gerakkan telunjuk maju sambil menekuk membentuk kurva tanda tanya.',
    facialExpression: 'Alis terangkat sedikit, kepala condong ke depan.',
    gestureInstructions: [
      'Tegakkan telunjuk tangan kanan di depan dada.',
      'Arahkan ke depan sambil menekuk telunjuk membentuk kurva tanya.'
    ],
    exampleSentence: 'Bolehkah saya bertanya mengenai cara kerja sistem ini?',
    visualCue: '🙋'
  },
  {
    id: 'a-11',
    word: 'Paham / Mengerti',
    category: 'aktivitas',
    description: 'Tangan mengepal di samping pelipis, lalu jari telunjuk tiba-tiba menjentik tegak ke atas seperti lampu ide menyala.',
    handshape: 'Kepalan tangan lalu jari telunjuk menjentik tegak.',
    location: 'Samping kening / pelipis kanan.',
    movement: 'Jentikkan telunjuk ke atas secara cepat.',
    facialExpression: 'Mata terbuka cerah dan menganggukkan kepala mantap.',
    gestureInstructions: [
      'Posisikan kepalan tangan di samping kening kanan.',
      'Jentikkan telunjuk ke atas dengan cepat.',
      'Anggukkan kepala tanda sudah paham.'
    ],
    exampleSentence: 'Terima kasih atas penjelasannya, sekarang saya sudah paham.',
    visualCue: '💡'
  },
  {
    id: 'a-12',
    word: 'Belum Paham',
    category: 'aktivitas',
    description: 'Jari telunjuk menyentuh dahi lalu tangan digerakkan menggeleng ke samping sambil kepala menggeleng santun.',
    handshape: 'Telunjuk di dahi lalu telapak melambai ke samping.',
    location: 'Dahi kanan.',
    movement: 'Sentuh dahi lalu lambaikan tangan ke luar dengan gelengan kepala.',
    facialExpression: 'Menggelengkan kepala santun dengan alis berkerut lembut.',
    gestureInstructions: [
      'Sentuhkan jari telunjuk ke dahi.',
      'Gerakkan tangan ke samping luar sambil menggelengkan kepala tanda belum mengerti.'
    ],
    exampleSentence: 'Maaf, saya belum paham, mohon dijelaskan sekali lagi.',
    visualCue: '❓'
  },
  {
    id: 'a-13',
    word: 'Membantu',
    category: 'aktivitas',
    description: 'Kepalan tangan kanan bertumpu di atas telapak tangan kiri yang terbuka, lalu kedua tangan diangkat maju bersamaan.',
    handshape: 'Tangan kanan mengepal di atas telapak kiri yang datar.',
    location: 'Depan dada.',
    movement: 'Angkat kedua tangan maju ke arah lawan bicara.',
    facialExpression: 'Senyum ramah siap menolong.',
    gestureInstructions: [
      'Buka telapak tangan kiri datar di depan dada.',
      'Taruh kepalan tangan kanan di atas telapak kiri.',
      'Dorong kedua tangan sedikit ke atas dan maju ke depan.'
    ],
    exampleSentence: 'Saya dengan senang hati akan membantu pekerjaan Anda.',
    visualCue: '🤲'
  },
  {
    id: 'a-14',
    word: 'Berbicara / Komunikasi',
    category: 'aktivitas',
    description: 'Jari telunjuk kedua tangan bergantian bergerak maju-mundur di depan mulut menggambarkan aliran kata percakapan.',
    handshape: 'Jari telunjuk kedua tangan tegak.',
    location: 'Di depan mulut.',
    movement: 'Ayunkan kedua telunjuk bergantian maju-mundur berulang.',
    facialExpression: 'Ramah dan aktif bercakap-cakap.',
    gestureInstructions: [
      'Posisikan kedua telunjuk di depan mulut.',
      'Gerakkan bergantian maju-mundur menandakan obrolan dua arah.'
    ],
    exampleSentence: 'Komunikasi yang jelas membuat persahabatan semakin erat.',
    visualCue: '🗣️'
  },
  {
    id: 'a-15',
    word: 'Bahasa Isyarat',
    category: 'aktivitas',
    description: 'Kedua tangan terbuka berputar mengayun bergantian di depan dada seperti gerakan mengisyaratkan pesan visual.',
    handshape: 'Kedua tangan terbuka dengan jari rileks.',
    location: 'Depan dada.',
    movement: 'Putar pergelangan tangan bergantian melingkar secara anggun.',
    facialExpression: 'Bangga, ekspresif, dan bersahabat.',
    gestureInstructions: [
      'Buka kedua tangan di depan dada setinggi bahu.',
      'Putar kedua pergelangan tangan melingkar bergantian secara berkesinambungan.'
    ],
    exampleSentence: 'Bahasa isyarat adalah bahasa visual alami yang sangat indah.',
    visualCue: '🤟'
  },
  {
    id: 'a-16',
    word: 'Melihat',
    category: 'aktivitas',
    description: 'Dua jari telunjuk dan tengah (huruf V) mengarah dari mata sendiri lalu meluncur mengarah ke depan.',
    handshape: 'Dua jari membentuk huruf V (dua mata).',
    location: 'Dari dekat mata mengarah ke depan.',
    movement: 'Arahkan dua jari dari mata maju lurus ke obyek.',
    facialExpression: 'Mata fokus menatap obyek yang dilihat.',
    gestureInstructions: [
      'Posisikan dua jari (V) di dekat mata kanan.',
      'Arahkan kedua jari tersebut maju lurus ke depan.'
    ],
    exampleSentence: 'Mari kita melihat pemandangan indah di taman.',
    visualCue: '👀'
  },
  {
    id: 'a-17',
    word: 'Mendengar',
    category: 'aktivitas',
    description: 'Jari telunjuk tangan kanan menyentuh daun telinga kanan dengan perhatian saksama.',
    handshape: 'Jari telunjuk lurus.',
    location: 'Telinga kanan.',
    movement: 'Sentuhkan ujung telunjuk ke daun telinga.',
    facialExpression: 'Fokus mendengarkan suara.',
    gestureInstructions: [
      'Arahkan jari telunjuk tangan kanan ke telinga kanan.',
      'Sentuhkan ujung jari ke telinga secara perlahan.'
    ],
    exampleSentence: 'Saya mendengar suara kicauan burung yang merdu.',
    visualCue: '👂'
  },
  {
    id: 'a-18',
    word: 'Menunggu',
    category: 'aktivitas',
    description: 'Kedua telapak tangan terbuka menghadap atas dengan jari-jari bergoyang gemulai seperti menanti waktu.',
    handshape: 'Kedua telapak tangan terbuka menghadap atas.',
    location: 'Depan dada.',
    movement: 'Goyangkan ujung jari jemari secara bergantian dengan sabar.',
    facialExpression: 'Tenang, sabar, dan menanti santun.',
    gestureInstructions: [
      'Buka kedua telapak tangan menghadap atas di depan pinggang.',
      'Gerak-gerakkan jari jemari secara berurutan dengan sabar.'
    ],
    exampleSentence: 'Mohon menunggu sebentar, pesanan Anda sedang disiapkan.',
    visualCue: '⏳'
  },

  // ========================================================
  // 4. KATA TANYA (7 KATA)
  // ========================================================
  {
    id: 't-1',
    word: 'Apa?',
    category: 'tanya',
    description: 'Kedua telapak tangan terbuka di depan dada, digerakkan bergetar ke kanan-kiri santun dengan alis berkerut.',
    handshape: 'Kedua telapak tangan terbuka menghadap ke atas.',
    location: 'Depan dada.',
    movement: 'Goyangkan kedua telapak ke samping kanan-kiri 2 kali.',
    facialExpression: 'Alis berkerut santun tanda menanyakan hal atau benda.',
    gestureInstructions: [
      'Buka kedua telapak tangan menghadap ke atas di depan dada.',
      'Goyangkan secara perlahan ke samping secara bersamaan.',
      'Kerutkan alis sedikit sebagai penanda intonasi tanya.'
    ],
    exampleSentence: 'Apa yang sedang Anda kerjakan saat ini?',
    visualCue: '❓'
  },
  {
    id: 't-2',
    word: 'Siapa?',
    category: 'tanya',
    description: 'Jari telunjuk berputar melingkar di depan bibir atau dagu mengisyaratkan mencari identitas seseorang.',
    handshape: 'Jari telunjuk tegak ke atas.',
    location: 'Di depan bibir atau dagu.',
    movement: 'Putar telunjuk membentuk lingkaran kecil di depan mulut.',
    facialExpression: 'Alis berkerut santun dan bibir sedikit membulat.',
    gestureInstructions: [
      'Posisikan jari telunjuk kanan tegak di depan mulut/dagu.',
      'Putar jari melingkar searah jarum jam secara perlahan.'
    ],
    exampleSentence: 'Siapa nama teman yang tadi bersama Anda?',
    visualCue: '👤'
  },
  {
    id: 't-3',
    word: 'Di Mana?',
    category: 'tanya',
    description: 'Kedua telapak tangan terbuka menghadap ke atas digerakkan bergantian maju-mundur mencari tempat keberadaan.',
    handshape: 'Kedua telapak tangan terbuka menghadap atas.',
    location: 'Depan dada.',
    movement: 'Gerakkan tangan kiri dan kanan maju-mundur secara bergantian.',
    facialExpression: 'Mata memandang sekeliling dengan alis terangkat ingin tahu.',
    gestureInstructions: [
      'Buka kedua telapak tangan menghadap ke atas di depan pinggang.',
      'Gerakkan bergantian tangan kanan maju lalu tangan kiri maju.'
    ],
    exampleSentence: 'Di mana letak toko buku terdekat dari sini?',
    visualCue: '📍'
  },
  {
    id: 't-4',
    word: 'Kapan?',
    category: 'tanya',
    description: 'Jari telunjuk tangan kanan melingkari jari telunjuk tangan kiri menandakan putaran waktu.',
    handshape: 'Telunjuk kiri diam, telunjuk kanan melingkari.',
    location: 'Depan dada.',
    movement: 'Putar telunjuk kanan melingkari telunjuk kiri lalu tempelkan ujungnya.',
    facialExpression: 'Alis berkerut santun tanda menanyakan waktu.',
    gestureInstructions: [
      'Tegakkan telunjuk kiri sebagai patokan waktu.',
      'Putar telunjuk kanan melingkari telunjuk kiri dan sentuhkan di ujungnya.'
    ],
    exampleSentence: 'Kapan acara pertemuan santai ini akan dimulai?',
    visualCue: '⏰'
  },
  {
    id: 't-5',
    word: 'Mengapa / Kenapa?',
    category: 'tanya',
    description: 'Ujung jari tangan menyentuh kening lalu ditarik turun membuka menjadi bentuk huruf Y di depan dada.',
    handshape: 'Jari datar di dahi lalu ditarik menjadi jempol dan kelingking (Y).',
    location: 'Dari kening turun ke depan dada.',
    movement: 'Tarik turun secara tegas.',
    facialExpression: 'Alis berkerut mencari sebab atau alasan.',
    gestureInstructions: [
      'Sentuhkan ujung jari tengah kanan ke pelipis dahi.',
      'Tarik tangan turun ke bawah sambil membuka ibu jari dan kelingking.'
    ],
    exampleSentence: 'Mengapa kamu tampak begitu bahagia hari ini?',
    visualCue: '🤔'
  },
  {
    id: 't-6',
    word: 'Bagaimana?',
    category: 'tanya',
    description: 'Kedua tangan dengan buku jari saling menempel lalu diputar membuka keluar bersamaan.',
    handshape: 'Kedua tangan melengkung saling bertolak lalu membuka.',
    location: 'Depan dada.',
    movement: 'Putar pergelangan tangan ke luar secara serentak.',
    facialExpression: 'Ekspresi bertanya solutif dengan alis terangkat.',
    gestureInstructions: [
      'Rapatkan punggung jari kedua tangan di depan dada.',
      'Putar kedua pergelangan tangan keluar sehingga telapak menghadap ke atas.'
    ],
    exampleSentence: 'Bagaimana cara menggunakan aplikasi Ablefy ini?',
    visualCue: '🔄'
  },
  {
    id: 't-7',
    word: 'Berapa?',
    category: 'tanya',
    description: 'Jari-jari tangan terbuka di bawah lalu ditarik naik sambil menguncup dan membuka seperti menghitung jumlah angka.',
    handshape: 'Jari-jari tangan menjentik membuka ke atas.',
    location: 'Depan dada.',
    movement: 'Gerakkan jari-jari membuka dari bawah ke atas.',
    facialExpression: 'Alis berkerut santun menanyakan jumlah atau harga.',
    gestureInstructions: [
      'Posisikan telapak tangan kanan menghadap ke atas di depan dada.',
      'Jentikkan jari-jemari membuka ke atas seperti menghitung kuantitas.'
    ],
    exampleSentence: 'Berapa harga tiket masuk pameran seni hari ini?',
    visualCue: '🔢'
  },

  // ========================================================
  // 5. EMOSI & RESPON (12 KATA)
  // ========================================================
  {
    id: 'e-1',
    word: 'Ya / Benar',
    category: 'emosi',
    description: 'Kepalan tangan kanan (huruf S) dianggukkan ke bawah seperti mengangguk setuju.',
    handshape: 'Kepalan tangan kanan.',
    location: 'Setinggi dada/bahu.',
    movement: 'Gerakkan pergelangan tangan mengangguk ke bawah dua kali.',
    facialExpression: 'Menganggukkan kepala mantap dan tersenyum sepakat.',
    gestureInstructions: [
      'Kepalkan tangan kanan setinggi bahu.',
      'Anggukkan kepalan tangan ke bawah dua kali tanda setuju.'
    ],
    exampleSentence: 'Ya, saya sangat setuju dengan usulan tersebut.',
    visualCue: '✅'
  },
  {
    id: 'e-2',
    word: 'Tidak / Bukan',
    category: 'emosi',
    description: 'Jari telunjuk dan tengah menyatu dengan ibu jari lalu disentakkan menutup cepat (seperti mulut menutup tegas).',
    handshape: 'Ibu jari, telunjuk, dan jari tengah menutup cepat.',
    location: 'Setinggi bahu di depan dada.',
    movement: 'Tutupkan ketiga jari secara tegas bersamaan.',
    facialExpression: 'Menggelengkan kepala tegas tanda menolak atau membantah.',
    gestureInstructions: [
      'Buka ibu jari, telunjuk, dan jari tengah.',
      'Kuncupkan ketiga jari tersebut secara cepat sambil menggelengkan kepala.'
    ],
    exampleSentence: 'Tidak, saya belum pernah mengunjungi kota itu.',
    visualCue: '❌'
  },
  {
    id: 'e-3',
    word: 'Bisa / Mampu',
    category: 'emosi',
    description: 'Kedua tangan mengepal setinggi bahu lalu dianggukkan ke bawah tegas menandakan kesanggupan diri.',
    handshape: 'Kedua tangan mengepal (huruf S).',
    location: 'Setinggi bahu.',
    movement: 'Gerakkan mengangguk ke bawah secara bersamaan.',
    facialExpression: 'Mengangguk mantap dengan senyum percaya diri.',
    gestureInstructions: [
      'Posisikan kepalan kedua tangan setinggi bahu.',
      'Gerakkan turun secara tegas seperti anggukan mantap.'
    ],
    exampleSentence: 'Kita semua pasti bisa menguasai keahlian ini bersama.',
    visualCue: '💪'
  },
  {
    id: 'e-4',
    word: 'Tidak Bisa',
    category: 'emosi',
    description: 'Jari telunjuk kanan menyentuh ujung hidung lalu digerakkan menyentak ke luar sambil menggeleng.',
    handshape: 'Jari telunjuk lurus.',
    location: 'Dari hidung ke depan.',
    movement: 'Sentuh hidung lalu gerakkan menyentak menjauh ke samping.',
    facialExpression: 'Menggelengkan kepala santun pertanda tidak berdaya.',
    gestureInstructions: [
      'Sentuhkan ujung telunjuk kanan ke hidung.',
      'Sentakkan tangan menjauh ke samping sambil menggeleng.'
    ],
    exampleSentence: 'Maaf, saya tidak bisa hadir tepat waktu hari ini.',
    visualCue: '🚫'
  },
  {
    id: 'e-5',
    word: 'Suka / Gemar',
    category: 'emosi',
    description: 'Ibu jari dan jari tengah tangan kanan menyentuh dada lalu ditarik maju perlahan seolah menarik rasa suka dari hati.',
    handshape: 'Ibu jari dan jari tengah menguncup dari dada.',
    location: 'Tengah dada.',
    movement: 'Tarik tangan perlahan maju ke depan dari dada.',
    facialExpression: 'Tersenyum manis penuh ketulusan dan suka cita.',
    gestureInstructions: [
      'Tempelkan ibu jari dan jari tengah di tengah dada.',
      'Tarik tangan maju sambil merapatkan kedua ujung jari tersebut.'
    ],
    exampleSentence: 'Saya sangat suka mendengarkan alunan musik yang menenangkan.',
    visualCue: '❤️'
  },
  {
    id: 'e-6',
    word: 'Semangat',
    category: 'emosi',
    description: 'Kedua tangan mengepal di depan dada, digerakkan menyentak ke bawah secara mantap dan bertenaga.',
    handshape: 'Kedua tangan mengepal kuat.',
    location: 'Depan dada.',
    movement: 'Gerakkan menyentak ke bawah berulang 2–3 kali.',
    facialExpression: 'Mata berbinar, senyum optimis, dan ekspresi bersemangat.',
    gestureInstructions: [
      'Kepalkan kedua tangan di depan dada sejajar.',
      'Hentakkan ke bawah secara mantap 2 kali.',
      'Tampilkan ekspresi penuh daya juang dan optimisme.'
    ],
    exampleSentence: 'Tetap semangat dalam melangkah meraih cita-cita!',
    visualCue: '✊'
  },
  {
    id: 'e-7',
    word: 'Bahagia / Gembira',
    category: 'emosi',
    description: 'Kedua telapak tangan terbuka mengusap dada ke atas secara bergantian dengan riang gembira.',
    handshape: 'Telapak tangan terbuka rileks.',
    location: 'Depan dada.',
    movement: 'Usap dada ke atas bergantian secara melingkar ceria.',
    facialExpression: 'Tersenyum lebar dengan mata berbinar bahagia.',
    gestureInstructions: [
      'Tempelkan kedua telapak tangan di dada.',
      'Ayunkan mengusap ke atas secara bergantian dengan irama ceria.'
    ],
    exampleSentence: 'Hati saya merasa sangat bahagia bisa berkumpul bersama keluarga.',
    visualCue: '😊'
  },
  {
    id: 'e-8',
    word: 'Sedih',
    category: 'emosi',
    description: 'Kedua tangan terbuka di depan wajah lalu digerakkan turun perlahan seolah menggambarkan air mata yang jatuh.',
    handshape: 'Kedua tangan terbuka dengan jari sedikit melengkung.',
    location: 'Depan wajah turun ke dada.',
    movement: 'Gerakkan tangan turun perlahan mengikuti garis wajah.',
    facialExpression: 'Bibir melengkung turun, tatapan sayu penuh empati.',
    gestureInstructions: [
      'Posisikan kedua tangan di depan mata/wajah.',
      'Turunkan tangan perlahan ke bawah dada dengan ekspresi sedih.'
    ],
    exampleSentence: 'Jangan merasa sedih, kami semua ada di sini untuk mendukungmu.',
    visualCue: '😢'
  },
  {
    id: 'e-9',
    word: 'Sabar',
    category: 'emosi',
    description: 'Ibu jari tangan kanan mengusap dagu atau bibir bawah perlahan ke bawah menandakan ketenangan menahan diri.',
    handshape: 'Ibu jari tegak (jempol).',
    location: 'Dagu bawah.',
    movement: 'Usapkan ujung ibu jari perlahan ke bawah di sepanjang dagu.',
    facialExpression: 'Tenang, hening, dan menyejukkan hati.',
    gestureInstructions: [
      'Tempelkan ujung ibu jari kanan di dagu.',
      'Tarik perlahan ke bawah menandakan ketenangan dan kesabaran.'
    ],
    exampleSentence: 'Kunci keberhasilan adalah selalu sabar dan pantang menyerah.',
    visualCue: '🧘'
  },
  {
    id: 'e-10',
    word: 'Bagus / Mantap',
    category: 'emosi',
    description: 'Ibu jari tangan kanan tegak lurus ke atas (jempol) diarahkan mantap ke lawan bicara.',
    handshape: 'Ibu jari tegak (jempol mantap).',
    location: 'Setinggi dada/bahu.',
    movement: 'Dorong jempol sedikit ke depan dengan tegas.',
    facialExpression: 'Tersenyum bangga dan menganggukkan kepala.',
    gestureInstructions: [
      'Kepalkan empat jari dan tegakkan ibu jari lurus ke atas.',
      'Arahkan ke depan sebagai tanda apresiasi hebat.'
    ],
    exampleSentence: 'Hasil karya tulisan Anda sungguh sangat bagus!',
    visualCue: '👍'
  },
  {
    id: 'e-11',
    word: 'Hebat / Luar Biasa',
    category: 'emosi',
    description: 'Kedua telapak tangan terbuka di samping kepala lalu digoyangkan berputar riang mengisyaratkan tepuk tangan Tuli.',
    handshape: 'Kedua telapak tangan terbuka lebar.',
    location: 'Setinggi kepala di kedua sisi.',
    movement: 'Putar pergelangan tangan ke kanan-kiri berulang ceria.',
    facialExpression: 'Ekspresi kagum, bangga, dan senyum lebar bertepuk tangan visual.',
    gestureInstructions: [
      'Angkat kedua tangan terbuka di samping kepala.',
      'Putar pergelangan tangan bergoyang riang (tepuk tangan Tuli).'
    ],
    exampleSentence: 'Penampilan Anda tadi sungguh luar biasa hebat!',
    visualCue: '🌟'
  },
  {
    id: 'e-12',
    word: 'Hati-hati',
    category: 'emosi',
    description: 'Kedua tangan berbentuk huruf V atau K diketukkan satu sama lain di depan dada mengisyaratkan waspada.',
    handshape: 'Kedua tangan bentuk huruf V.',
    location: 'Depan dada.',
    movement: 'Ketukkan pergelangan tangan bentuk V dua kali perlahan.',
    facialExpression: 'Wajah waspada, perhatian, dan peduli.',
    gestureInstructions: [
      'Bentuk huruf V dengan kedua tangan.',
      'Ketukkan tangan kanan di atas tangan kiri secara santun.'
    ],
    exampleSentence: 'Jalanan sedang licin, tolong hati-hati saat melangkah.',
    visualCue: '⚠️'
  },

  // ========================================================
  // 6. ANGKA & WAKTU (9 KATA)
  // ========================================================
  {
    id: 'w-1',
    word: 'Satu (1)',
    category: 'waktu',
    description: 'Jari telunjuk tegak lurus ke atas menghadap ke depan lawan bicara.',
    handshape: 'Hanya jari telunjuk tegak lurus.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Jelas dan tenang.',
    gestureInstructions: [
      'Tegakkan hanya jari telunjuk tangan kanan ke atas.',
      'Lipat ketiga jari lain dan ibu jari rapat.'
    ],
    exampleSentence: 'Tolong ambilkan saya satu lembar kertas putih.',
    visualCue: '1️⃣'
  },
  {
    id: 'w-2',
    word: 'Dua (2)',
    category: 'waktu',
    description: 'Jari telunjuk dan jari tengah tegak lurus terbuka ke atas (huruf V).',
    handshape: 'Telunjuk dan jari tengah terbuka ke atas.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Jelas dan wajar.',
    gestureInstructions: [
      'Tegakkan jari telunjuk dan jari tengah lurus ke atas.',
      'Buka sedikit celah antara kedua jari.'
    ],
    exampleSentence: 'Kami berdua akan datang berkunjung nanti sore.',
    visualCue: '2️⃣'
  },
  {
    id: 'w-3',
    word: 'Tiga (3)',
    category: 'waktu',
    description: 'Ibu jari, telunjuk, dan jari tengah terbuka tegak lurus ke atas.',
    handshape: 'Tiga jari (jempol, telunjuk, tengah) tegak.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Jelas dan wajar.',
    gestureInstructions: [
      'Buka ibu jari, telunjuk, dan jari tengah ke atas.',
      'Lipat jari manis dan kelingking rapat ke telapak.'
    ],
    exampleSentence: 'Ada tiga buah apel segar di atas meja.',
    visualCue: '3️⃣'
  },
  {
    id: 'w-4',
    word: 'Empat (4)',
    category: 'waktu',
    description: 'Empat jari lurus terbuka ke atas sementara ibu jari melipat di telapak tangan.',
    handshape: 'Empat jari (telunjuk sampai kelingking) tegak.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Jelas dan wajar.',
    gestureInstructions: [
      'Tegakkan empat jari tangan kanan ke atas.',
      'Lipat ibu jari melintang di telapak tangan.'
    ],
    exampleSentence: 'Empat musim berganti dengan indahnya.',
    visualCue: '4️⃣'
  },
  {
    id: 'w-5',
    word: 'Lima (5)',
    category: 'waktu',
    description: 'Seluruh lima jari tangan terbuka lebar menghadap ke depan lawan bicara.',
    handshape: 'Kelima jari terbuka lebar.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Cerah dan jelas.',
    gestureInstructions: [
      'Buka seluruh lima jari tangan kanan ke atas.',
      'Arahkan telapak tangan stabil ke lawan bicara.'
    ],
    exampleSentence: 'Kita akan beristirahat selama lima belas menit.',
    visualCue: '5️⃣'
  },
  {
    id: 'w-6',
    word: 'Hari Ini',
    category: 'waktu',
    description: 'Kedua tangan membentuk huruf Y (jempol dan kelingking) diayunkan turun dua kali di depan pinggang.',
    handshape: 'Kedua tangan bentuk huruf Y.',
    location: 'Depan dada turun ke pinggang.',
    movement: 'Ayunkan turun ke bawah dua kali secara mantap.',
    facialExpression: 'Fokus pada waktu saat ini.',
    gestureInstructions: [
      'Buka ibu jari dan kelingking kedua tangan (huruf Y).',
      'Hentakkan turun ke bawah dua kali menandakan hari ini.'
    ],
    exampleSentence: 'Cuaca hari ini sangat cerah dan bersahabat.',
    visualCue: '📅'
  },
  {
    id: 'w-7',
    word: 'Kemarin',
    category: 'waktu',
    description: 'Ibu jari menyentuh pipi dekat mulut lalu ditarik mundur ke pipi belakang dekat telinga (waktu yang telah lewat).',
    handshape: 'Ibu jari terbuka (huruf A/Y).',
    location: 'Dari pipi depan ditarik ke pipi belakang.',
    movement: 'Tarik ibu jari mundur ke belakang telinga.',
    facialExpression: 'Mengingat waktu yang sudah berlalu.',
    gestureInstructions: [
      'Tempelkan ibu jari di pipi depan dekat bibir.',
      'Tarik mundur menyusuri pipi ke arah belakang telinga.'
    ],
    exampleSentence: 'Kemarin sore kami berjalan-jalan keliling kota.',
    visualCue: '⏪'
  },
  {
    id: 'w-8',
    word: 'Besok',
    category: 'waktu',
    description: 'Ibu jari tangan kanan menyentuh pipi lalu diputar melesat maju ke depan (waktu yang akan datang).',
    handshape: 'Ibu jari terbuka di pipi lalu maju.',
    location: 'Pipi kanan menuju ke depan.',
    movement: 'Ayunkan ibu jari maju meluncur ke arah depan.',
    facialExpression: 'Memandang optimis ke masa depan.',
    gestureInstructions: [
      'Tempelkan ibu jari di pipi kanan.',
      'Ayunkan tangan maju ke depan melambangkan hari esok.'
    ],
    exampleSentence: 'Besok kita akan merencanakan perjalanan bersama.',
    visualCue: '⏩'
  },
  {
    id: 'w-9',
    word: 'Sekarang',
    category: 'waktu',
    description: 'Kedua telapak tangan melengkung di depan dada lalu dihentakkan turun sekali tegas menandakan momen kini.',
    handshape: 'Kedua tangan melengkung ke atas.',
    location: 'Depan dada.',
    movement: 'Hentakkan kedua tangan turun ke bawah sekali secara tegas.',
    facialExpression: 'Tegas dan tepat waktu.',
    gestureInstructions: [
      'Buka kedua tangan menghadap atas di depan dada.',
      'Hentakkan turun sekali dengan mantap pertanda detik ini juga.'
    ],
    exampleSentence: 'Sekarang adalah waktu terbaik untuk memulai.',
    visualCue: '⏱️'
  },

  // ========================================================
  // 7. ABJAD JARI LENGKAP A SAMPAI Z (26 HURUF)
  // ========================================================
  {
    id: 'ab-a',
    word: 'A (Abjad Jari)',
    category: 'abjad',
    description: 'Empat jari mengepal rapat ke dalam telapak, ibu jari tegak lurus menempel di samping telunjuk.',
    handshape: 'Kepalan tangan rapat, ibu jari tegak di samping.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan lawan bicara.',
    facialExpression: 'Tenang dan fokus.',
    gestureInstructions: [
      'Kepalkan keempat jari rapat ke dalam telapak.',
      'Tegakkan ibu jari di samping luar jari telunjuk.'
    ],
    exampleSentence: 'Huruf A untuk nama Adam atau kata Aman.',
    visualCue: '🅰️'
  },
  {
    id: 'ab-b',
    word: 'B (Abjad Jari)',
    category: 'abjad',
    description: 'Empat jari tegak lurus rapat ke atas, dengan ibu jari ditekuk menyilang di depan telapak tangan.',
    handshape: 'Empat jari tegak lurus rapat, jempol melintang.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Tenang dan jelas.',
    gestureInstructions: [
      'Tegakkan telunjuk, jari tengah, jari manis, dan kelingking lurus ke atas.',
      'Lipat ibu jari melintang di depan telapak tangan.'
    ],
    exampleSentence: 'Huruf B untuk Budi, Bahagia, atau Baik.',
    visualCue: '🅱️'
  },
  {
    id: 'ab-c',
    word: 'C (Abjad Jari)',
    category: 'abjad',
    description: 'Seluruh jari dan ibu jari melengkung bersamaan membentuk huruf C yang terlihat jelas.',
    handshape: 'Jari melengkung seperti mangkuk huruf C.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Netral dan wajar.',
    gestureInstructions: [
      'Lengkungkan keempat jari dan ibu jari saling berhadapan.',
      'Bentuk celah melengkung menyerupai kurva huruf C.'
    ],
    exampleSentence: 'Huruf C untuk Cinta atau Cerdas.',
    visualCue: '🅲'
  },
  {
    id: 'ab-d',
    word: 'D (Abjad Jari)',
    category: 'abjad',
    description: 'Jari telunjuk tegak lurus ke atas, sementara ibu jari dan tiga jari lainnya melingkar menyatu.',
    handshape: 'Telunjuk lurus ke atas, jari lain menyentuh ibu jari membentuk bulatan d.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Jelas dan tegas.',
    gestureInstructions: [
      'Tegakkan jari telunjuk lurus ke atas.',
      'Satukan ujung ibu jari dengan jari tengah, manis, dan kelingking membentuk lingkaran dasar huruf D.'
    ],
    exampleSentence: 'Huruf D untuk Damai dan Dengar.',
    visualCue: '🅳'
  },
  {
    id: 'ab-e',
    word: 'E (Abjad Jari)',
    category: 'abjad',
    description: 'Keempat jari ditekuk ke bawah dengan ujung jari menempel di atas ibu jari yang terlipat di bawahnya.',
    handshape: 'Jari-jari menekuk rapat ke ibu jari di bawah.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Fokus dan tenang.',
    gestureInstructions: [
      'Tekuk keempat jari tangan ke bawah.',
      'Tumpangkan di atas ibu jari yang melintang di bawahnya.'
    ],
    exampleSentence: 'Huruf E untuk Eja dan Elok.',
    visualCue: '🅴'
  },
  {
    id: 'ab-f',
    word: 'F (Abjad Jari)',
    category: 'abjad',
    description: 'Ujung ibu jari dan jari telunjuk menyatu membentuk lingkaran, sementara tiga jari lainnya tegak lurus ke atas.',
    handshape: 'Telunjuk dan jempol melingkar, tiga jari tegak ke atas.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Percaya diri dan jelas.',
    gestureInstructions: [
      'Sentuhkan ujung ibu jari dan telunjuk membentuk lingkaran.',
      'Tegakkan jari tengah, manis, dan kelingking lurus ke atas.'
    ],
    exampleSentence: 'Huruf F untuk Fajar dan Fokus.',
    visualCue: '🅵'
  },
  {
    id: 'ab-g',
    word: 'G (Abjad Jari)',
    category: 'abjad',
    description: 'Ibu jari dan jari telunjuk terbuka sejajar mendatar ke samping seperti capit kecil.',
    handshape: 'Telunjuk dan ibu jari sejajar mendatar.',
    location: 'Setinggi dada.',
    movement: 'Arahkan mendatar ke arah samping kiri.',
    facialExpression: 'Netral dan stabil.',
    gestureInstructions: [
      'Arahkan jari telunjuk mendatar ke samping.',
      'Posisikan ibu jari sejajar tepat di belakangnya.'
    ],
    exampleSentence: 'Huruf G untuk Gembira dan Gigih.',
    visualCue: '🅶'
  },
  {
    id: 'ab-h',
    word: 'H (Abjad Jari)',
    category: 'abjad',
    description: 'Jari telunjuk dan jari tengah lurus rapat mendatar ke samping, jari lainnya mengepal.',
    handshape: 'Dua jari (telunjuk dan tengah) rapat mendatar.',
    location: 'Setinggi dada.',
    movement: 'Arahkan mendatar ke samping secara mantap.',
    facialExpression: 'Tenang dan wajar.',
    gestureInstructions: [
      'Rapatkan jari telunjuk dan jari tengah lurus mendatar.',
      'Arahkan ke samping sebagai bentuk huruf H.'
    ],
    exampleSentence: 'Huruf H untuk Hangat dan Hebat.',
    visualCue: '🅷'
  },
  {
    id: 'ab-i',
    word: 'I (Abjad Jari)',
    category: 'abjad',
    description: 'Tangan mengepal rapat dengan hanya jari kelingking tegak lurus ke atas.',
    handshape: 'Hanya jari kelingking tegak ke atas.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Tenang dan ramah.',
    gestureInstructions: [
      'Kepalkan keempat jari dan ibu jari rapat ke telapak.',
      'Tegakkan hanya jari kelingking lurus ke atas.'
    ],
    exampleSentence: 'Huruf I untuk Indah dan Inklusif.',
    visualCue: 'ℹ️'
  },
  {
    id: 'ab-j',
    word: 'J (Abjad Jari)',
    category: 'abjad',
    description: 'Jari kelingking tegak lurus lalu digerakkan melengkung ke bawah membentuk lekukan ekor huruf J di udara.',
    handshape: 'Kelingking tegak lalu meliuk.',
    location: 'Setinggi bahu.',
    movement: 'Gambar kurva huruf J di udara dengan ujung jari kelingking.',
    facialExpression: 'Luwes dan terarah.',
    gestureInstructions: [
      'Posisikan tangan dalam bentuk huruf I (kelingking tegak).',
      'Gerakkan kelingking meliuk ke bawah dan melengkung seperti huruf J.'
    ],
    exampleSentence: 'Huruf J untuk Jujur dan Jembatan.',
    visualCue: '🅹'
  },
  {
    id: 'ab-k',
    word: 'K (Abjad Jari)',
    category: 'abjad',
    description: 'Jari telunjuk dan jari tengah tegak terbuka ke atas dengan ibu jari bertumpu di antara pangkal kedua jari.',
    handshape: 'Bentuk huruf V dengan ibu jari di tengah.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Mantap dan jelas.',
    gestureInstructions: [
      'Tegakkan telunjuk dan jari tengah terbuka ke atas.',
      'Selipkan ujung ibu jari tegak di antara kedua pangkal jari tersebut.'
    ],
    exampleSentence: 'Huruf K untuk Kasih dan Kawan.',
    visualCue: '🺱'
  },
  {
    id: 'ab-l',
    word: 'L (Abjad Jari)',
    category: 'abjad',
    description: 'Ibu jari dan jari telunjuk terbuka tegak lurus membentuk sudut siku 90 derajat menyerupai huruf L.',
    handshape: 'Telunjuk dan ibu jari membentuk sudut siku 90 derajat.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan lawan bicara.',
    facialExpression: 'Percaya diri dan mantap.',
    gestureInstructions: [
      'Buka ibu jari ke samping dan tegakkan telunjuk ke atas membentuk sudut 90 derajat.',
      'Lipat ketiga jari lainnya rapat ke telapak.'
    ],
    exampleSentence: 'Huruf L untuk Langkah dan Lancar.',
    visualCue: '🅻'
  },
  {
    id: 'ab-m',
    word: 'M (Abjad Jari)',
    category: 'abjad',
    description: 'Ibu jari diselipkan di bawah tiga jari (telunjuk, tengah, manis) yang ditekuk ke bawah menutupi jempol.',
    handshape: 'Tiga jari menutupi ibu jari di bawahnya.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Tenang dan jelas.',
    gestureInstructions: [
      'Lipat telunjuk, jari tengah, dan jari manis di atas ibu jari.',
      'Ibu jari terlihat sedikit menyembul di antara jari manis dan kelingking.'
    ],
    exampleSentence: 'Huruf M untuk Mandiri dan Manis.',
    visualCue: '🅼'
  },
  {
    id: 'ab-n',
    word: 'N (Abjad Jari)',
    category: 'abjad',
    description: 'Ibu jari diselipkan di bawah dua jari (telunjuk dan tengah) yang ditekuk ke bawah menutupi jempol.',
    handshape: 'Dua jari menutupi ibu jari di bawahnya.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Tenang dan jelas.',
    gestureInstructions: [
      'Lipat jari telunjuk dan jari tengah di atas ibu jari.',
      'Ibu jari terlihat menyembul di antara jari tengah dan jari manis.'
    ],
    exampleSentence: 'Huruf N untuk Nyaman dan Nyata.',
    visualCue: '🅽'
  },
  {
    id: 'ab-o',
    word: 'O (Abjad Jari)',
    category: 'abjad',
    description: 'Seluruh ujung jari melengkung menyentuh ujung ibu jari membentuk lingkaran sempurna menyerupai huruf O.',
    handshape: 'Seluruh jari membentuk lingkaran bulat.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Fokus dan bulat sempurna.',
    gestureInstructions: [
      'Lengkungkan seluruh jari-jemari menyatu dengan ujung ibu jari.',
      'Bentuk lubang lingkaran bulat huruf O yang tampak jelas.'
    ],
    exampleSentence: 'Huruf O untuk Optimis dan Orang.',
    visualCue: '⭕'
  },
  {
    id: 'ab-p',
    word: 'P (Abjad Jari)',
    category: 'abjad',
    description: 'Bentuk huruf K diarahkan menunduk ke bawah dengan telunjuk lurus ke bawah dan ibu jari menyangga jari tengah.',
    handshape: 'Bentuk K yang mengarah menunduk ke bawah.',
    location: 'Setinggi dada.',
    movement: 'Arahkan tangan condong ke bawah.',
    facialExpression: 'Jelas dan terarah.',
    gestureInstructions: [
      'Bentuk konfigurasi huruf K.',
      'Miringkan pergelangan tangan agar jari telunjuk menunjuk ke bawah.'
    ],
    exampleSentence: 'Huruf P untuk Peduli dan Pintar.',
    visualCue: '🅿️'
  },
  {
    id: 'ab-q',
    word: 'Q (Abjad Jari)',
    category: 'abjad',
    description: 'Bentuk huruf G diarahkan menunduk ke bawah dengan telunjuk dan ibu jari mengarah ke lantai.',
    handshape: 'Bentuk G yang menunjuk ke bawah.',
    location: 'Setinggi pinggang.',
    movement: 'Arahkan capit telunjuk dan jempol ke arah bawah.',
    facialExpression: 'Jelas dan stabil.',
    gestureInstructions: [
      'Bentuk konfigurasi jari huruf G.',
      'Arahkan kedua ujung jari menunjuk ke arah lantai.'
    ],
    exampleSentence: 'Huruf Q untuk ejaan nama diri dan kata khusus.',
    visualCue: '🆀'
  },
  {
    id: 'ab-r',
    word: 'R (Abjad Jari)',
    category: 'abjad',
    description: 'Jari telunjuk dan jari tengah disilangkan rapat satu sama lain mengarah lurus ke atas.',
    handshape: 'Dua jari (telunjuk dan tengah) saling bersilangan rapat.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Percaya diri dan mantap.',
    gestureInstructions: [
      'Tegakkan telunjuk dan jari tengah ke atas.',
      'Silangkan jari tengah di atas jari telunjuk secara rapat.'
    ],
    exampleSentence: 'Huruf R untuk Ramah dan Rukun.',
    visualCue: '®️'
  },
  {
    id: 'ab-s',
    word: 'S (Abjad Jari)',
    category: 'abjad',
    description: 'Tangan mengepal rapat dengan ibu jari melintang menutupi bagian depan keempat jari yang terlipat.',
    handshape: 'Kepalan tangan rapat dengan ibu jari di depan.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Kuat dan mantap.',
    gestureInstructions: [
      'Kepalkan keempat jari ke dalam telapak tangan.',
      'Tutupkan ibu jari melintang rapat di depan keempat jari.'
    ],
    exampleSentence: 'Huruf S untuk Sahabat dan Senang.',
    visualCue: '🆂'
  },
  {
    id: 'ab-t',
    word: 'T (Abjad Jari)',
    category: 'abjad',
    description: 'Ibu jari diselipkan di antara jari telunjuk dan jari tengah yang mengepal ke bawah.',
    handshape: 'Ibu jari menyembul di antara telunjuk dan jari tengah.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Jelas dan mantap.',
    gestureInstructions: [
      'Kepalkan tangan lalu selipkan ibu jari ke atas di antara telunjuk dan jari tengah.',
      'Posisikan stabil setinggi bahu.'
    ],
    exampleSentence: 'Huruf T untuk Tulus dan Tangguh.',
    visualCue: '🆃'
  },
  {
    id: 'ab-u',
    word: 'U (Abjad Jari)',
    category: 'abjad',
    description: 'Jari telunjuk dan jari tengah tegak lurus rapat berdampingan ke atas tanpa ada celah.',
    handshape: 'Dua jari (telunjuk dan tengah) tegak rapat.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Tenang dan jelas.',
    gestureInstructions: [
      'Tegakkan jari telunjuk dan jari tengah lurus ke atas.',
      'Rapatkan kedua jari berdampingan tanpa celah.'
    ],
    exampleSentence: 'Huruf U untuk Untuk dan Unik.',
    visualCue: '🆙'
  },
  {
    id: 'ab-v',
    word: 'V (Abjad Jari)',
    category: 'abjad',
    description: 'Jari telunjuk dan jari tengah tegak lurus terbuka membentuk sudut huruf V yang jelas.',
    handshape: 'Dua jari terbuka membentuk huruf V.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Ceria dan bersahabat.',
    gestureInstructions: [
      'Tegakkan jari telunjuk dan jari tengah ke atas.',
      'Buka celah lebar antara kedua jari membentuk alfabet V.'
    ],
    exampleSentence: 'Huruf V untuk Visual dan Variasi.',
    visualCue: '✌️'
  },
  {
    id: 'ab-w',
    word: 'W (Abjad Jari)',
    category: 'abjad',
    description: 'Tiga jari (telunjuk, tengah, manis) tegak lurus terbuka ke atas membentuk sudut huruf W.',
    handshape: 'Tiga jari terbuka membentuk alfabet W.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Percaya diri dan mantap.',
    gestureInstructions: [
      'Tegakkan jari telunjuk, tengah, dan manis ke atas.',
      'Beri jarak teratur antara ketiga jari menyerupai huruf W.'
    ],
    exampleSentence: 'Huruf W untuk Waktu dan Wawasan.',
    visualCue: '🆆'
  },
  {
    id: 'ab-x',
    word: 'X (Abjad Jari)',
    category: 'abjad',
    description: 'Jari telunjuk ditekuk melengkung menyerupai kait, sementara jari lainnya mengepal rapat.',
    handshape: 'Jari telunjuk melengkung seperti kait.',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Jelas dan tegas.',
    gestureInstructions: [
      'Kepalkan tangan kanan.',
      'Tegakkan telunjuk lalu tekuk melengkung seperti kait huruf X.'
    ],
    exampleSentence: 'Huruf X untuk istilah khusus dan ejaan abjad.',
    visualCue: '🆇'
  },
  {
    id: 'ab-y',
    word: 'Y (Abjad Jari)',
    category: 'abjad',
    description: 'Ibu jari dan jari kelingking terbuka lebar ke samping, sementara tiga jari tengah melipat rapat ke telapak.',
    handshape: 'Jempol dan kelingking terbuka (tangan telepon).',
    location: 'Setinggi bahu.',
    movement: 'Diam stabil menghadap ke depan.',
    facialExpression: 'Santai, ramah, dan bersahabat.',
    gestureInstructions: [
      'Buka ibu jari dan jari kelingking selebar mungkin.',
      'Lipat telunjuk, jari tengah, dan jari manis rapat ke telapak.'
    ],
    exampleSentence: 'Huruf Y untuk Yakin dan Yang.',
    visualCue: '🤙'
  },
  {
    id: 'ab-z',
    word: 'Z (Abjad Jari)',
    category: 'abjad',
    description: 'Jari telunjuk kanan menggambar pola garis zig-zag huruf Z di udara dari kiri ke kanan lalu turun.',
    handshape: 'Jari telunjuk lurus menggambar di udara.',
    location: 'Setinggi dada/bahu.',
    movement: 'Tarik garis horizontal ke kanan, diagonal ke kiri bawah, lalu horizontal ke kanan.',
    facialExpression: 'Fokus mengikuti ujung jari.',
    gestureInstructions: [
      'Tegakkan jari telunjuk kanan ke depan.',
      'Goreskan pola huruf Z di udara secara terarah.'
    ],
    exampleSentence: 'Huruf Z untuk Zaman dan Zona inklusif.',
    visualCue: '🆉'
  }
];
