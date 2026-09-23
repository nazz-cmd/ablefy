import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

export default async function handler(req, res) {
  // CORS configuration for public deployment
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, voice = 'id-ID-GadisNeural', rate = 1.0 } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Parameter text diperlukan' });
    }

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    let rateString = '+0%';
    if (rate && rate !== 1.0) {
      const pct = Math.round((rate - 1.0) * 100);
      rateString = `${pct >= 0 ? '+' : ''}${pct}%`;
    }

    const { audioStream } = tts.toStream(text, { rate: rateString });
    const chunks = [];
    audioStream.on('data', (chunk) => chunks.push(chunk));
    audioStream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
      res.status(200).send(buffer);
    });
    audioStream.on('error', (err) => {
      res.status(500).json({ error: String(err) });
    });
  } catch (error) {
    res.status(500).json({ error: error?.message || 'Gagal mensintesis audio' });
  }
}
