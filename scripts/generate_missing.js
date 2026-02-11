
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. Load API Key
const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = '';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
  if (match) apiKey = match[1].trim();
}

if (!apiKey) {
  console.error("No API Key found in .env.local");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// 2. Define Course Structure
const MODULES = [
  { id: "m1", topics: ["t1-1", "t1-2", "t1-3"] },
  { id: "m2", topics: ["t2-1", "t2-2", "t2-3"] },
  { id: "m3", topics: ["t3-1"] },
  { id: "m4", topics: ["t4-1", "t4-2", "t4-3"] },
  { id: "m5", topics: ["t5-1", "t5-2", "t5-3", "t5-4", "t5-5"] },
  { id: "m6", topics: ["t6-1", "t6-2"] },
  { id: "m7", topics: ["t7-1", "t7-2"] },
  { id: "m8", topics: ["t8-1", "t8-2"] },
  { id: "m9", topics: ["t9-1", "t9-2"] },
  { id: "m10", topics: ["t10-1", "t10-2"] },
  { id: "m11", topics: ["t11-1"] }
];

const TOPIC_TITLES = {
  "t1-1": "Introduction to Waves", "t1-2": "Essential Wave Parameters", "t1-3": "Interaction with Media",
  "t2-1": "Components & Piezoelectric Effect", "t2-2": "Array Types", "t2-3": "Beam Focusing",
  "t3-1": "The Pulse-Echo Principle",
  "t4-1": "The Doppler Principle", "t4-2": "Doppler Modalities", "t4-3": "Aliasing & Nyquist Limit",
  "t5-1": "Propagation Artifacts", "t5-2": "Attenuation Artifacts", "t5-3": "Mirror Image Artifact", "t5-4": "Side Lobes & Grating Lobes", "t5-5": "Refraction Artifact",
  "t6-1": "ALARA & Bioeffects", "t6-2": "Safety Indices",
  "t7-1": "Flow Patterns", "t7-2": "Physical Principles",
  "t8-1": "QA Principles", "t8-2": "Performance Parameters",
  "t9-1": "Axial Resolution", "t9-2": "Lateral Resolution",
  "t10-1": "Non-Linear Propagation", "t10-2": "Tissue Harmonic Imaging",
  "t11-1": "Receiver Functions"
};

// 3. Read Existing Data
const dataPath = path.resolve(process.cwd(), 'data/spiCourseData.ts');
let fileContent = fs.readFileSync(dataPath, 'utf-8');

// Identify topics that have "narrativeScript" (meaning they are full lectures)
const existingTopics = new Set();
MODULES.forEach(m => {
  m.topics.forEach(t => {
    // Check if the key exists followed by narrativeScript property within reasonable distance
    // We search for `"tX-Y": {` ... `"narrativeScript"`
    const regex = new RegExp(`"${t}":\\s*\\{[\\s\\S]*?"narrativeScript"`, 'm');
    if (regex.test(fileContent)) {
      existingTopics.add(t);
    }
  });
});

console.log(`Found ${existingTopics.size} complete topics.`);

// 4. Generate Missing
const generateTopic = async (topicId) => {
  const title = TOPIC_TITLES[topicId] || "Ultrasound Physics Topic";
  console.log(`Generating ${topicId}: ${title}...`);
  
  const prompt = `Create a 'Meal-Prepped' masterclass lecture on "${title}" for Ultrasound Physics (SPI Registry Prep).
  Return valid JSON with NO markdown formatting.
  Schema:
  {
    "topicId": "${topicId}",
    "topicTitle": "${title}",
    "quantifiedEffort": "string (e.g. 'I read 3 chapters')",
    "timeSavedHours": number,
    "learningEffortMinutes": "string",
    "roadmap": ["string"],
    "contrastSection": "string",
    "narrativeScript": "string (The main lecture text)",
    "visualId": "string (Choose from: AXIAL_RES, DOPPLER_FLOW, PULSE_ECHO, BEAM_PROFILE, NYQUIST_LIMIT, ATTENUATION, TRANSDUCER_ARRAY, or null)",
    "visualInterpretation": [{ "observation": "string", "significance": "string" }],
    "clinicalDemo": [{ "probeMovement": "string", "expectedOutcome": "string" }],
    "analogy": "string",
    "mnemonic": { "acronym": "string", "meaning": "string" },
    "holyShitInsight": "string",
    "psychologicalBarrier": "string",
    "assessmentQuestions": [
      {
        "id": "q-${topicId}-1",
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswerIndex": number,
        "explanation": "string"
      },
       {
        "id": "q-${topicId}-2",
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswerIndex": number,
        "explanation": "string"
      }
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    const json = JSON.parse(response.text);
    return Array.isArray(json) ? json[0] : json;
  } catch (e) {
    console.error(`Failed to generate ${topicId}`, e);
    return null;
  }
};

const run = async () => {
  const allTopics = MODULES.flatMap(m => m.topics);
  const missingTopics = allTopics.filter(t => !existingTopics.has(t));
  
  console.log(`Missing topics: ${missingTopics.join(', ')}`);
  
  if (missingTopics.length === 0) {
    console.log("All topics generated!");
    return;
  }

  // Generate in batches
  for (let i = 0; i < missingTopics.length; i += 3) {
    const batch = missingTopics.slice(i, i + 3);
    const results = await Promise.all(batch.map(generateTopic));
    
    results.forEach((data, index) => {
      if (!data) return;
      const topicId = batch[index];
      const json = JSON.stringify(data, null, 2);
      
      // Check if the key exists but is incomplete (we need to replace it)
      // For safety, since we manually cleaned the file, we will ONLY append.
      // const keyRegex = new RegExp(`"${topicId}":\\s*\\{[\\s\\S]*?\\n\\s*\\}(,)?`, 'm');
      
      const keyRegex = null; // FORCE APPEND for now

      if (keyRegex && keyRegex.test(fileContent)) {
        // Replace existing incomplete entry
        console.log(`Updating incomplete entry for ${topicId}`);
        fileContent = fileContent.replace(keyRegex, `"${topicId}": ${json}$1`);
      } else {
        // Append new entry
        // Find the last closing brace of the object `};`
        const lastBrace = fileContent.lastIndexOf('};');
        if (lastBrace !== -1) {
            console.log(`Appending ${topicId}...`);
            const insertion = `,\n  "${topicId}": ${json}\n`;
            fileContent = fileContent.slice(0, lastBrace) + insertion + fileContent.slice(lastBrace);
        }
      }
    });
    
    fs.writeFileSync(dataPath, fileContent);
    console.log(`Batch ${i/3 + 1} written.`);
    await new Promise(r => setTimeout(r, 2000));
  }
};

run();
