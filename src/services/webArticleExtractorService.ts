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
/**
 * Clean and format raw extracted markdown/HTML content into TTS-ready sentences.
 * Purges navigation menus, header links, search bars, editorial boilerplate, and ads.
 */
export const cleanExtractedText = (rawText: string): string => {
  if (!rawText) return '';

  let cleaned = rawText;

  // 1. Remove Markdown images: ![alt](url)
  cleaned = cleaned.replace(/!\[.*?\]\(.*?\)/g, '');

  // 2. Remove empty Markdown links: [](url) or [ ](url)
  cleaned = cleaned.replace(/\[\s*\]\([^)]*\)/g, '');

  // 3. Convert standard Markdown links: [anchor text](url) -> anchor text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 4. Remove standalone URLs (e.g., (https://...) or raw http:// links)
  cleaned = cleaned.replace(/\(https?:\/\/[^\s)]+\)/g, '');
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '');

  // 5. Remove Wikipedia and news citation markers: [[1]], [1], [2a], [↑], etc.
  cleaned = cleaned.replace(/\[\[?\d+[a-z]?\]?\]/gi, '');
  cleaned = cleaned.replace(/\[↑\]/g, '');

  // 6. Remove Jina / Scraper metadata headers
  cleaned = cleaned.replace(/^(Title|URL Source|Markdown Content|Published Time|Author|Feed|Source):\s*.+$/gim, '');

  // 7. Remove Markdown formatting symbols (#, `, ~, headings)
  cleaned = cleaned.replace(/#{1,6}\s+/g, '');
  cleaned = cleaned.replace(/`{1,3}(.*?)`{1,3}/g, '$1');

  // 8. Remove HTML tags if present
  cleaned = cleaned.replace(/<[^>]+>/g, ' ');

  // 9. Cut off common footer/editorial sections
  const cutOffPatterns = [
    /\n\s*(##?\s*)?(Referensi|Daftar Pustaka|Catatan Kaki|External Links|Pranala Luar|Lihat Pula|See Also|Artikel Terkait|Berita Terkait)[\s\S]*$/i,
    /\n\s*(BACA JUGA|SIMAK JUGA|PILIHAN EDITOR|EDITOR'S PICK|TRENDING TOPIK)[\s\S]*$/i,
    /\n\s*(Share this|Bagikan artikel|Ikuti kami|Komentar|Laporkan konten)[\s\S]*$/i,
    /\n\s*(Hak Cipta|Copyright|All rights reserved|Semua Hak Dilindungi)[\s\S]*$/i,
  ];
  for (const pattern of cutOffPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  // 10. Split into lines and filter out noisy navigation / menu bars
  const rawLines = cleaned.split('\n');
  const validParagraphs: string[] = [];

  for (let line of rawLines) {
    line = line.trim();
    if (!line) continue;

    // Discard horizontal rules or repetitive symbols
    if (/^[-=*_#]{3,}$/.test(line)) continue;

    // Discard lines that contain high-density asterisk navigation menus
    // e.g. "* Masuk bola CARI Pencarian Terpopuler * Persib... * Home * BRI Super League..."
    const asteriskCount = (line.match(/\*/g) || []).length;
    if (asteriskCount >= 3) continue;

    // Discard lines with pipe-separated navigation: "Home | Berita | Olahraga | Jadwal"
    const pipeCount = (line.match(/\|/g) || []).length;
    if (pipeCount >= 3) continue;

    // Discard editorial promo / callout lines
    if (
      /^(baca juga|simak juga|baca selanjutnya|pilihan editor|artikel terkait|foto:|video:|penulis:|editor:|sumber:|grafis:|infografis:|tag:|topik terkait):?/i.test(
        line
      )
    ) {
      continue;
    }

    // Discard navigation, breadcrumb, and button fragments
    if (
      /^(menu|navigasi|tampilan|tindakan|perkakas|bagikan|komentar|cari|search|open main menu|daftar sekarang|masuk|login|home|beranda|klasemen|jadwal|skor langsung|live score|newsletter|unduh aplikasi)$/i.test(
        line
      )
    ) {
      continue;
    }

    // Discard short link breadcrumb fragments
    if (/^(kategori bantuan|kategori|bantuan|home|beranda)\s*[/›»>]/i.test(line)) continue;
    if (/^(ya\s*\|\s*tidak)$/i.test(line)) continue;

    // Strip lingering asterisks or list bullets from the start of real paragraphs
    line = line.replace(/^[*•\-\d.]+\s*/, '').trim();

    // Clean inline excessive bold/italic asterisks: **text** -> text
    line = line.replace(/[*_]{1,3}(.*?)[*_]{1,3}/g, '$1').trim();

    // Only keep lines with substantial narrative content (at least 20 chars with letters)
    if (line.length >= 20 && /[a-zA-Z]{3,}/.test(line)) {
      validParagraphs.push(line);
    }
  }

  // Join into clean paragraphs
  let result = validParagraphs.join('\n\n').trim();

  // Final cleanup: condense multiple whitespace/newlines
  result = result.replace(/[ \t]{2,}/g, ' ');
  result = result.replace(/\n{3,}/g, '\n\n');

  return result;
};

/**
 * Uses Gemini AI to intelligently clean website noise (menus, breadcrumbs, footer junk)
 * and summarize only the core substance into fluent, TTS-ready sentences.
 */
export const summarizeAndCleanArticleWithGemini = async (
  rawContent: string,
  rawTitle: string,
  targetUrl: string
): Promise<{ title: string; content: string }> => {
  // First, apply our deterministic cleaner to strip obvious scraping junk
  const preCleaned = cleanExtractedText(rawContent);

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return {
      title: rawTitle.trim() || 'Rangkuman Artikel Web',
      content: preCleaned || cleanExtractedText(rawContent),
    };
  }

  // Limit input size to prevent token overflow while preserving sufficient context
  const trimmed = (preCleaned || rawContent).slice(0, 20000);

  const prompt = `Anda adalah asisten AI cerdas untuk platform aksesibilitas pendidikan inklusif Ablefy (Studio Pembaca Ramah Disleksia & Text-to-Speech).

URL Asal: ${targetUrl}
Judul Terdeteksi: ${rawTitle || 'Tidak ada'}

Berikut adalah teks hasil ekstraksi dari artikel web/berita:
"""
${trimmed}
"""

Tugas Anda:
1. BERSIHKAN TOTAL DARI SISA MENU ATAU LINK:
   - Buang semua sisa menu navigasi, iklan, promosi, nama-nama kolom menu berita, dan link terkait.
2. RANGKUM DAN TATA MENJADI NASKAH BACAAN YANG FASIH:
   - Ambil fakta, poin-poin utama, dan inti narasi berita/artikel ini.
   - Susun kembali menjadi 3-5 paragraf naratif yang mengalir, alami, jelas, dan enak didengar ketika dibacakan oleh Text-to-Speech (TTS).
   - Gunakan bahasa Indonesia yang baik, lugas, dan baku.
3. BUATKAN JUDUL YANG AKURAT DAN BERSIH:
   - Buat judul berita/artikel yang ringkas, representatif, dan tanpa embel-embel nama situs web.

Format keluaran WAJIB berupa JSON valid:
{
  "title": "Judul Bersih dan Representatif",
  "content": "Isi rangkuman naratif artikel dalam beberapa paragraf yang dipisahkan dengan garis baru ganda..."
}`;

  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];

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
          title: (parsed.title || rawTitle || 'Rangkuman Artikel Web').trim(),
          content: parsed.content.trim(),
        };
      }
    } catch (err) {
      console.warn(`Model ${model} gagal memproses ekstraksi & rangkuman AI:`, err);
    }
  }

  // Graceful fallback to preCleaned content if Gemini calls fail
  return {
    title: rawTitle.trim() || 'Rangkuman Artikel Web',
    content: preCleaned || cleanExtractedText(rawContent),
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
