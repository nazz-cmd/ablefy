/**
 * Indonesian Speech-to-Text Enhancer & Intonation Engine
 * Refines raw speech recognition output by:
 * 1. Correcting common STT misrecognitions, phonetic errors, and non-standard Indonesian words.
 * 2. Restoring brand names, accessibility terms, and acronyms (Ablefy, BISINDO, YouTube, AI, UI/UX, etc.).
 * 3. Cleaning browser STT stutter periods (e.g. "Hal. Ini. Bagus." -> "Hal ini bagus").
 * 4. Detecting question vs statement intonation (? vs .).
 * 5. Intelligently joining speech chunks with natural Indonesian conjunctions and commas.
 */

// Dictionary of common Indonesian Speech Recognition misrecognitions to correct Indonesian spelling
const CORRECTION_MAP: Array<[RegExp, string]> = [
  // Ablefy & Accessibility Terms
  [/\b(able\s*fi|able\s*fee|able\s*py|able\s*pay|efly|eplay)\b/gi, 'Ablefy'],
  [/\bablefy\b/gi, 'Ablefy'],
  [/\b(bis\s*indo|bisindo)\b/gi, 'BISINDO'],
  [/\b(screen\s*reader|skrin\s*rider)\b/gi, 'screen reader'],
  [/\b(text\s*to\s*speech|teks\s*to\s*spich)\b/gi, 'Text-to-Speech'],
  [/\b(speech\s*to\s*text|spich\s*to\s*teks)\b/gi, 'Speech-to-Text'],
  [/\b(takari|takarir|subtitel)\b/gi, 'subtitle'],

  // Technology & Academic Acronyms
  [/\b(you\s*tube|yutub|yutup)\b/gi, 'YouTube'],
  [/\b(power\s*point|powerpoint)\b/gi, 'PowerPoint'],
  [/\b(zoom\s*meeting|aplikasi\s*zoom)\b/gi, 'Zoom'],
  [/\b\ba\s*i\b/gi, 'AI'],
  [/\b\bu\s*i\b/gi, 'UI'],
  [/\b\bu\s*x\b/gi, 'UX'],
  [/\b\bp\s*d\s*f\b/gi, 'PDF'],
  [/\b\bp\s*p\s*t\b/gi, 'PPT'],
  [/\b\bh\s*t\s*m\s*l\b/gi, 'HTML'],
  [/\b\bc\s*s\s*s\b/gi, 'CSS'],
  [/\b\ba\s*p\s*i\b/gi, 'API'],
  [/\bonlen\b/gi, 'online'],
  [/\boflen\b/gi, 'offline'],
  [/\bweb\s*sit(e)?\b/gi, 'website'],

  // Indonesian Grammar & Standard Vocabulary (KBBI Enhancements)
  [/\bdimana\b/gi, 'di mana'],
  [/\bdisini\b/gi, 'di sini'],
  [/\bdisana\b/gi, 'di sana'],
  [/\bkemana\b/gi, 'ke mana'],
  [/\bkesini\b/gi, 'ke sini'],
  [/\bkesana\b/gi, 'ke sana'],
  [/\bterimakasih\b/gi, 'terima kasih'],
  [/\bterima\s*kasih\s*banyak\b/gi, 'terima kasih banyak'],

  // Reduplications (Kata Ulang)
  [/\bsama\s+sama\b/gi, 'sama-sama'],
  [/\bkandang\s+kadang\b/gi, 'kadang-kadang'],
  [/\bkadang\s+kadang\b/gi, 'kadang-kadang'],
  [/\bmasing\s+masing\b/gi, 'masing-masing'],
  [/\btiba\s+tiba\b/gi, 'tiba-tiba'],
  [/\bpelan\s+pelan\b/gi, 'pelan-pelan'],
  [/\bbenar\s+benar\b/gi, 'benar-benar'],
  [/\bbesar\s+besar\b/gi, 'besar-besar'],
  [/\bkecil\s+kecil\b/gi, 'kecil-kecil'],
  [/\bhati\s+hati\b/gi, 'hati-hati'],
  [/\bterus\s+menerus\b/gi, 'terus-menerus'],

  // Common STT Phonetic Slips & Non-Standard Spellings
  [/\bpraktek\b/gi, 'praktik'],
  [/\banalisa\b/gi, 'analisis'],
  [/\baktifitas\b/gi, 'aktivitas'],
  [/\befektifitas\b/gi, 'efektivitas'],
  [/\bkreatifitas\b/gi, 'kreativitas'],
  [/\bkwalitas\b/gi, 'kualitas'],
  [/\bkualitet\b/gi, 'kualitas'],
  [/\bobyek\b/gi, 'objek'],
  [/\bsubyek\b/gi, 'subjek'],
  [/\bresiko\b/gi, 'risiko'],
  [/\bmerubah\b/gi, 'mengubah'],
  [/\bsekedar\b/gi, 'sekadar'],
  [/\bantri\b/gi, 'antre'],
  [/\bantrian\b/gi, 'antrean'],
  [/\bjadual\b/gi, 'jadwal'],
  [/\bhirarki\b/gi, 'hierarki'],
  [/\bmetoda\b/gi, 'metode'],
  [/\bstandarisasi\b/gi, 'standardisasi'],
  [/\bijin\b/gi, 'izin'],
  [/\bjaman\b/gi, 'zaman'],
  [/\bnomer\b/gi, 'nomor'],
  [/\bfikir\b/gi, 'pikir'],
  [/\bfikiran\b/gi, 'pikiran'],
  [/\bfaham\b/gi, 'paham'],
  [/\bmemfahami\b/gi, 'memahami'],
  [/\bnafas\b/gi, 'napas'],
  [/\bhakekat\b/gi, 'hakikat'],
  [/\bkonkrit\b/gi, 'konkret'],
  [/\btehnik\b/gi, 'teknik'],
  [/\bkarir\b/gi, 'karier'],
  [/\bkharakter\b/gi, 'karakter'],
  [/\bprosentase\b/gi, 'persentase'],
  [/\bprosen\b/gi, 'persen'],
  [/\bterlanjur\b/gi, 'telanjur'],
  [/\bhutang\b/gi, 'utang'],
  [/\bcidera\b/gi, 'cedera'],
  [/\bgubug\b/gi, 'gubuk'],
  [/\bpondasi\b/gi, 'fondasi'],
  [/\bazas\b/gi, 'asas'],
  [/\bhiraukan\b/gi, 'hiraukan'],

  // Ordinal Numbers
  [/\bke\s*1\b/gi, 'ke-1'],
  [/\bke\s*2\b/gi, 'ke-2'],
  [/\bke\s*3\b/gi, 'ke-3'],
  [/\bke\s*4\b/gi, 'ke-4'],
  [/\bke\s*5\b/gi, 'ke-5'],
  [/\bke\s*6\b/gi, 'ke-6'],
  [/\bke\s*7\b/gi, 'ke-7'],
  [/\bke\s*8\b/gi, 'ke-8'],
  [/\bke\s*9\b/gi, 'ke-9'],
  [/\bke\s*10\b/gi, 'ke-10'],
];

// Indonesian coordinating & subordinating conjunctions that naturally pair with commas
const CONJUNCTIONS_PREFERRING_COMMA = new Set([
  'tetapi',
  'namun',
  'melainkan',
  'sedangkan',
  'padahal',
  'karena',
  'sebab',
  'sehingga',
  'yaitu',
  'yakni',
  'seperti',
  'misalnya',
  'contohnya',
  'bahkan',
  'walaupun',
  'meskipun',
  'kendati',
  'akibatnya',
]);

// Question starter words and phrases indicating interrogative intonation
const QUESTION_INDICATORS = [
  /\b(apa|apakah)\b/i,
  /\b(bagaimana|bagaimanakah)\b/i,
  /\b(mengapa|kenapa)\b/i,
  /\b(kapan)\b/i,
  /\b(siapa|siapakah)\b/i,
  /\b(di\s*mana|ke\s*mana|dari\s*mana)\b/i,
  /\b(berapa|berapakah)\b/i,
  /\b(bisa\s+diulang|bisa\s+diulangi)\b/i,
  /\b(ada\s+pertanyaan)\b/i,
  /\b(paham\s+tidak|paham\s+atau\s+belum|sudah\s+paham\s+belum)\b/i,
  /\b(sudah\s+jelas\s+belum|jelas\s+tidak)\b/i,
  /\b(apakah\s+ada\s+yang\s+ingin\s+ditanyakan)\b/i,
];

/**
 * Enhances Indonesian speech text:
 * - Fixes common misrecognitions & typos
 * - Removes browser STT stutter periods
 * - Cleans multiple punctuation and whitespace
 */
export const enhanceIndonesianSpeechText = (raw: string): string => {
  let text = (raw || '').trim();
  if (!text) return '';

  // 1. Remove stutter periods between alphanumeric words inserted by browser pause detection
  // e.g. "Itu adalah. Sebuah. Pelajaran." -> "Itu adalah, sebuah, pelajaran"
  text = text.replace(/([a-zA-Z0-9]+)\.\s+([a-zA-Z0-9]+)/g, '$1 $2');

  // 2. Apply dictionary corrections
  for (const [pattern, replacement] of CORRECTION_MAP) {
    text = text.replace(pattern, replacement);
  }

  // 3. Clean duplicate commas or punctuation
  text = text.replace(/,\s*,/g, ', ');
  text = text.replace(/\s*([,.:;?!])\s*/g, '$1 ');
  text = text.replace(/\s+/g, ' ').trim();

  return text;
};

/**
 * Detects intonation of an Indonesian sentence:
 * Returns '?' for interrogative intonation, or '.' for declarative statement.
 */
export const detectIntonationPunctuation = (text: string): string => {
  if (!text || !text.trim()) return '.';

  const trimmed = text.trim();
  if (/[.?!]$/.test(trimmed)) {
    return trimmed.slice(-1);
  }

  // Check if phrase begins with or contains strong question indicators
  const isQuestion = QUESTION_INDICATORS.some((pattern) => pattern.test(trimmed));
  return isQuestion ? '?' : '.';
};

// Proper nouns and acronyms that must retain uppercase formatting mid-sentence
const PRESERVED_PROPER_NOUNS = new Set([
  'ablefy',
  'bisindo',
  'youtube',
  'google',
  'microsoft',
  'zoom',
  'powerpoint',
  'indonesia',
  'jakarta',
  'senin',
  'selasa',
  'rabu',
  'kamis',
  'jumat',
  'sabtu',
  'minggu',
  'januari',
  'februari',
  'maret',
  'april',
  'mei',
  'juni',
  'juli',
  'agustus',
  'september',
  'oktober',
  'november',
  'desember',
]);

export const shouldPreserveCapitalization = (word: string): boolean => {
  if (!word) return false;
  // Acronyms like AI, API, HTML, UI, UX, PPT
  if (word.length >= 2 && word === word.toUpperCase() && /^[A-Z0-9]+$/.test(word)) {
    return true;
  }
  // Specific recognized proper nouns/brands
  if (PRESERVED_PROPER_NOUNS.has(word.toLowerCase())) {
    return true;
  }
  return false;
};

/**
 * Smartly joins a new speech chunk to the current base text:
 * - Prevents repetitive words caused by interim auto-promotion.
 * - Lowercases words in continuation unless they are acronyms or proper nouns.
 * - Detects whether to connect with comma or space based on pause intonation and conjunctions.
 */
export const smartJoinSpeechChunks = (
  baseText: string,
  newChunk: string,
  pauseDurationMs: number = 0
): string => {
  let base = baseText.trim();
  let chunk = newChunk.trim();

  if (!base) return chunk;
  if (!chunk) return base;

  // Strip terminal punctuation from base for smooth continuation
  base = base.replace(/[.,;?!]+$/, '').trim();
  // Strip leading punctuation from chunk
  chunk = chunk.replace(/^[.,;?!]+/, '').trim();

  // Word-level overlap deduplication (e.g. from interim auto-promotion)
  const baseWords = base.toLowerCase().split(/\s+/);
  const chunkWords = chunk.split(/\s+/);

  let overlapCount = 0;
  const maxCheck = Math.min(baseWords.length, chunkWords.length, 5);
  for (let n = maxCheck; n >= 1; n--) {
    const tail = baseWords.slice(-n).join(' ').replace(/[.,;?!]+$/, '');
    const head = chunkWords.slice(0, n).join(' ').toLowerCase().replace(/^[.,;?!]+/, '');
    if (tail === head) {
      overlapCount = n;
      break;
    }
  }

  if (overlapCount > 0) {
    chunk = chunkWords.slice(overlapCount).join(' ');
    if (!chunk.trim()) return base;
  }

  // Normalize casing for the continuation: lowercase unless it is an acronym or proper noun
  const firstWord = chunk.split(/\s+/)[0];
  if (!shouldPreserveCapitalization(firstWord)) {
    chunk = chunk.charAt(0).toLowerCase() + chunk.slice(1);
  }

  // Evaluate intonation: should we connect with comma or space?
  const firstWordLower = firstWord.toLowerCase();
  const startsWithConjunction = CONJUNCTIONS_PREFERRING_COMMA.has(firstWordLower);
  const isNoticeableBreathPause = pauseDurationMs >= 2200; // >= 2.2s deliberate breath pause

  if (startsWithConjunction || isNoticeableBreathPause) {
    return `${base}, ${chunk}`;
  }

  return `${base} ${chunk}`;
};
