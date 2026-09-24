/**
 * NLP Intent Classifier for Indonesian Voice Commands
 * Handles Indonesian natural conversational language, slang, affixes, and filler words
 */

export type VoiceActionType =
  // Module Navigation
  | 'GO_HOME'
  | 'GO_LECTURE'
  | 'GO_STUDIO'
  | 'GO_BISINDO'
  | 'GO_LANDING'
  // Lecture / Transcribe Actions
  | 'START_RECORDING'
  | 'STOP_RECORDING'
  | 'CLEAR_TRANSCRIPT'
  | 'COPY_TRANSCRIPT'
  | 'DOWNLOAD_TRANSCRIPT'
  | 'SET_INPUT_SOURCE'
  // Studio / Reader Actions
  | 'PLAY_TTS'
  | 'PAUSE_TTS'
  | 'RESUME_TTS'
  | 'STOP_TTS'
  | 'READ_CLIPBOARD'
  | 'NEXT_SENTENCE'
  | 'PREV_SENTENCE'
  | 'FASTER_SPEED'
  | 'SLOWER_SPEED'
  | 'SET_PERSONA'
  // Accessibility Toggles
  | 'SET_CONTRAST'
  | 'SET_DYSLEXIC'
  | 'SET_RULER'
  | 'SET_FONT_SCALE'
  | 'SET_VOICE_CUES'
  | 'OPEN_SHORTCUTS'
  | 'CLOSE_MODAL'
  | 'STOP_VOICE_NAV';

export interface ClassifiedIntent {
  action: VoiceActionType;
  payload?: any;
  label: string;
  targetTab?: string;
  confidence: number;
}

/**
 * Normalizes colloquial Indonesian conversational prefixes, suffixes, and filler words
 */
export const normalizeIndonesianText = (raw: string): string => {
  let text = raw.toLowerCase().trim();

  // Strip punctuation
  text = text.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ' ');

  // Remove common filler words that don't carry action intent
  const fillerWords = [
    'tolong', 'coba', 'dong', 'sih', 'deh', 'ya', 'kan', 'nih', 'lah',
    'eh', 'halo', 'hai', 'permisi', 'mohon', 'bisa', 'tolongin', 'tolong dong',
    'saya mau', 'aku mau', 'aku pengen', 'saya ingin', 'pengen', 'ingin',
    'silakan', 'coba dong', 'sekarang juga', 'sekarang'
  ];

  for (const filler of fillerWords) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    text = text.replace(regex, ' ');
  }

  // Normalize Indonesian slang and meN-/di-/-in affixes to canonical roots
  const replacements: Array<[RegExp, string]> = [
    [/\b(masukin|masuklah|masukkan|menuju|menuju ke|arahin|bawa saya ke|bawa ke|arahkan ke)\b/g, 'masuk'],
    [/\b(bukain|bukalah|membuka)\b/g, 'buka'],
    [/\b(pindahin|pindahkan|alihkan|beralih ke|beralih)\b/g, 'pindah'],
    [/\b(ngetranskrip|transkripsikan|transkripkan)\b/g, 'transkrip'],
    [/\b(merekam|rekamin|nge-rekam|ngerekam)\b/g, 'rekam'],
    [/\b(nyalain|nyalakan|mengaktifkan|hidupkan|hidupin)\b/g, 'aktifkan'],
    [/\b(matiin|matikan|menonaktifkan|hentiin|hentikan|berhentikan|berhenti|setop|stop)\b/g, 'hentikan'],
    [/\b(bacain|bacakan|membaca|membacakan)\b/g, 'baca'],
    [/\b(muter|memutar|muterin|play-kan|playkan)\b/g, 'putar'],
    [/\b(dengerin|mendengarkan|dengarkan)\b/g, 'dengar'],
    [/\b(lanjutin|lanjutkan|terusin|meneruskan)\b/g, 'lanjut'],
    [/\b(bersihin|membersihkan|hapusin|menghapus)\b/g, 'bersihkan'],
    [/\b(salinin|menyalin|nge-copy|copas)\b/g, 'salin'],
    [/\b(unduhin|mengunduh|men-download)\b/g, 'unduh'],
    [/\b(perbesarin|membesarkan|gedein)\b/g, 'perbesar'],
    [/\b(kecilin|mengecilkan)\b/g, 'perkecil'],
    [/\b(papan klip|klipboard|clip board)\b/g, 'clipboard'],
    [/\b(whatsapp|wa)\b/g, 'wa'],
    [/\b(bisindo|bahasa isyarat|isyarat tangan)\b/g, 'isyarat'],
    [/\b(home|dashboard|halaman utama|menu awal)\b/g, 'beranda'],
    [/\b(kuliah|perkuliahan|stt|speech to text)\b/g, 'transkrip'],
    [/\b(bicara live|bicara langsung|ngomong langsung|ngomong|wicara langsung)\b/g, 'bicara'],
    [/\b(reader|materi bacaan|dokumen bacaan)\b/g, 'pembaca']
  ];

  for (const [regex, replacement] of replacements) {
    text = text.replace(regex, replacement);
  }

  return text.replace(/\s+/g, ' ').trim();
};

export interface VoiceIntentContext {
  isRecording?: boolean;
  activeTab?: string;
}

/**
 * Classifies an Indonesian utterance into an actionable system command
 */
export const classifyIndonesianVoiceIntent = (
  rawPhrase: string,
  context?: VoiceIntentContext
): ClassifiedIntent | null => {
  if (!rawPhrase || !rawPhrase.trim()) return null;

  const rawLower = rawPhrase.toLowerCase().trim();
  const clean = normalizeIndonesianText(rawPhrase);

  // -------------------------------------------------------------
  // 1. TRANSCRIPTION ACTIONS (Highest Priority for Recording state)
  // -------------------------------------------------------------

  // If user is currently in live recording mode:
  // Any variation of stop, pause, finish or quiet IMMEDIATELY stops recording
  // without leaking speech into lecture transcript notes!
  if (context?.isRecording) {
    const wordCount = clean.split(/\s+/).filter(Boolean).length;
    // Only trigger stop if the user explicitly commanded it as a concise phrase (<= 3 words)
    // NEVER match conversational sentences like "hari ini kita sudah selesai" or "ini cukup jelas"
    const isExplicitStop =
      clean === 'berhenti' ||
      clean === 'hentikan' ||
      clean === 'stop' ||
      clean === 'jeda' ||
      clean === 'pause' ||
      clean === 'selesai' ||
      clean === 'tutup mic' ||
      clean === 'matikan mic' ||
      clean === 'selesai merekam' ||
      clean === 'hentikan transkrip' ||
      clean === 'hentikan rekaman' ||
      clean === 'berhenti merekam' ||
      clean === 'stop rekaman' ||
      clean === 'stop rekam';

    if (isExplicitStop || (wordCount <= 3 && (clean === 'berhenti' || clean === 'hentikan' || clean === 'stop' || clean === 'jeda'))) {
      return {
        action: 'STOP_RECORDING',
        label: 'Perekaman wicara dihentikan',
        confidence: 0.98
      };
    }
  }

  // Stop Recording: "stop rekam", "hentikan transkrip", "selesai merekam", "matikan mic", "berhenti"
  if (
    clean === 'hentikan' ||
    clean === 'berhenti' ||
    clean === 'stop' ||
    (
      (clean.includes('hentikan') || clean.includes('stop') || clean.includes('selesai') || clean.includes('cukup') || clean.includes('tutup mic') || clean.includes('berhenti')) &&
      (clean.includes('transkrip') || clean.includes('rekam') || clean.includes('mikrofon') || clean.includes('mic') || clean.includes('suara'))
    )
  ) {
    return {
      action: 'STOP_RECORDING',
      label: 'Perekaman wicara dihentikan',
      confidence: 0.95
    };
  }

  // Start Recording: "mulai transkrip", "rekam suara", "bicara live", "aktifkan mikrofon", "mulai rekam"
  if (
    (clean.includes('mulai') || clean.includes('start') || clean.includes('aktifkan') || clean.includes('nyalakan')) &&
    (clean.includes('transkrip') || clean.includes('rekam') || clean.includes('suara') || clean.includes('mikrofon') || clean.includes('mic') || clean.includes('wicara') || clean.includes('bicara live'))
  ) {
    return {
      action: 'START_RECORDING',
      targetTab: 'lecture',
      label: 'Memulai transkripsi wicara langsung',
      confidence: 0.95
    };
  }
  if (
    clean === 'rekam' ||
    clean === 'rekam suara' ||
    clean === 'mulai merekam' ||
    clean === 'mulai transkrip' ||
    clean === 'mulai bicara' ||
    clean === 'bicara live' ||
    clean === 'catat suara' ||
    clean === 'catat kuliah' ||
    clean === 'mulai catat' ||
    clean === 'start recording' ||
    clean === 'start transcribe'
  ) {
    return {
      action: 'START_RECORDING',
      targetTab: 'lecture',
      label: 'Memulai transkripsi wicara langsung',
      confidence: 0.94
    };
  }

  // Clear Transcript: "bersihkan transkrip", "hapus catatan", "reset transkripsi"
  if (
    (clean.includes('bersihkan') || clean.includes('hapus') || clean.includes('reset') || clean.includes('kosong')) &&
    (clean.includes('transkrip') || clean.includes('catatan') || clean.includes('teks') || clean.includes('layar') || clean.includes('rekaman'))
  ) {
    return {
      action: 'CLEAR_TRANSCRIPT',
      label: 'Transkrip wicara dibersihkan',
      confidence: 0.9
    };
  }

  // Copy Transcript: "salin transkrip", "copy catatan", "salin hasil"
  if (
    (clean.includes('salin') || clean.includes('copy')) &&
    (clean.includes('transkrip') || clean.includes('catatan') || clean.includes('teks') || clean.includes('hasil'))
  ) {
    return {
      action: 'COPY_TRANSCRIPT',
      label: 'Transkrip disalin ke papan klip',
      confidence: 0.9
    };
  }

  // Download Transcript: "unduh transkrip", "download berkas", "simpan transkrip"
  if (
    (clean.includes('unduh') || clean.includes('download') || clean.includes('simpan') || clean.includes('ekspor')) &&
    (clean.includes('transkrip') || clean.includes('catatan') || clean.includes('berkas') || clean.includes('dokumen') || clean.includes('file'))
  ) {
    return {
      action: 'DOWNLOAD_TRANSCRIPT',
      label: 'Mengunduh berkas transkrip teks',
      confidence: 0.9
    };
  }

  // Input source switching
  if (clean.includes('youtube') || clean.includes('video')) {
    return {
      action: 'SET_INPUT_SOURCE',
      payload: 'video',
      targetTab: 'lecture',
      label: 'Beralih ke mode video YouTube',
      confidence: 0.88
    };
  }
  if (clean.includes('berkas audio') || clean.includes('mode audio') || clean.includes('mp3') || clean.includes('unggah audio')) {
    return {
      action: 'SET_INPUT_SOURCE',
      payload: 'audio',
      targetTab: 'lecture',
      label: 'Beralih ke mode berkas audio',
      confidence: 0.88
    };
  }

  // -------------------------------------------------------------
  // 2. STUDIO & TEXT-TO-SPEECH (TTS) ACTIONS
  // -------------------------------------------------------------

  // Read Clipboard: "baca salinan", "baca clipboard", "tempel dan baca"
  if (
    clean.includes('clipboard') ||
    clean.includes('salinan') ||
    clean.includes('tempel') ||
    (clean.includes('baca') && (clean.includes('wa') || clean.includes('email')))
  ) {
    return {
      action: 'READ_CLIPBOARD',
      targetTab: 'studio',
      label: 'Membaca teks dari papan klip',
      confidence: 0.92
    };
  }

  // Play / Read Text Aloud: "putar suara", "bacakan artikel", "dengarkan materi", "play suara"
  if (
    (clean.includes('putar') || clean.includes('dengar') || clean.includes('play')) ||
    (clean.includes('baca') && (clean.includes('artikel') || clean.includes('materi') || clean.includes('dokumen') || clean.includes('teks') || clean.includes('ini') || clean === 'baca'))
  ) {
    return {
      action: 'PLAY_TTS',
      targetTab: 'studio',
      label: 'Memulai pembacaan materi studio',
      confidence: 0.9
    };
  }

  // Pause Speech: "jeda suara", "pause", "berhenti membaca", "diam sebentar"
  if (
    clean.includes('jeda') ||
    clean.includes('pause') ||
    clean === 'diam' ||
    ((clean.includes('hentikan') || clean.includes('stop') || clean.includes('tahan')) && (clean.includes('suara') || clean.includes('baca') || clean.includes('bicara') || clean.includes('audio')))
  ) {
    return {
      action: 'PAUSE_TTS',
      label: 'Pembacaan suara dijeda',
      confidence: 0.92
    };
  }

  // Resume Speech: "lanjutkan suara", "lanjut baca", "teruskan"
  if (clean.includes('lanjut') || clean.includes('teruskan') || clean.includes('resume')) {
    return {
      action: 'RESUME_TTS',
      label: 'Melanjutkan pembacaan suara',
      confidence: 0.9
    };
  }

  // Skip Sentences: "kalimat berikutnya", "berikutnya", "sebelumnya"
  if (clean.includes('berikutnya') || clean.includes('selanjutnya') || clean.includes('maju') || clean === 'next') {
    return {
      action: 'NEXT_SENTENCE',
      label: 'Lompat ke kalimat berikutnya',
      confidence: 0.88
    };
  }
  if (clean.includes('sebelumnya') || clean.includes('mundur') || clean.includes('kembali')) {
    return {
      action: 'PREV_SENTENCE',
      label: 'Kembali ke kalimat sebelumnya',
      confidence: 0.88
    };
  }

  // Voice Persona selection: "suara gadis", "suara ardi"
  if (clean.includes('gadis') || clean.includes('wanita') || clean.includes('cewek')) {
    return {
      action: 'SET_PERSONA',
      payload: 'friendly',
      label: 'Mengganti suara ke Gadis',
      confidence: 0.9
    };
  }
  if (clean.includes('ardi') || clean.includes('pria') || clean.includes('cowok') || clean.includes('dosen')) {
    return {
      action: 'SET_PERSONA',
      payload: 'educator',
      label: 'Mengganti suara ke Ardi',
      confidence: 0.9
    };
  }

  // Speed adjustments
  if (clean.includes('percepat') || clean.includes('lebih cepat')) {
    return {
      action: 'FASTER_SPEED',
      label: 'Kecepatan suara ditingkatkan',
      confidence: 0.88
    };
  }
  if (clean.includes('perlambat') || clean.includes('lebih lambat')) {
    return {
      action: 'SLOWER_SPEED',
      label: 'Kecepatan suara diperlambat',
      confidence: 0.88
    };
  }

  // -------------------------------------------------------------
  // 3. ACCESSIBILITY CONTROLS
  // -------------------------------------------------------------

  // High Contrast
  if (clean.includes('kuning') || clean.includes('kontras tinggi') || clean.includes('kontras tajam')) {
    return {
      action: 'SET_CONTRAST',
      payload: 'yellow-black',
      label: 'Mode Kontras Kuning-Hitam Aktif',
      confidence: 0.92
    };
  }
  if (clean.includes('gelap pekat') || clean.includes('mode gelap')) {
    return {
      action: 'SET_CONTRAST',
      payload: 'high-dark',
      label: 'Mode Kontras Gelap Pekat Aktif',
      confidence: 0.9
    };
  }
  if (clean.includes('kontras normal') || clean.includes('kontras standar') || clean.includes('matikan kontras') || clean.includes('warna normal')) {
    return {
      action: 'SET_CONTRAST',
      payload: 'normal',
      label: 'Mode Kontras Normal Aktif',
      confidence: 0.92
    };
  }

  // Dyslexia Font
  if (clean.includes('disleksia')) {
    const isDisable = clean.includes('hentikan') || clean.includes('mati') || clean.includes('tutup') || clean.includes('nonaktif');
    return {
      action: 'SET_DYSLEXIC',
      payload: !isDisable,
      label: isDisable ? 'Font disleksia dimatikan' : 'Font ramah disleksia diaktifkan',
      confidence: 0.92
    };
  }

  // Reading Ruler
  if (clean.includes('garis baca') || clean.includes('penggaris') || clean.includes('fokus baca')) {
    const isDisable = clean.includes('hentikan') || clean.includes('mati') || clean.includes('tutup') || clean.includes('nonaktif');
    return {
      action: 'SET_RULER',
      payload: !isDisable,
      label: isDisable ? 'Garis pemandu membaca dimatikan' : 'Garis pemandu membaca diaktifkan',
      confidence: 0.92
    };
  }

  // Font Scale
  if (clean.includes('sangat besar') || clean.includes('ekstra')) {
    return {
      action: 'SET_FONT_SCALE',
      payload: 'xl',
      label: 'Ukuran teks sangat besar aktif',
      confidence: 0.9
    };
  }
  if (clean.includes('perbesar teks') || clean.includes('teks besar') || clean.includes('huruf besar') || clean.includes('tulisan besar')) {
    return {
      action: 'SET_FONT_SCALE',
      payload: 'lg',
      label: 'Ukuran teks diperbesar',
      confidence: 0.9
    };
  }
  if (clean.includes('teks normal') || clean.includes('huruf normal') || clean.includes('ukuran standar')) {
    return {
      action: 'SET_FONT_SCALE',
      payload: 'normal',
      label: 'Ukuran teks kembali normal',
      confidence: 0.9
    };
  }

  // Voice Cues
  if (clean.includes('panduan suara') || clean.includes('suara layar')) {
    const isDisable = clean.includes('hentikan') || clean.includes('mati') || clean.includes('tutup') || clean.includes('nonaktif') || clean.includes('off');
    return {
      action: 'SET_VOICE_CUES',
      payload: !isDisable,
      label: isDisable ? 'Panduan suara layar dimatikan' : 'Panduan suara layar diaktifkan',
      confidence: 0.95
    };
  }

  // Shortcuts / Help Modal
  if (clean.includes('bantuan') || clean.includes('panduan pintasan') || clean.includes('daftar pintasan') || clean.includes('shortcut')) {
    return {
      action: 'OPEN_SHORTCUTS',
      label: 'Membuka Panduan Pintasan',
      confidence: 0.9
    };
  }
  if (clean.includes('tutup bantuan') || clean.includes('tutup panduan') || clean.includes('tutup jendela') || clean === 'tutup') {
    return {
      action: 'CLOSE_MODAL',
      label: 'Menutup Panduan',
      confidence: 0.9
    };
  }

  // Turn Off Voice Navigator
  if (
    clean.includes('matikan kontrol suara') ||
    clean.includes('nonaktifkan navigasi suara') ||
    clean.includes('tutup navigasi') ||
    clean.includes('matikan navigasi suara') ||
    clean === 'matikan suara'
  ) {
    return {
      action: 'STOP_VOICE_NAV',
      label: 'Navigasi suara dinonaktifkan',
      confidence: 0.95
    };
  }

  // -------------------------------------------------------------
  // 4. NATURAL MODULE & TAB NAVIGATION (Robust Indonesian NLP)
  // -------------------------------------------------------------

  // Lecture / Transcribe tab navigation:
  // e.g. "masuk ke menu transkrip", "ke transkripsi", "buka ruang kuliah", "arahin ke transkrip", "buka bicara live"
  if (
    clean.includes('transkrip') ||
    clean.includes('transkripsi') ||
    clean.includes('wicara') ||
    clean.includes('kuliah') ||
    clean.includes('bicara live') ||
    clean === 'bicara' ||
    clean === 'buka bicara' ||
    clean === 'satu' ||
    clean === 'nomor satu'
  ) {
    return {
      action: 'GO_LECTURE',
      targetTab: 'lecture',
      label: 'Beralih ke Transkripsi Wicara',
      confidence: 0.95
    };
  }

  // Studio / Reader tab navigation:
  // e.g. "masuk ke studio", "buka pembaca teks", "pindah ke materi", "ke pembaca"
  if (
    clean.includes('studio') ||
    clean.includes('pembaca') ||
    clean.includes('baca teks') ||
    clean === 'dua' ||
    clean === 'nomor dua'
  ) {
    return {
      action: 'GO_STUDIO',
      targetTab: 'studio',
      label: 'Beralih ke Pembaca Teks',
      confidence: 0.95
    };
  }

  // Bisindo / Sign Language tab navigation:
  // e.g. "masuk ke menu isyarat", "buka bisindo", "ke bahasa isyarat"
  if (
    clean.includes('isyarat') ||
    clean.includes('bisindo') ||
    clean.includes('tuli') ||
    clean === 'tiga' ||
    clean === 'nomor tiga'
  ) {
    return {
      action: 'GO_BISINDO',
      targetTab: 'bisindo',
      label: 'Beralih ke Bahasa Isyarat',
      confidence: 0.95
    };
  }

  // Home tab navigation:
  // e.g. "masuk ke beranda", "kembali ke menu utama", "buka beranda"
  if (
    clean.includes('beranda') ||
    clean.includes('home') ||
    clean.includes('utama') ||
    clean.includes('awal') ||
    clean === 'nol' ||
    clean === 'nomor nol'
  ) {
    return {
      action: 'GO_HOME',
      targetTab: 'home',
      label: 'Beralih ke Beranda Utama',
      confidence: 0.95
    };
  }

  // Landing Page:
  // e.g. "ke landing page", "halaman depan", "halaman publik", "keluar workspace"
  if (
    clean.includes('landing') ||
    clean.includes('halaman depan') ||
    clean.includes('halaman publik') ||
    clean.includes('keluar workspace') ||
    clean.includes('portal')
  ) {
    return {
      action: 'GO_LANDING',
      label: 'Kembali ke Halaman Depan Publik',
      confidence: 0.92
    };
  }

  // -------------------------------------------------------------
  // 5. FUZZY MATCHING FOR COLLOQUIAL SLURS OR PHONETIC VARIATIONS
  // -------------------------------------------------------------
  if (rawLower.includes('transkrip') || rawLower.includes('tanskrip') || rawLower.includes('skrip')) {
    return {
      action: 'GO_LECTURE',
      targetTab: 'lecture',
      label: 'Beralih ke Transkripsi Wicara',
      confidence: 0.8
    };
  }

  if (rawLower.includes('studio') || rawLower.includes('baca')) {
    return {
      action: 'GO_STUDIO',
      targetTab: 'studio',
      label: 'Beralih ke Studio Pembaca Materi',
      confidence: 0.8
    };
  }

  if (rawLower.includes('isyarat') || rawLower.includes('bisindo')) {
    return {
      action: 'GO_BISINDO',
      targetTab: 'bisindo',
      label: 'Beralih ke Studio Bahasa Isyarat',
      confidence: 0.8
    };
  }

  if (rawLower.includes('beranda') || rawLower.includes('home')) {
    return {
      action: 'GO_HOME',
      targetTab: 'home',
      label: 'Beralih ke Beranda Utama',
      confidence: 0.8
    };
  }

  return null;
};
