/**
 * Google Gemini AI Video Transcription Service for YouTube Videos
 * Generates accurate Indonesian timestamped dialogue transcripts for YouTube videos.
 */

import { getGeminiApiKey } from './geminiAudioTranscribeService';
import { enhanceIndonesianSpeechText } from '../utils/speechTextEnhancer';
import { 
  type VideoCaption, 
  normalizeVideoCaptions,
  BUSINESS_VIDEO_CAPTIONS, 
  EDUCATION_VIDEO_CAPTIONS, 
  TECH_INCLUSION_CAPTIONS, 
  ARJUNA_RESKY_CAPTIONS 
} from '../data/videoCaptions';

export interface VideoMetadata {
  title: string;
  author: string;
}

const CACHE_PREFIX = 'ablefy_yt_transcript_';

/**
 * Fetch public oEmbed video metadata (title, author)
 */
export const fetchYouTubeMetadata = async (videoId: string): Promise<VideoMetadata> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.title || '',
        author: data.author_name || '',
      };
    }
  } catch (_) {}
  return { title: '', author: '' };
};

/**
 * Transcribes YouTube video dialogue with Gemini AI
 */
export const transcribeVideoWithGemini = async (
  videoId: string,
  videoUrl?: string
): Promise<VideoCaption[]> => {
  if (!videoId) return [];

  // 1. Check if it's one of the curated preset videos
  if (videoId === '-858AOZjY9M') return BUSINESS_VIDEO_CAPTIONS;
  if (videoId === '7X8II6J-6mU') return EDUCATION_VIDEO_CAPTIONS;
  if (videoId === 'bVfECa1_s_U') return TECH_INCLUSION_CAPTIONS;
  if (videoId === 'wSfjiaDlFXA') {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${CACHE_PREFIX}${videoId}`, JSON.stringify(ARJUNA_RESKY_CAPTIONS));
      } catch (_) {}
    }
    return ARJUNA_RESKY_CAPTIONS;
  }

  // 2. Check LocalStorage cache
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`${CACHE_PREFIX}${videoId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return normalizeVideoCaptions(parsed);
        }
      }
    } catch (_) {}
  }

  // 3. Obtain API key
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Kunci API belum diatur untuk transkripsi AI.');
  }

  // 4. Fetch title & author metadata to enrich Gemini's context
  const meta = await fetchYouTubeMetadata(videoId);
  const fullUrl = videoUrl || `https://www.youtube.com/watch?v=${videoId}`;

  const prompt = `Anda adalah asisten AI spesialis transkripsi video untuk platform aksesibilitas pendidikan inklusif Ablefy.
Video YouTube: ${fullUrl}
Judul Video: ${meta.title || 'Video YouTube'}
Pembuat/Kanal: ${meta.author || 'Kreator YouTube'}

Tugas Anda:
1. Dengarkan, pahami, dan rekonstruksikan isi percakapan atau monolog wicara yang diucapkan dalam video tersebut dari awal hingga akhir secara runtut, lengkap, dan detail.
2. Pecah transkripsi menjadi segmen-segmen kalimat percakapan yang jelas dengan stempel waktu detik mulai (start) dan detik selesai (end) yang akurat dan alami sesuai alur video.
3. Transkripsikan dalam bahasa Indonesia yang baku, dengan tanda baca (? dan .) serta huruf kapital yang benar.
4. Hindari membuat teks dummy atau pengulangan kalimat umum. Naskah harus mencerminkan isi asli video di atas.

Format respon WAJIB berupa JSON array valid berikut:
[
  {
    "start": 0,
    "end": 6,
    "text": "Kalimat ucapan pembicara di video secara lengkap..."
  }
]`;

  const models = ['gemini-flash-latest', 'gemini-3.6-flash', 'gemini-3.5-flash'];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  fileData: {
                    mimeType: 'video/mp4',
                    fileUri: fullUrl
                  }
                },
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const message = errData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        if (response.status === 503 || response.status === 429) {
          console.warn(`Model ${model} sibuk (${response.status}), mencoba model berikutnya...`);
          await new Promise(r => setTimeout(r, 1500));
          continue;
        }
        throw new Error(message);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('AI tidak mengembalikan naskah transkripsi video.');
      }

      const cleanedJson = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed = JSON.parse(cleanedJson);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Format naskah transkripsi tidak valid.');
      }

      // Format, enhance, and normalize Indonesian speech text
      const rawCaptions: VideoCaption[] = parsed.map((item, idx) => {
        const start = typeof item.start === 'number' ? Math.max(0, Math.floor(item.start)) : idx * 6;
        const end = typeof item.end === 'number' ? Math.max(start + 1, Math.floor(item.end)) : start + 6;
        const text = enhanceIndonesianSpeechText(item.text || '').trim();

        return {
          start,
          end,
          text: text || (item.text || '').trim(),
        };
      });

      const captions = normalizeVideoCaptions(rawCaptions);

      // Cache normalized result locally
      if (typeof window !== 'undefined' && captions.length > 0) {
        try {
          localStorage.setItem(`${CACHE_PREFIX}${videoId}`, JSON.stringify(captions));
        } catch (_) {}
      }

      return captions;
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} gagal mentranskripsi video:`, err);
      if (err?.message?.includes('API_KEY_INVALID') || err?.message?.includes('API key not valid')) {
        throw new Error('Kunci API tidak valid.');
      }
    }
  }

  throw lastError || new Error('Gagal menghubungi layanan transkripsi video AI.');
};
