
let audioCtx: AudioContext | null = null;
let musicNodes: {
  oscillators: OscillatorNode[];
  gains: GainNode[];
  masterGain: GainNode | null;
  lfo: OscillatorNode | null;
} | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export const MusicService = {
  isPlaying: false,

  start: (volume: number = 0.3) => {
    if (MusicService.isPlaying) return;
    
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(volume * 0.15, now + 5); // Slow fade in, keep it subtle
    masterGain.connect(ctx.destination);

    // Create an ambient drone chord (A minor add 9ish: A2, E3, B3, C4)
    // Frequencies: A2=110, E3=164.81, B3=246.94, C4=261.63
    // Using sine waves for pure, "medical/clean" tone
    const freqs = [110, 164.81, 246.94]; 
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    // LFO for movement (Breathing effect)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1; // Very slow (10 seconds per cycle)
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.05; // Modulation depth
    lfo.connect(lfoGain);
    lfo.start(now);

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;

      // Slight detune for thickness
      if (i > 0) osc.detune.value = Math.random() * 4 - 2;

      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.1; // Base individual volume
      
      // Connect LFO to individual gain for movement
      lfoGain.connect(oscGain.gain);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(now);

      oscillators.push(osc);
      gains.push(oscGain);
    });

    musicNodes = { oscillators, gains, masterGain, lfo };
    MusicService.isPlaying = true;
  },

  stop: () => {
    if (!MusicService.isPlaying || !musicNodes) return;
    
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Fade out
    musicNodes.masterGain?.gain.cancelScheduledValues(now);
    musicNodes.masterGain?.gain.setValueAtTime(musicNodes.masterGain.gain.value, now);
    musicNodes.masterGain?.gain.linearRampToValueAtTime(0, now + 2);

    setTimeout(() => {
        musicNodes?.oscillators.forEach(o => o.stop());
        musicNodes?.lfo?.stop();
        musicNodes = null;
        MusicService.isPlaying = false;
    }, 2100);
  },

  setVolume: (volume: number) => {
      if (musicNodes && musicNodes.masterGain) {
          const ctx = getAudioContext();
          const now = ctx.currentTime;
          // Scale: 0.15 is the max "master" volume we want for background
          musicNodes.masterGain.gain.linearRampToValueAtTime(volume * 0.15, now + 0.5);
      }
  }
};
