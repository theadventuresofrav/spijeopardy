
const API_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const API_KEY = import.meta.env.VITE_DASHSCOPE_API_KEY || "";

// Mapping of internal voice names to Qwen voice IDs (if applicable) or just pass through
// Qwen voices: Cherry, Ethan, Nofish, Jennifer, Ryan, Katerina, Elias, Jada, Dylan, Sunny, Li, Marcus, Roy, Peter, Rocky, Kiki, Eric
export const QWEN_VOICES: Record<string, string> = {
  'Charon': 'Ethan', // Deep/Authoritative mapping
  'Fenrir': 'Rocky', // Rough/Strong?
  'Orion': 'Ryan',   // Professional
  'Aoede': 'Cherry', // Female/Narrator
  'Host': 'Ethan',
  'Dr. Hertz': 'Marcus', // Older/Grumpy?
  'Polis': 'Katerina', // Analytical/AI
  'Kore': 'Katerina',
};

export const generateSpeechQwen = async (text: string, voiceName: string = 'Charon'): Promise<ArrayBuffer | null> => {
  if (!API_KEY) {
    // console.warn("Qwen/DashScope API Key is missing.");
    return null;
  }

  const qwenVoice = QWEN_VOICES[voiceName] || 'Cherry';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'X-DashScope-WorkSpace': 'modal',
      },
      body: JSON.stringify({
        model: "qwen3-tts-flash",
        input: {
          text: text,
          voice: qwenVoice,
          language_type: "English"
        },
        parameters: {
            "format": "mp3",
            "sample_rate": 44100
        }
      })
    });

    if (!response.ok) {
        // Silent fail to allow fallback
        return null;
    }

    const contentType = response.headers.get('content-type');
    let audioData: ArrayBuffer;

    if (contentType && contentType.includes('application/json')) {
        const json = await response.json();
        if (json.output && json.output.audio_url) {
            const audioRes = await fetch(json.output.audio_url);
            audioData = await audioRes.arrayBuffer();
        } else {
             return null;
        }
    } else {
        audioData = await response.arrayBuffer();
    }

    return audioData;

  } catch (e) {
    console.error("Qwen TTS generation failed:", e);
    return null;
  }
};
