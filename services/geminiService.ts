
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { generateSpeechQwen } from './qwenService';
import { GameBoardData, JudgmentResult, Difficulty, Clue, Module, LectureScript, ChatMessage } from "../types";
import { OFFLINE_BOARDS } from "../data/offlineBoards";

const BOARD_TOPICS = [
  "Artifacts & Correction",
  "Transducer Construction & Arrays",
  "Hemodynamics & Blood Flow",
  "Doppler Physics (Spectral, Color, Power)",
  "Resolution (Axial, Lateral, Elevational, Temporal)",
  "Bioeffects & Safety (ALARA, TI, MI)",
  "Instrumentation (Pulser, Receiver, Scan Converter)",
  "Sound Waves & Propagation",
  "Attentuation & Interaction",
  "Pulsed Wave Parameters"
];

// --- History Management ---
const getSeenHashes = (): Set<string> => {
  try {
    const saved = localStorage.getItem('echo_jeopardy_seen_boards');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
};

const markBoardSeen = (hash: string) => {
  const seen = getSeenHashes();
  seen.add(hash);
  localStorage.setItem('echo_jeopardy_seen_boards', JSON.stringify(Array.from(seen)));
};

const generateBoardHash = (board: GameBoardData): string => {
  // Create a signature based on the first clue of each category
  const signature = board.categories.map(c => c.title + c.clues[0]?.clueText).join('|');
  // Simple hash
  let hash = 0, i, chr;
  if (signature.length === 0) return hash.toString();
  for (i = 0; i < signature.length; i++) {
    chr = signature.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
};

declare global {
  interface Window {
    puter?: any;
  }
}

const getApiKey = (): string => {
  try {
    const saved = localStorage.getItem('echo_jeopardy_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";
    }
  } catch (e) { console.error("Error reading settings", e); }
  return import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";
};

const getAI = () => new GoogleGenAI({ apiKey: getApiKey() });

// ElevenLabs Config
const elevenLabs = new ElevenLabsClient({
  apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || "YOUR_ELEVENLABS_API_KEY"
});

const ELEVEN_LABS_VOICES: Record<string, string> = {
  'Charon': 'ErXwobaYiN019PkySvjV', // Antoni - Warm, American (Host)
  'Fenrir': 'TxGEqnHWrfWFTfGW9XjX', // Josh - Deep, Resonant (Hertz)
  'Orion': 'N2lVS1w4KdKDHITdn4Wq',   // Callam - Warm, Professional
  'Aoede': '21m00Tcm4TlvDq8ikWAM',  // Rachel - Warm, Narrative (Muse)
  'Kore': 'EXAVITQu4vr4xnSDxMaL',   // Bella - Soft, Kind (Polis)
};

// --- Persistent Audio Caching (IndexedDB) ---
const DB_NAME = 'EchoJeopardyCache';
const STORE_NAME = 'AudioCache';

const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const cacheAudio = async (key: string, data: string) => {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(data, key);
  } catch (e) { console.warn("Cache failed", e); }
};

const getCachedAudio = async (key: string): Promise<string | null> => {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch (e) { return null; }
};

// --- Helper Functions ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const processBoardData = (data: any): GameBoardData => {
  // Assign IDs and random Daily Doubles (1 or 2 per board)
  const totalClues = data.categories.length * 5;
  const ddCount = Math.random() > 0.5 ? 2 : 1;
  const ddIndices = new Set();
  while(ddIndices.size < ddCount) ddIndices.add(Math.floor(Math.random() * totalClues));

  let currentClueGlobalIdx = 0;
  data.categories.forEach((cat: any, cIdx: number) => {
    cat.id = `cat-${cIdx}`;
    cat.clues.forEach((clue: any, qIdx: number) => {
      clue.id = `clue-${cIdx}-${qIdx}`;
      clue.isAnswered = false;
      clue.isDailyDouble = ddIndices.has(currentClueGlobalIdx);
      currentClueGlobalIdx++;
    });
  });
  return data as GameBoardData;
};

const BOARD_CACHE: Record<Difficulty, GameBoardData[]> = {
  EASY: [],
  MEDIUM: [],
  HARD: []
};

const HINT_CACHE = new Map<string, string>();

// --- Hint Prefetching & Management ---

export const prefetchHints = async (board: GameBoardData) => {
  console.log("[Hints] Starting background hint prefetch...");
  const ai = getAI();
  const cluesToFetch: { id: string; text: string; answer: string }[] = [];

  // Gather clues that don't have hints cached
  board.categories.forEach(cat => {
    cat.clues.forEach(clue => {
      if (!HINT_CACHE.has(clue.id) && !HINT_CACHE.has(clue.clueText)) {
        cluesToFetch.push({ id: clue.id, text: clue.clueText, answer: clue.correctAnswer });
      }
    });
  });

  if (cluesToFetch.length === 0) return;

  // Process in batches of 3 to avoid rate limits
  const BATCH_SIZE = 3;
  for (let i = 0; i < cluesToFetch.length; i += BATCH_SIZE) {
    const batch = cluesToFetch.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (item) => {
        try {
            const prompt = `You are a helpful tutor. Provide a hint for this Ultrasound Physics jeopardy clue. 
            Clue: "${item.text}"
            Answer: "${item.answer}"
            Constraint: Do NOT reveal the answer. Give a subtle nudge or a related concept.
            Length: Max 1 sentence.`;
            
            const result = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: prompt
            });
            const hint = result.text;
            if (hint) {
              HINT_CACHE.set(item.id, hint);
              HINT_CACHE.set(item.text, hint);
            }
        } catch (e) {
            console.warn(`[Hints] Failed to gen hint for ${item.id}`, e);
        }
    }));
    // Small delay between batches
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log(`[Hints] Prefetch complete. Cached ${HINT_CACHE.size} hints.`);
};

export const getHint = async (clueText: string, clueId?: string, correctAnswer?: string): Promise<string> => {
    if (clueId && HINT_CACHE.has(clueId)) return HINT_CACHE.get(clueId)!;
    if (HINT_CACHE.has(clueText)) return HINT_CACHE.get(clueText)!;

    // Fallback: Generate on demand
    if (!correctAnswer) return "Consultancy uplink failed. Data corrupted.";
    
    try {
        const ai = getAI();
        const prompt = `You are a helpful tutor. Provide a hint for this Ultrasound Physics jeopardy clue. 
        Clue: "${clueText}"
        Answer: "${correctAnswer}"
        Constraint: Do NOT reveal the answer. Give a subtle nudge or a related concept.
        Length: Max 1 sentence.`;
        
        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt
        });
        const hint = result.text;
        if (hint) {
          if (clueId) HINT_CACHE.set(clueId, hint);
          HINT_CACHE.set(clueText, hint);
        }
        return hint || "No hint available.";
    } catch (e) {
        console.error("Hint gen failed", e);
        return "Signal interference. Unable to retrieve hint.";
    }
};

export const generateGameData = async (difficulty: Difficulty, attempt = 1): Promise<GameBoardData> => {
  const diffInstruction = difficulty === 'HARD' ? "Medical Physicist level" : difficulty === 'EASY' ? "Beginner level" : "SPI Registry level";
  
  // Randomize topic to ensure uniqueness
  const topic = BOARD_TOPICS[Math.floor(Math.random() * BOARD_TOPICS.length)];
  const systemPrompt = `Generate a Jeopardy board for Ultrasound Physics. 
  Difficulty: ${diffInstruction}. 
  Focus Theme: ${topic}.
  Ensure content is distinct and high quality.
  6 cats, 5 clues (200-1000). Valid JSON only.`;

  try {
    // Race against a 8-second timeout (slightly increased for better quality)
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 8000)
    );

    const apiPromise = getAI().models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: `Generate a unique ${difficulty} board focusing on ${topic}.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  clues: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        value: { type: Type.INTEGER },
                        clueText: { type: Type.STRING },
                        correctAnswer: { type: Type.STRING },
                      },
                      required: ["value", "clueText", "correctAnswer"],
                    },
                  },
                },
                required: ["title", "clues"],
              },
            },
          },
          required: ["categories"],
        },
      },
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);
    // @ts-ignore
    const data = JSON.parse(response.text);
    const processedBoard = processBoardData(data);

    // Check for duplicates
    const hash = generateBoardHash(processedBoard);
    const seen = getSeenHashes();
    if (seen.has(hash)) {
      console.warn(`[Duplicate Detected] Hash ${hash} already seen. Retrying... (Attempt ${attempt})`);
      if (attempt < 3) {
        return generateGameData(difficulty, attempt + 1);
      }
      // If we failed 3 times to find a unique one, just use this one (unlikely)
    }

    return processedBoard;

  } catch (error) {
    console.warn("Board generation failed or timed out. Using offline backup.", error);
    const backup = OFFLINE_BOARDS[Math.floor(Math.random() * OFFLINE_BOARDS.length)];
    const copy = JSON.parse(JSON.stringify(backup));
    return processBoardData(copy);
  }
};

export const prefetchBoards = async () => {
  const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];
  console.log("[Cache] Starting intelligent prefetch sequence...");
  
  difficulties.forEach(async (diff) => {
    // Target cache size: 3
    const targetSize = 3;
    const currentSize = BOARD_CACHE[diff].length;
    const needed = targetSize - currentSize;

    if (needed > 0) {
        console.log(`[Cache] Prefetching ${needed} boards for ${diff}...`);
        for (let i = 0; i < needed; i++) {
            // Stagger requests slightly to avoid rate limits
            await new Promise(r => setTimeout(r, i * 1500));
            generateGameData(diff).then(data => {
                BOARD_CACHE[diff].push(data);
                console.log(`[Cache] +1 ${diff} board ready. Total: ${BOARD_CACHE[diff].length}`);
            }).catch(e => console.warn(`[Cache] Failed to prefetch ${diff}`, e));
        }
    }
  });
};

export const generateExplanation = async (topic: string, context: string, mode: 'explain' | 'problem' | 'clinical' = 'explain'): Promise<string> => {
  const ai = getAI();
  let prompt = '';
  
  if (mode === 'explain') {
    prompt = `You are an expert Ultrasound Physics professor. Explain the concept of "${topic}" clearly and concisely. 
       Context: ${context}.
       Target Audience: Sonography student.
       Tone: Encouraging, educational, and slightly sci-fi (like a futuristic interface).
       Format: Keep it under 150 words. Use bullet points if helpful.`;
  } else if (mode === 'problem') {
    prompt = `You are an expert Ultrasound Physics professor. Create a practice word problem involving "${topic}".
       Context: ${context}.
       Requirement: Provide the problem scenario, given values, and ask for the solution. Do NOT provide the answer immediately.
       Format: 
       **Scenario**: [The clinical scenario]
       **Given**: [List of values]
       **Question**: [What to calculate]`;
  } else if (mode === 'clinical') {
    prompt = `You are a Senior Sonographer. Explain the clinical relevance of "${topic}".
       Definition: ${context}.
       Task: Provide a concrete example of how this concept affects daily scanning or image quality.
       Tone: Professional, practical, and mentoring.
       Format: Short paragraph (max 100 words).`;
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    return result.text || "No explanation available.";
  } catch (error) {
    console.error("Explanation generation failed", error);
    return "Neural Uplink Offline. Unable to retrieve data from the archive.";
  }
};

export const generateGame = async (difficulty: Difficulty, modules: Module[]): Promise<GameBoardData> => {
  if (BOARD_CACHE[difficulty].length > 0) {
      console.log(`[Cache Hit] Serving pre-generated ${difficulty} board.`);
      const board = BOARD_CACHE[difficulty].shift();
      
      // Mark as seen so we don't generate it again in the future
      markBoardSeen(generateBoardHash(board!));

      // Replenish in background if we dropped below 2
      if (BOARD_CACHE[difficulty].length < 2) {
          generateGameData(difficulty).then(data => BOARD_CACHE[difficulty].push(data));
      }
      return board!;
  }
  
  // Cache miss - fetch directly
  const board = await generateGameData(difficulty);
  markBoardSeen(generateBoardHash(board));
  
  // Start filling cache for next time
  generateGameData(difficulty).then(data => BOARD_CACHE[difficulty].push(data));
  
  return board;
};

export const judgeAnswer = async (
  clueText: string,
  correctAnswer: string,
  userAnswer: string
): Promise<JudgmentResult> => {
  const systemPrompt = `You are a strict but fair judge for an Ultrasound Physics competition.
Evaluate the user's answer against the correct one.
Return a 'scoreMultiplier' between -1.5 and 1.0.
- 1.0: Perfect match.
- 0.5 to 0.9: Partial credit for correct concepts with minor terminology errors.
- 0.0: Close but incorrect (No gain, no loss).
- -1.0: Standard Incorrect (Lose the clue value).
- -1.5: Critically incorrect or dangerous medical physics misunderstanding (Heavy penalty).

Provide 3 distinct character feedbacks:
1. Echo (Host): Professional, analytical, and technical.
2. Dr. Hertz (Celebrity): Grumpy, cynical, focuses on clinical precision or why the mistake is common/annoying.
3. Prof. Harvey (Mentor): Warm, explains the 'why' using a relatable physics analogy.
Return valid JSON.`;

  const response = await getAI().models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Clue: ${clueText}. Correct Answer: ${correctAnswer}. User Provided Answer: ${userAnswer}`,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isCorrect: { type: Type.BOOLEAN, description: "Whether the answer is technically 'Passing' (multiplier > 0)" },
          scoreMultiplier: { type: Type.NUMBER, description: "A multiplier from -1.5 to 1.0 to apply to the clue value." },
          celebrityComment: { type: Type.STRING },
          hostComment: { type: Type.STRING },
          harveyComment: { type: Type.STRING },
          correctAnswerExpanded: { type: Type.STRING },
        },
        required: ["isCorrect", "scoreMultiplier", "celebrityComment", "hostComment", "harveyComment", "correctAnswerExpanded"],
      },
    },
  });
  return JSON.parse(response.text) as JudgmentResult;
};

const cleanTextForSpeech = (text: string): string => {
  return text
    .replace(/\[.*?\]/g, '') // Remove [stage directions]
    .replace(/\*.*?\*/g, '') // Remove *actions*
    .replace(/\(.*?\)/g, '') // Remove (notes) - Optional, sometimes parens are spoken
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim();
};

// --- Static Audio Manifest Helper ---
let audioManifest: Record<string, string> | null = null;

const getStaticAudio = async (text: string): Promise<AudioBuffer | null> => {
  if (!audioManifest) {
    try {
      const res = await fetch('/audio_manifest.json');
      if (res.ok) {
        audioManifest = await res.json();
      } else {
        audioManifest = {};
      }
    } catch (e) {
      console.warn("Could not load audio manifest");
      audioManifest = {};
    }
  }

  const clean = cleanTextForSpeech(text);
  const msgBuffer = new TextEncoder().encode(clean);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const hash = hashHex.slice(0, 12);

  const filename = audioManifest?.[hash];
  if (filename) {
    try {
      // console.log(`[Static Audio Hit] ${filename}`);
      const audioRes = await fetch(`/audio/narrations/${filename}`);
      if (audioRes.ok) {
        const arrayBuffer = await audioRes.arrayBuffer();
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
        return await audioContext.decodeAudioData(arrayBuffer);
      }
    } catch (e) {
      console.warn(`Failed to load static audio for ${hash}`, e);
    }
  }
  return null;
};

const generateSpeechPuter = async (text: string): Promise<ArrayBuffer | null> => {
  if (!window.puter || !window.puter.ai) return null;
  // Check if user is signed in to avoid popup
  if (window.puter.auth && !window.puter.auth.isSignedIn()) {
      console.warn("Puter not signed in, skipping to fallback TTS");
      return null;
  }
  try {
      const audio = await window.puter.ai.txt2speech(text);
      if (audio && audio.src) {
           const response = await fetch(audio.src);
           return await response.arrayBuffer();
      }
      return null;
  } catch (e) {
      console.warn("Puter TTS failed", e);
      return null;
  }
};

export const generateSpeech = async (text: string, voiceName: string = "Aoede", volume: number = 1.0): Promise<AudioBuffer> => {
  // 0. Check Static Pre-generated Audio
  const staticAudio = await getStaticAudio(text);
  if (staticAudio) return staticAudio;

  // 1. Check Cache (IndexedDB)
  const cleanText = cleanTextForSpeech(text);
  if (!cleanText) return new AudioContext().createBuffer(1, 1, 44100); // Return silent buffer if empty

  // --- ElevenLabs Integration (High Priority) ---
  const elevenKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (elevenKey && elevenKey !== "YOUR_ELEVENLABS_API_KEY") {
      const cacheKey = `eleven:v2:${voiceName}:${cleanText.slice(0, 50)}`;
      const cached = await getCachedAudio(cacheKey);

      if (cached) {
        // console.log(`[Audio Cache Hit] ${voiceName}: ${text.slice(0, 20)}...`);
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
        return await decodeAudioData(decode(cached), audioContext, 44100, 1);
      }

      try {
        const voiceId = ELEVEN_LABS_VOICES[voiceName] || ELEVEN_LABS_VOICES['Aoede'];
        const audioStream = await elevenLabs.textToSpeech.convert(voiceId, {
          text: cleanText,
          modelId: 'eleven_multilingual_v2',
          outputFormat: 'mp3_44100_128'
        });

        // Handle stream to buffer conversion
        const chunks: Uint8Array[] = [];
        // @ts-ignore - ElevenLabs SDK types might not perfectly match browser streams
        for await (const chunk of audioStream) {
          chunks.push(new Uint8Array(chunk));
        }
        const combinedBuffer = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
        let offset = 0;
        for (const chunk of chunks) {
          combinedBuffer.set(chunk, offset);
          offset += chunk.length;
        }

        // Cache the successful generation
        let binary = '';
        const len = combinedBuffer.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(combinedBuffer[i]);
        }
        const base64Audio = btoa(binary);
        await cacheAudio(cacheKey, base64Audio);

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
        return await decodeAudioData(combinedBuffer, audioContext, 44100, 1);

      } catch (error) {
        console.warn("ElevenLabs failed, trying Qwen/Puter...", error);
      }
  }

  // --- Puter TTS Integration ---
  if (window.puter && window.puter.ai) {
     const puterCacheKey = `puter:${voiceName}:${cleanText.slice(0, 50)}`;
     const cachedPuter = await getCachedAudio(puterCacheKey);
     if (cachedPuter) {
         const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
         return await decodeAudioData(decode(cachedPuter), audioContext, 44100, 1);
     }
     
     const puterAudioData = await generateSpeechPuter(cleanText);
     if (puterAudioData) {
          const uint8Array = new Uint8Array(puterAudioData);
          let binary = '';
          const len = uint8Array.byteLength;
          for (let i = 0; i < len; i++) {
             binary += String.fromCharCode(uint8Array[i]);
          }
          const base64Audio = btoa(binary);
          await cacheAudio(puterCacheKey, base64Audio);
          
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
          return await audioContext.decodeAudioData(puterAudioData);
     }
  }
  // ---------------------------

  const cacheKey = `eleven:v2:${voiceName}:${cleanText.slice(0, 50)}`;
  // Note: We already checked cache for ElevenLabs above if key was present.
  // This check is redundant if key is present, but harmless.
  
  // --- Qwen TTS Integration ---
  if (import.meta.env.VITE_DASHSCOPE_API_KEY) {
    const qwenCacheKey = `qwen:v2:${voiceName}:${cleanText.slice(0, 50)}`;
    const cachedQwen = await getCachedAudio(qwenCacheKey);
    if (cachedQwen) {
       const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
       return await decodeAudioData(decode(cachedQwen), audioContext, 44100, 1);
    }

    const qwenAudioData = await generateSpeechQwen(cleanText, voiceName);
    if (qwenAudioData) {
         const uint8Array = new Uint8Array(qwenAudioData);
         let binary = '';
         const len = uint8Array.byteLength;
         for (let i = 0; i < len; i++) {
           binary += String.fromCharCode(uint8Array[i]);
         }
         const base64Audio = btoa(binary);
         await cacheAudio(qwenCacheKey, base64Audio);

         const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
         return await audioContext.decodeAudioData(qwenAudioData);
    }
  }
  // ---------------------------

  try {
    // Legacy fallback attempt if key wasn't valid above but somehow works here? 
    // Or just keeping the structure safe.
    if (!elevenKey || elevenKey === "YOUR_ELEVENLABS_API_KEY") {
       throw new Error("No ElevenLabs Key");
    }
    // ... logic moved up ...
    throw new Error("Already tried ElevenLabs");
  } catch (error) {
    // console.warn("ElevenLabs/Qwen failed, falling back to Browser TTS", error);
    
    // --- Browser TTS Fallback ---
    return new Promise<AudioBuffer>((resolve) => {
        const synth = window.speechSynthesis;
        
        // Wait for voices to load if they haven't yet
        const doSpeak = () => {
            const u = new SpeechSynthesisUtterance(cleanText);
            const voices = synth.getVoices();

            // Helper to find voice by name preference or gender
            const getVoice = (gender: 'male' | 'female', preferredNames: string[]) => {
                // Try exact matches first
                for (const name of preferredNames) {
                    const match = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
                    if (match) return match;
                }
                // Fallback to gender/generic
                if (gender === 'male') {
                    return voices.find(v => v.name.includes('Male') || v.name.includes('David') || v.name.includes('Daniel')) || voices[0];
                } else {
                    return voices.find(v => v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Victoria')) || voices[0];
                }
            };

            let targetVoice = null;
            let pitch = 1.0;
            let rate = 1.0;

            switch (voiceName) {
                case 'Charon': // Host - The Guide
                    // Prioritize natural sounding voices
                    targetVoice = getVoice('male', ['Google US English', 'Daniel', 'Microsoft David', 'Samantha']);
                    pitch = 1.0; // Natural pitch (0.7 was too robotic)
                    rate = 1.0;  // Normal speed
                    break;
                case 'Fenrir': // Hertz - Grumpy, Stern, Old Physics Prof
                    targetVoice = getVoice('male', ['Google UK English Male', 'Microsoft Mark', 'Fred']);
                    pitch = 0.6; // Very deep
                    rate = 1.05; // Slightly faster (impatient)
                    break;
                case 'Orion': // Harvey - Enthusiastic, Young
                    targetVoice = getVoice('male', ['Alex', 'Google US English', 'Microsoft Zira']); 
                    pitch = 1.2; // Higher pitch
                    rate = 1.15; // Fast, excited
                    break;
                case 'Kore': // Polis - Logical AI, Cold
                    targetVoice = getVoice('female', ['Samantha', 'Google US English', 'Microsoft Zira']);
                    pitch = 1.4; // Slightly unnatural high pitch
                    rate = 0.95; // Precise
                    break;
                case 'Aoede': // Narrator - Smooth, Muse
                default:
                    targetVoice = getVoice('female', ['Victoria', 'Google UK English Female', 'Microsoft Zira']);
                    pitch = 1.0;
                    rate = 0.9;
                    break;
            }

            u.voice = targetVoice || voices[0];
            u.pitch = pitch;
            u.rate = rate;
            u.volume = volume; // Use provided volume

            // Sync Hack: Create a silent buffer that approximates the duration of the speech
            // Average speaking rate: ~10 characters per second (slower for better readability)
            const estimatedDuration = Math.max(4, cleanText.length / 5) + 2;
            const sampleRate = 44100;
            const frames = Math.ceil(estimatedDuration * sampleRate);
            
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const silentBuffer = ctx.createBuffer(1, frames, sampleRate); 
            
            // Play the TTS
            console.log(`[Browser TTS] Speaking: "${cleanText}" with voice ${u.voice?.name}`);
            synth.cancel(); // Clear any pending speech
            synth.speak(u);
            
            resolve(silentBuffer);
        };

        if (synth.getVoices().length === 0) {
            synth.onvoiceschanged = doSpeak;
        } else {
            doSpeak();
        }
    });
  }
};

const generateSpeechGemini = async (text: string, voiceName: string): Promise<AudioBuffer> => {
  const cacheKey = `${voiceName}:${text.slice(0, 50)}`;
  const cached = await getCachedAudio(cacheKey);

  let base64Audio = cached;
  if (!base64Audio) {
    const response = await getAI().models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: { parts: [{ text }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
      },
    });
    base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    if (base64Audio) await cacheAudio(cacheKey, base64Audio);
  }

  if (!base64Audio) throw new Error("No audio generated");
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  return await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
};

export const generateCourseOutline = async (): Promise<Module[]> => {
  const response = await getAI().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Generate a comprehensive SPI (Sonography Principles & Instrumentation) course outline. Focus on: 1. Math & Basic Physics, 2. Pulsed Sound, 3. Transducers, 4. Hemodynamics & Doppler, 5. Artifacts & Resolution, 6. QA & Bioeffects. Return valid JSON.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            topics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["id", "title", "description"],
              },
            },
          },
          required: ["id", "title", "topics"],
        },
      },
    },
  });
  return JSON.parse(response.text) as Module[];
};

export const generateLectureScript = async (topicId: string, topicTitle: string): Promise<LectureScript> => {
  const AVAILABLE_VISUALS = [
    'AXIAL_RES', 'DOPPLER_FLOW', 'PULSE_ECHO', 'BEAM_PROFILE', 
    'NYQUIST_LIMIT', 'ATTENUATION', 'TRANSDUCER_ARRAY'
  ];
  
  const prompt = `Create a cinematic, high-stakes briefing on "${topicTitle}" for an elite Ultrasound operative (The User).
  The narrative script should be immersive, using "The Guide" persona (calm, authoritative, slightly sci-fi). 
  - Avoid generic "Welcome students" intros. 
  - Dive straight into the physics with urgency and precision. 
  - Use short, punchy sentences.
  - Explain the concept as if it's a critical mission parameter.
  
Available Visual IDs: ${AVAILABLE_VISUALS.join(', ')}. Select the most relevant one for 'visualId', or null if none fit.
For assessment questions, provide 4 options and the index (0-3) of the correct one.
Return valid JSON with the specified schema.`;

  const response = await getAI().models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topicId: { type: Type.STRING },
          topicTitle: { type: Type.STRING },
          quantifiedEffort: { type: Type.STRING },
          timeSavedHours: { type: Type.NUMBER },
          learningEffortMinutes: { type: Type.STRING },
          roadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
          contrastSection: { type: Type.STRING },
          narrativeScript: { type: Type.STRING },
          visualId: { type: Type.STRING, enum: [...AVAILABLE_VISUALS, ""] },
          visualInterpretation: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                observation: { type: Type.STRING },
                significance: { type: Type.STRING }
              }
            }
          },
          clinicalDemo: {
             type: Type.ARRAY,
             items: {
               type: Type.OBJECT,
               properties: {
                 probeMovement: { type: Type.STRING },
                 expectedOutcome: { type: Type.STRING }
               }
             }
          },
          analogy: { type: Type.STRING },
          mnemonic: {
            type: Type.OBJECT,
            properties: {
              acronym: { type: Type.STRING },
              meaning: { type: Type.STRING }
            }
          },
          holyShitInsight: { type: Type.STRING },
          psychologicalBarrier: { type: Type.STRING },
          assessmentQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswerIndex: { type: Type.INTEGER },
                answer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  const data = JSON.parse(response.text);
  data.topicId = topicId;
  return data as LectureScript;
};

export const generateHeckle = async (value: number, playerName: string): Promise<string> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The player ${playerName} just selected a $${value} ultrasound physics clue. Give a short, grumpy, medically-accurate heckle as Dr. Hertz. Do not include stage directions or actions. Just the spoken text.`,
  });
  return response.text || "Good luck, you'll need it.";
};

export const generateIntroTheme = async (difficulty: string, playerName: string): Promise<string> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Give a welcoming, slightly robotic, but grand cinematic intro to the Jeopardy game for operator ${playerName} starting a ${difficulty} difficulty board. Do not include stage directions. Spoken words only.`,
  });
  return response.text || "Welcome to the Neural Link.";
};

export const generateSingleClue = async (): Promise<Clue> => {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Generate a single challenging ultrasound physics clue for a fastest-finger round. Return valid JSON.',
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.INTEGER },
            clueText: { type: Type.STRING },
            correctAnswer: { type: Type.STRING },
          },
          required: ["value", "clueText", "correctAnswer"],
        },
      },
    });
    const data = JSON.parse(response.text);
    return { ...data, id: `single-${Date.now()}`, isAnswered: false } as Clue;
  } catch (e) {
    console.warn("Single clue generation failed. Using fallback.", e);
    // Fallback to a random clue from offline boards
    const randomCategory = OFFLINE_BOARDS[0].categories[Math.floor(Math.random() * OFFLINE_BOARDS[0].categories.length)];
    const randomClue = randomCategory.clues[Math.floor(Math.random() * randomCategory.clues.length)];
    return {
      id: `single-${Date.now()}`,
      value: randomClue.value,
      clueText: randomClue.clueText,
      correctAnswer: randomClue.correctAnswer,
      isAnswered: false,
      isDailyDouble: false
    };
  }
};

export const generateFinalJeopardyClue = async (difficulty: Difficulty): Promise<{ category: string, clue: Clue }> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a Final Jeopardy category and clue for Ultrasound Physics. Difficulty: ${difficulty}. Return valid JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          clue: {
            type: Type.OBJECT,
            properties: {
              clueText: { type: Type.STRING },
              correctAnswer: { type: Type.STRING },
            },
            required: ["clueText", "correctAnswer"],
          },
        },
        required: ["category", "clue"],
      },
    },
  });
  const data = JSON.parse(response.text);
  return {
    category: data.category,
    clue: { ...data.clue, id: 'final-jeopardy', value: 0, isAnswered: false } as Clue,
  };
};

export const startStudyBuddyChat = (history: any) => {
  return getAI().chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are Professor Harvey, a highly energetic, upbeat, and fun mentor for Ultrasound Physics students. Think of yourself as a cool, high-tech guide helping students ace the SPI Registry exam. Use exciting analogies, keep the tone enthusiastic, and make complex physics concepts feel like a fun puzzle. Always be encouraging and use a touch of sci-fi flair.",
    },
  });
};