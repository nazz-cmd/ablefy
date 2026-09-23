/**
 * Web Article & Cloud Document Extractor Service for Ablefy Studio
 * Extracts clean, readable text content from public web links, news, Wikipedia, and Google Docs.
 * Uses Google Gemini AI to strip menus, breadcrumbs, footers, and summarize/reorganize
 * only the core substance into fluent, dyslexia-friendly, TTS-ready sentences.
 */

import { getGeminiApiKey } from './geminiAudioTranscribeService';

export interface ExtractedArticle {
  title: string;
  content: string;
  sourceUrl: string;
  wordCount: number;
}

/**
 * Check if extracted webpage text indicates a bot challenge, captcha, or access denied wall
 */
export const isBlockedContent = (text: string): boolean => {
  if (!text) return true;
  const lower = text.toLowerCase();
  return (
    lower.includes('access denied') ||
    lower.includes('403 forbidden') ||
    (lower.includes('cloudflare') && lower.includes('attention required')) ||
    lower.includes('web application firewall') ||
    lower.includes('pemberitahuan akses ditolak') ||
    lower.includes('robot verification') ||
    lower.includes('enable javascript and cookies')
  );
};

/**
 * Clean and format raw extracted markdown/HTML content into TTS-ready sentences
 * Serves as a deterministic offline fallback when AI is unavailable.
 */
export const cleanExtractedText = (rawText: string): string => {
  if (!rawText) return '';

  let cleaned = rawText;

  // 1. Remove Markdown images: ![alt](url)
  cleaned = cleaned.replace(/!\[.*?\]\(.*?\)/g, '');

  // 2. Convert Markdown links: [anchor text](url) -> anchor text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 3. Remove Wikipedia citation markers: [[1]], [1], [2a], [↑], etc.
  cleaned = cleaned.replace(/\[\[?\d+[a-z]?\]?\]/gi, '');
  cleaned = cleaned.replace(/\[↑\]/g, '');

  // 4. Remove Markdown formatting symbols (*, _, #, `, ~)
  cleaned = cleaned.replace(/#{1,6}\s+/g, '');
  cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, '$2');
  cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, '$2');
  cleaned = cleaned.replace(/`{1,3}(.*?)`{1,3}/g, '$1');

  // 5. Remove HTML tags if present
  cleaned = cleaned.replace(/<[^>]+>/g, ' ');

  // 6. Remove common boilerplate / footer sections (e.g., Referensi, Daftar Pustaka, Catatan Kaki)
  const cutOffPatterns = [
    /\n\s*(##?\s*)?(Referensi|Daftar Pustaka|Catatan Kaki|External Links|Pranala Luar|Lihat Pula|See Also)[\s\S]*$/i,
    /\n\s*Share this:[\s\S]*$/i,
    /\n\s*Ikuti kami di[\s\S]*$/i,
    /\n\s*(Apakah artikel ini membantu|Bagikan artikel ini)[\s\S]*$/i,
    /\n\s*(Hak Cipta|Copyright)[\s\S]*$/i,
  ];
  for (const pattern of cutOffPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  // 7. Normalize line breaks and filter out header/menu/breadcrumb boilerplate
  cleaned = cleaned
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => {
      // Filter out empty lines, standalone symbols, or short navigation snippets
      if (!line) return false;
      if (/^[-=*_]{3,}$/.test(line)) return false; // horizontal rules
      if (
        /^(menu|navigasi|tampilan|tindakan|perkakas|bagikan|komentar|open main menu|daftar sekarang|cara bergabung|komunitas|kategori bantuan)$/i.test(
          line
        )
      ) {
        return false;
      }
      if (/^(kategori bantuan|kategori|bantuan|home|beranda)\s*[/›»>]/i.test(line)) return false; // breadcrumb line
      if (/^(ya\s*\|\s*tidak)$/i.test(line)) return false;
      return true;
    })
    .join('\n\n');

  return cleaned.trim();
};

/**
 * Uses Gemini AI to intelligently clean website noise (menus, breadcrumbs, footer junk)
 * and extract / summarize only the core substance into fluent, TTS-ready sentences.
 */
export const summarizeAndCleanArticleWithGemini = async (
  rawContent: string,
  rawTitle: string,
  targetUrl: string
): Promise<{ title: string; content: string }> => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    console.warn('Gemini API key is not configured, falling back to regex clean text.');
    return {
      title: rawTitle.trim() || 'Artikel Web',
      content: cleanExtractedText(rawContent),
    };
  }

  // Limit input size to prevent token overflow while preserving sufficient context
  const trimmed = rawContent.slice(0, 25000);

  const prompt = `Anda adalah asisten AI cerdas untuk platform aksesibilitas pendidikan inklusif Ablefy (Studio Pembaca Ramah Disleksia & Text-to-Speech).

URL Asal: ${targetUrl}
Judul Terdeteksi: ${rawTitle || 'Tidak ada'}

Berikut adalah teks mentah hasil ekstraksi dari halaman web/artikel:
"""
${trimmed}
"""

Tugas Anda:
1. BERSINKAN SELURUH ELEMEN PENGGANGGU:
   - Singkirkan menu navigasi website (misal: "Open main menu", tombol "Daftar", "Masuk", "Beranda", navbar header/sidebar).
   - Singkirkan remah roti / breadcrumbs (misal: "Kategori Bantuan / Panduan / Topik...").
   - Singkirkan formulir atau tombol interaksi (misal: "Apakah artikel ini membantu?", "Bagikan ke WhatsApp/Facebook", "Download Aplikasi", rating bintang).
   - Singkirkan teks promosi, iklan, disclaimer hak cipta (copyright), footer website, dan tautan artikel terkait.

2. AMBIL HANYA ISI INTI / SUBSTANSI MATERI UTAMA:
   - Ambil inti informasi, panduan, atau pembahasan materi pokok yang ada pada halaman tersebut.
   - Rangkum dan tata kembali informasi penting tersebut menjadi paragraf-paragraf yang mengalir secara alami, logis, dan terstruktur rapi dalam bahasa Indonesia yang baik dan baku.

3. OPTIMALKAN UNTUK PEMBACAAN SUARA (TEXT-TO-SPEECH):
   - Gunakan kalimat yang utuh dan jelas dengan tanda baca titik dan koma yang tepat.
   - Hindari simbol markdown berlebihan (jangan gunakan tanda pagar heading ###, bintang tebal berlebih **, atau garis pemisah ---).
   - Pisahkan antar-paragraf dengan baris baru ganda (\\n\\n).

4. JUDUL ARTIKEL:
   - Buatkan judul artikel yang bersih, ringkas, dan paling mewakili isi materi (jangan sertakan nama website, menu, atau slogan).

Format keluaran WAJIB berupa JSON valid:
{
  "title": "Judul Bersih dan Representatif",
  "content": "Teks isi materi yang telah dibersihkan dan dirangkum dalam beberapa paragraf mengalir..."
}`;

  const models = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (!res.ok) {
        continue;
      }

      const data = await res.json();
      const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawJson) continue;

      const cleanedJson = rawJson.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed = JSON.parse(cleanedJson);

      if (parsed.content && typeof parsed.content === 'string' && parsed.content.trim().length > 30) {
        return {
          title: (parsed.title || rawTitle || 'Artikel Web').trim(),
          content: parsed.content.trim(),
        };
      }
    } catch (err) {
      console.warn(`Model ${model} gagal memproses ekstraksi & rangkuman AI:`, err);
    }
  }

  // Graceful fallback to regex cleaned content if Gemini fails
  return {
    title: rawTitle.trim() || 'Artikel Web',
    content: cleanExtractedText(rawContent),
  };
};

/**
 * Normalizes user-input URL string
 */
export const normalizeUrl = (input: string): string => {
  let trimmed = input.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }
  return trimmed;
};

/**
 * Extracts article text, removes clutter, and summarizes core substance with Gemini AI
 */
export const extractArticleFromUrl = async (rawUrl: string): Promise<ExtractedArticle> => {
  const targetUrl = normalizeUrl(rawUrl);
  if (!targetUrl) {
    throw new Error('Tautan URL tidak valid atau kosong.');
  }

  let domainName = '';
  try {
    domainName = new URL(targetUrl).hostname.replace(/^www\./, '');
  } catch (_) {
    throw new Error('Format tautan URL tidak valid.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  // Strategy 1: Jina Reader API with JSON mode
  try {
    const jinaUrl = `https://r.jina.ai/${targetUrl}`;
    const res = await fetch(jinaUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      const rawContent = json?.data?.content || '';
      const rawTitle = json?.data?.title || '';

      if (rawContent && rawContent.length > 50) {
        if (isBlockedContent(rawContent)) {
          throw new Error(
            `Situs web ${domainName} membatasi akses otomatis (dilindungi sistem keamanan/login). Silakan buka artikel di browser, salin teksnya, lalu tempelkan di tab "Ketik / Tempel Teks".`
          );
        }

        const aiResult = await summarizeAndCleanArticleWithGemini(rawContent, rawTitle, targetUrl);
        const wordCount = aiResult.content.split(/\s+/).filter(Boolean).length;

        return {
          title: aiResult.title || `Artikel dari ${domainName}`,
          content: aiResult.content,
          sourceUrl: targetUrl,
          wordCount,
        };
      }
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('Waktu permintaan habis (timeout). Tautan membutuhkan waktu terlalu lama untuk merespons.');
    }
    if (err?.message?.includes('membatasi akses')) {
      throw err;
    }
    console.warn('Jina Reader JSON extraction failed, attempting fallback...', err);
  }

  // Strategy 2: Jina Reader Plain Text mode (Fallback)
  try {
    const fallbackController = new AbortController();
    const fallbackTimeout = setTimeout(() => fallbackController.abort(), 10000);

    const res = await fetch(`https://r.jina.ai/${targetUrl}`, {
      signal: fallbackController.signal,
    });
    clearTimeout(fallbackTimeout);

    if (res.ok) {
      const text = await res.text();
      let title = `Artikel dari ${domainName}`;
      let contentBody = text;

      // Check if text has "Title: ..." and "Markdown Content:"
      const titleMatch = text.match(/Title:\s*(.+)/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
      }

      const contentMatch = text.match(/Markdown Content:\s*([\s\S]+)/i);
      if (contentMatch && contentMatch[1]) {
        contentBody = contentMatch[1];
      }

      if (contentBody && contentBody.length > 50) {
        if (isBlockedContent(contentBody)) {
          throw new Error(
            `Situs web ${domainName} membatasi akses otomatis (dilindungi sistem keamanan/login). Silakan buka artikel di browser, salin teksnya, lalu tempelkan di tab "Ketik / Tempel Teks".`
          );
        }

        const aiResult = await summarizeAndCleanArticleWithGemini(contentBody, title, targetUrl);
        const wordCount = aiResult.content.split(/\s+/).filter(Boolean).length;

        return {
          title: aiResult.title || `Artikel dari ${domainName}`,
          content: aiResult.content,
          sourceUrl: targetUrl,
          wordCount,
        };
      }
    }
  } catch (err: any) {
    if (err?.message?.includes('membatasi akses')) {
      throw err;
    }
    console.warn('Jina Reader plain text extraction failed:', err);
  }

  // Strategy 3: AllOrigins CORS proxy with HTML extraction
  try {
    const proxyController = new AbortController();
    const proxyTimeout = setTimeout(() => proxyController.abort(), 8000);

    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(proxyUrl, { signal: proxyController.signal });
    clearTimeout(proxyTimeout);

    if (res.ok) {
      const json = await res.json();
      const html = json?.contents || '';

      if (html && html.length > 100) {
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // Extract title
        const title =
          doc.querySelector('title')?.innerText ||
          doc.querySelector('h1')?.innerText ||
          `Artikel dari ${domainName}`;

        // Remove script, style, nav, footer, header
        doc
          .querySelectorAll('script, style, nav, header, footer, noscript, svg, form, aside')
          .forEach((el) => el.remove());

        // Extract paragraphs from article or main body
        const container = doc.querySelector('article') || doc.querySelector('main') || doc.body;
        const paragraphs = Array.from(container.querySelectorAll('p, h2, h3, li'))
          .map((p) => p.textContent?.trim() || '')
          .filter((t) => t.length > 25);

        const joinedText = paragraphs.join('\n\n');

        if (joinedText && joinedText.length > 50) {
          if (isBlockedContent(joinedText)) {
            throw new Error(
              `Situs web ${domainName} membatasi akses otomatis (dilindungi sistem keamanan/login). Silakan buka artikel di browser, salin teksnya, lalu tempelkan di tab "Ketik / Tempel Teks".`
            );
          }

          const aiResult = await summarizeAndCleanArticleWithGemini(joinedText, title, targetUrl);
          const wordCount = aiResult.content.split(/\s+/).filter(Boolean).length;

          return {
            title: aiResult.title || `Artikel dari ${domainName}`,
            content: aiResult.content,
            sourceUrl: targetUrl,
            wordCount,
          };
        }
      }
    }
  } catch (err: any) {
    if (err?.message?.includes('membatasi akses')) {
      throw err;
    }
    console.warn('AllOrigins HTML proxy extraction failed:', err);
  }

  throw new Error(
    `Tidak dapat mengambil teks dari ${domainName}. Halaman mungkin memerlukan autentikasi login atau dibatasi oleh pemilik situs. Anda juga dapat menyalin-tempel teks artikel secara langsung di tab "Ketik / Tempel Teks".`
  );
};
