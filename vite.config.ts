import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

function edgeTtsDevPlugin(): Plugin {
  return {
    name: 'edge-tts-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/tts', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { text, voice = 'id-ID-GadisNeural', rate = 1.0 } = JSON.parse(body || '{}');
              if (!text || !text.trim()) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Parameter text diperlukan' }));
                return;
              }

              const tts = new MsEdgeTTS();
              await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

              let rateString = '+0%';
              if (rate && rate !== 1.0) {
                const pct = Math.round((rate - 1.0) * 100);
                rateString = `${pct >= 0 ? '+' : ''}${pct}%`;
              }

              const { audioStream } = tts.toStream(text, { rate: rateString });
              const chunks: Buffer[] = [];
              audioStream.on('data', (chunk: Buffer) => chunks.push(chunk));
              audioStream.on('end', () => {
                const buffer = Buffer.concat(chunks);
                res.setHeader('Content-Type', 'audio/mpeg');
                res.setHeader('Cache-Control', 'public, max-age=86400');
                res.statusCode = 200;
                res.end(buffer);
              });
              audioStream.on('error', (err) => {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: String(err) }));
              });
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'Gagal mensintesis audio' }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method not allowed');
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    edgeTtsDevPlugin()
  ],
});
