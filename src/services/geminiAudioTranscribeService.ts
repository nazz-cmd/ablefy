/**
 * Google Gemini AI Audio Transcription Service
 * Transcribes uploaded audio files (.m4a, .mp3, .wav, .ogg, .aac, .webm)
 * into timestamped Indonesian transcript segments with high accuracy.
 */

import { enhanceIndonesianSpeechText } from '../utils/speechTextEnhancer';

export interface TranscribedSegment {
  id: string;
  speaker: string;
  time: string;
  seconds: number;
  endSeconds: number;
  text: string;
  isImportant?: boolean;
}

const STORAGE_KEY = 'ablefy_gemini_api_key';

export const getGeminiApiKey = (): string => {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored.trim()) return stored.trim();

  try {
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (envKey && typeof envKey === 'string' && envKey.trim()) {
      return envKey.trim();
    }
  } catch (_) {}

  return '';
};

export const setGeminiApiKey = (key: string): void => {
  if (typeof window === 'undefined') return;
  const trimmed = key.trim();
  if (!trimmed) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, trimmed);
  }
};

/**
 * Normalizes file MIME type for Gemini Audio API
 */
const getNormalizedMimeType = (file: File): string => {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'm4a') return 'audio/mp4';
  if (ext === 'mp3') return 'audio/mp3';
  if (ext === 'wav') return 'audio/wav';
  if (ext === 'ogg') return 'audio/ogg';
  if (ext === 'aac') return 'audio/aac';
  if (ext === 'webm') return 'audio/webm';
  if (ext === 'flac') return 'audio/flac';
  return file.type || 'audio/mp4';
};

/**
 * Converts File object to Base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      if (base64) {
        resolve(base64);
      } else {
        reject(new Error('Gagal mengonversi berkas audio ke format base64.'));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

/**
 * Formats integer seconds to mm:ss
 */
const formatSecondsToTime = (totalSeconds: number): string => {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Transcribes audio file using Gemini 2.0 Flash / 1.5 Flash API
 */
export const transcribeAudioWithGemini = async (
  file: File,
  apiKeyParam?: string
): Promise<TranscribedSegment[]> => {
  const apiKey = (apiKeyParam || getGeminiApiKey()).trim();
  if (!apiKey) {
    throw new Error('Kunci API Gemini belum diatur. Silakan masukkan kunci API Google AI Studio Anda.');
  }

  const base64Data = await fileToBase64(file);
  const mimeType = getNormalizedMimeType(file);

  const prompt = `Anda adalah asisten transkripsi audio profesional berbahasa Indonesia untuk platform disabilitas dan inklusi pendidikan Ablefy.
Tugas Anda:
1. Dengarkan rekaman audio ini dengan sangat teliti.
2. Transkripsikan setiap kata yang diucapkan ke dalam bahasa Indonesia baku dengan ejaan, tanda baca (? dan .), dan kapitalisasi yang benar.
3. Pisahkan transkripsi menjadi segmen-segmen kalimat berdasarkan jeda hening atau pergantian gagasan/pembicara.
4. Berikan stempel waktu detik mulai (seconds) dan detik selesai (endSeconds) yang presisi sesuai alur rekaman suara.
5. Identifikasi nama peran pembicara (misal: "Pembicara", "Dosen Pembimbing", "Mahasiswa", atau "Narasumber").

Format respon WAJIB berupa JSON array valid berikut:
[
  {
    "seconds": 0,
    "endSeconds": 7,
    "speaker": "Pembicara 1",
    "text": "Kalimat yang diucapkan secara lengkap dan jelas.",
    "isImportant": false
  }
]`;

  // Use active Google Gemini models
  const models = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Data,
                  },
                },
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(message);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('AI tidak mengembalikan teks transkripsi.');
      }

      // Parse JSON array
      let parsedSegments: any[];
      try {
        // Strip markdown backticks if any
        const cleanedJson = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        parsedSegments = JSON.parse(cleanedJson);
      } catch (jsonErr) {
        throw new Error('Gagal memformat respon AI menjadi data transkrip terstruktur.');
      }

      if (!Array.isArray(parsedSegments) || parsedSegments.length === 0) {
        throw new Error('Rekaman audio tidak memuat ucapan yang dapat diidentifikasi.');
      }

      // Convert into standard TranscribedSegment items with phonetic enhancement
      const formatted: TranscribedSegment[] = parsedSegments.map((item, idx) => {
        const sec = typeof item.seconds === 'number' ? Math.max(0, item.seconds) : idx * 6;
        const endSec = typeof item.endSeconds === 'number' ? Math.max(sec + 1, item.endSeconds) : sec + 6;
        const cleanedText = enhanceIndonesianSpeechText(item.text || '');

        return {
          id: `trans-${Date.now()}-${idx}`,
          speaker: item.speaker || `Pembicara ${idx + 1}`,
          time: formatSecondsToTime(sec),
          seconds: Math.floor(sec),
          endSeconds: Math.floor(endSec),
          text: cleanedText || (item.text || '').trim(),
          isImportant: Boolean(item.isImportant),
        };
      });

      return formatted;
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} gagal mentranskripsi audio:`, err);
      // If error is invalid API key (400 / API_KEY_INVALID), don't retry with next model
      if (err?.message?.includes('API_KEY_INVALID') || err?.message?.includes('API key not valid')) {
        throw new Error('Kunci API Gemini tidak valid. Harap periksa kembali kunci API Anda.');
      }
    }
  }

  throw lastError || new Error('Gagal menghubungi layanan transkripsi AI Gemini.');
};
