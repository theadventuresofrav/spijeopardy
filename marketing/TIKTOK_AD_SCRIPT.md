# TikTok Ad Campaign: "The Unfair Advantage"

**Target Audience**: Ultrasound students stressed about the SPI exam.
**Tone**: High-energy, Cyberpunk, Authoritative (Charon Persona).
**Length**: 30 Seconds.

## Assets Required
1.  **Voiceover**: Deep, authoritative male voice (Charon). Use ElevenLabs "Marcus" or similar.
2.  **Visuals**: Screen recordings of the `PromoScene.tsx` component (see below).
3.  **Music**: "Phonk" or "Dark Synthwave" (High tempo).

## The Script

| Time | Visual | Audio (Voiceover) | Text Overlay |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:05** | **Scene**: `HostAvatar` (Omega Level) glitching and pulsing. Background is dark. | "Stop studying physics like it's 1990." | **STOP STUDYING.** |
| **0:05 - 0:10** | **Scene**: `DopplerPrincipleVisual` (Flowing blood, moving beam). | "The SPI isn't about memorizing words. It's about seeing the sound." | **SEE THE SOUND.** |
| **0:10 - 0:18** | **Scene**: Rapid cuts between `CavitationVisual` (Exploding bubble) and `AxialResolutionVisual`. | "Cavitation. Resolution. Artifacts. Don't just read them. Simulate them." | **SIMULATE IT.** |
| **0:18 - 0:25** | **Scene**: `GameBoard` (Jeopardy style) showing high score accumulation. | "Gamify your grind. Dominate the exam in 15 minutes a day." | **DOMINATE.** |
| **0:25 - 0:30** | **Scene**: App Logo pulsing with "Download Now" button. | "SPI Mastery. The unfair advantage." | **LINK IN BIO.** |

## How to Record This
I have created a special **PromoScene** component in your codebase that automates this entire visual sequence.

1.  **Modify `App.tsx`**:
    Import `PromoScene` and render it instead of the main app temporarily.
    ```typescript
    import { PromoScene } from './components/PromoScene';
    
    // In your App return:
    return <PromoScene />;
    ```
2.  **Record**:
    Use OBS or QuickTime to record the screen. The scene runs on a loop.
3.  **Edit**:
    Upload the video to TikTok/Reels. Add the voiceover and music.

## AI Character Prompts (for external tools)
If you want to generate a realistic "Student" avatar reacting to the app:
*   **Prompt**: "Cinematic shot of a stressed medical student looking at a holographic tablet, blue light reflection on face, cyberpunk aesthetic, hyper-realistic, 8k."
