
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

// --- Configuration ---
const OUTPUT_DIR = './public/audio/narrations';
const MANIFEST_PATH = './public/audio_manifest.json';
const VOICE_ID = 'iWP0zWXsAkUmG0R4IMeO'; // The requested voice
const FALLBACK_VOICE_ID = '2EiwWnXFnvU5JabPnv8n'; // Clyde

// Load Env
let apiKey = process.env.VITE_ELEVENLABS_API_KEY;
let dashScopeKey = process.env.VITE_DASHSCOPE_API_KEY;

if (!apiKey || !dashScopeKey) {
  try {
    const envFile = fs.readFileSync('.env.local', 'utf-8');
    
    if (!apiKey) {
      const match = envFile.match(/VITE_ELEVENLABS_API_KEY=(.*)/);
      if (match) apiKey = match[1].trim().replace(/["']/g, '');
    }
    
    if (!dashScopeKey) {
      const match = envFile.match(/VITE_DASHSCOPE_API_KEY=(.*)/);
      if (match) dashScopeKey = match[1].trim().replace(/["']/g, '');
    }
  } catch (e) {
    console.warn("Could not read .env.local");
  }
}

const client = apiKey ? new ElevenLabsClient({ apiKey }) : null;

// --- Helpers ---
const generateQwen = async (text, filePath) => {
  if (!dashScopeKey) throw new Error("No DashScope Key");
  
  const response = await fetch("https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${dashScopeKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-WorkSpace': 'modal',
      },
      body: JSON.stringify({
        model: "qwen3-tts-flash",
        input: {
          text: text,
          voice: "Ethan", 
          language_type: "English"
        },
        parameters: { "format": "mp3", "sample_rate": 44100 }
      })
    });

    if (!response.ok) {
        const txt = await response.text();
        throw new Error(`Qwen API Error: ${response.status} ${txt}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
         const json = await response.json();
         if (json.output && json.output.audio_url) {
             const audioRes = await fetch(json.output.audio_url);
             const buffer = await audioRes.arrayBuffer();
             fs.writeFileSync(filePath, Buffer.from(buffer));
         } else {
             throw new Error("Invalid Qwen response");
         }
    } else {
         const buffer = await response.arrayBuffer();
         fs.writeFileSync(filePath, Buffer.from(buffer));
    }
};

const cleanTextForSpeech = (text) => {
  return text
    .replace(/\[.*?\]/g, '') // Remove [stage directions]
    .replace(/\*.*?\*/g, '') // Remove *actions*
    .replace(/\(.*?\)/g, '') // Remove (notes)
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim();
};

const getHash = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 12);
};

// --- Extractors ---
const extractFromPromo = () => {
  try {
    const content = fs.readFileSync('components/PromoScene.tsx', 'utf-8');
    const matches = [...content.matchAll(/text:\s*"(.*?)"/g)];
    return matches.map(m => m[1]);
  } catch (e) {
    console.error("Failed to read PromoScene", e);
    return [];
  }
};

const extractFromCourseData = () => {
  try {
    const content = fs.readFileSync('data/spiCourseData.ts', 'utf-8');
    const matches = [...content.matchAll(/"narrativeScript":\s*"(.*?)"/g)];
    return matches.map(m => m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'));
  } catch (e) {
    console.error("Failed to read CourseData", e);
    return [];
  }
};

const writeStream = async (stream, filePath) => {
  const fileStream = fs.createWriteStream(filePath);
  for await (const chunk of stream) {
    fileStream.write(chunk);
  }
  fileStream.end();
};

// --- Main ---
const main = async () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const promoTexts = extractFromPromo();
  const courseTexts = extractFromCourseData();
  const allTexts = [...new Set([...promoTexts, ...courseTexts])];

  console.log(`Found ${allTexts.length} unique narration segments.`);

  let manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  }

  for (const text of allTexts) {
    const clean = cleanTextForSpeech(text);
    if (!clean) continue;

    const hash = getHash(clean);
    const filename = `${hash}.mp3`;
    const filePath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(filePath)) {
      console.log(`[Skip] ${filename} exists for: "${clean.slice(0, 30)}..."`);
      manifest[hash] = filename;
      continue;
    }

    try {
      console.log(`[Generating] ${filename} ...`);

      if (dashScopeKey) {
          try {
              console.log(`Using Qwen3 TTS (Voice: Ethan)...`);
              await generateQwen(clean, filePath);
              manifest[hash] = filename;
              await new Promise(r => setTimeout(r, 200)); // Slight delay for rate limit
              continue;
          } catch (qwenErr) {
              console.error(`Qwen failed for "${clean.slice(0, 20)}...":`, qwenErr.message);
              if (!client) throw qwenErr; // Rethrow if no fallback
              console.log("Falling back to ElevenLabs...");
          }
      }

      if (!client) throw new Error("No available TTS provider (Check keys)");

      const audioStream = await client.textToSpeech.convert(VOICE_ID, {
        text: clean,
        model_id: 'eleven_multilingual_v2',
        output_format: 'mp3_44100_128'
      });
      await writeStream(audioStream, filePath);
      manifest[hash] = filename;
    } catch (e) {
      if (e.statusCode === 401 || e?.body?.detail?.status === 'famous_voice_not_permitted') {
        console.warn(`[Warning] Voice ${VOICE_ID} not permitted. Falling back to ${FALLBACK_VOICE_ID}.`);
        try {
          const audioStream = await client.textToSpeech.convert(FALLBACK_VOICE_ID, {
            text: clean,
            model_id: 'eleven_multilingual_v2',
            output_format: 'mp3_44100_128'
          });
          await writeStream(audioStream, filePath);
          manifest[hash] = filename;
        } catch (e2) {
          console.error(`[Error] Fallback failed for: "${clean.slice(0, 20)}..."`, e2.message);
        }
      } else {
        console.error(`[Error] Failed to generate for: "${clean.slice(0, 20)}..."`, e.message);
      }
    }
    
    await new Promise(r => setTimeout(r, 500)); 
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log("Manifest updated.");
};

main();
