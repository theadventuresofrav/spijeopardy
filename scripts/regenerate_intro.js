
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

// --- Configuration ---
const OUTPUT_DIR = './public/audio/narrations';
const MANIFEST_PATH = './public/audio_manifest.json';

// Target Voice (Requested by User)
const TARGET_VOICE_ID = 'iWP0zWXsAkUmG0R4IMeO'; 

// Standard Free Voices
const VOICES = {
    HOST: '2EiwWnXFnvU5JabPnv8n', // Clyde (Deep, Male)
    HERTZ: '21m00Tcm4TlvDq8ikWAM', // Rachel (Clear, Female)
    PLAYER: 'ErXwobaYiN019PkySvjV', // Antoni (Standard, Male)
    DEFAULT: '2EiwWnXFnvU5JabPnv8n'
};

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
const generateQwen = async (text, filePath, voiceName = "Ethan") => {
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
          voice: voiceName, 
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
    .replace(/\[.*?\]/g, '') 
    .replace(/\*.*?\*/g, '') 
    .replace(/\(.*?\)/g, '') 
    .replace(/\s+/g, ' ')    
    .trim();
};

const getHash = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 12);
};

// --- Extractors ---
const extractFromPromo = () => {
  try {
    const content = fs.readFileSync('components/PromoScene.tsx', 'utf-8');
    // Match text and speaker
    const matches = [...content.matchAll(/speaker:\s*'(.*?)'[\s\S]*?text:\s*"(.*?)"/g)];
    return matches.map(m => ({ speaker: m[1], text: m[2] }));
  } catch (e) {
    console.error("Failed to read PromoScene", e);
    return [];
  }
};

const extractFromIntro = () => {
  try {
    const content = fs.readFileSync('components/CinematicIntro.tsx', 'utf-8');
    const matches = [...content.matchAll(/speaker:\s*'(.*?)'[\s\S]*?text:\s*"(.*?)"/g)];
    return matches.map(m => ({ speaker: m[1], text: m[2] }));
  } catch (e) {
    console.error("Failed to read CinematicIntro", e);
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

  const promoLines = extractFromPromo();
  const introLines = extractFromIntro();
  const allLines = [...promoLines, ...introLines]; // Duplicates might exist but hash handles it

  console.log(`Found ${allLines.length} intro/promo segments to regenerate.`);

  let manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  }

  for (const line of allLines) {
    const clean = cleanTextForSpeech(line.text);
    if (!clean) continue;

    const hash = getHash(clean);
    const filename = `${hash}.mp3`;
    const filePath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(filePath)) {
      console.log(`[Deleting Old] ${filename} ...`);
      fs.unlinkSync(filePath);
    }

    try {
      console.log(`[Generating] ${filename} (${line.speaker}) for: "${clean.slice(0, 30)}..."`);

      // Qwen Logic
      if (dashScopeKey) {
          let qwenVoice = "Ethan";
          if (line.speaker === 'HERTZ') qwenVoice = "Cherry";
          
          try {
              console.log(`Using Qwen3 TTS (Voice: ${qwenVoice})...`);
              await generateQwen(clean, filePath, qwenVoice);
              manifest[hash] = filename;
              await new Promise(r => setTimeout(r, 500)); 
              continue;
          } catch (qwenErr) {
              console.error(`Qwen failed:`, qwenErr.message);
          }
      }

      // ElevenLabs Logic
      if (!client) throw new Error("No available TTS provider");

      let voiceId = TARGET_VOICE_ID;
      
      try {
          // Try Requested Voice First
          const audioStream = await client.textToSpeech.convert(voiceId, {
            text: clean,
            model_id: 'eleven_multilingual_v2',
            output_format: 'mp3_44100_128'
          });
          await writeStream(audioStream, filePath);
          manifest[hash] = filename;
          
      } catch (e) {
          // Check for Restriction/Auth Errors
          const errStr = JSON.stringify(e);
          if (errStr.includes("famous_voice_not_permitted") || e.statusCode === 401 || errStr.includes("401")) {
             
             // FALLBACK
             voiceId = VOICES[line.speaker] || VOICES.DEFAULT;
             console.log(`[Fallback] Target voice failed. Using ${voiceId} (${line.speaker})...`);
             
             const audioStream = await client.textToSpeech.convert(voiceId, {
                text: clean,
                model_id: 'eleven_multilingual_v2',
                output_format: 'mp3_44100_128'
             });
             await writeStream(audioStream, filePath);
             manifest[hash] = filename;
          } else {
              throw e; // Rethrow other errors
          }
      }

    } catch (e) {
      console.error(`[Error] Failed to generate:`, e.message);
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log("Manifest updated.");
};

main();
