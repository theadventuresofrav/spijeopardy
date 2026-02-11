
let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export type SoundType = 'click' | 'submit' | 'correct' | 'incorrect' | 'start' | 'boot' | 'warp' | 'level_up' | 'badge_unlock' | 'buzz';

export const playSfx = (type: SoundType, volume: number = 1.0): (() => void) => {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // Master Filter for EXTREME softening (Pillow Mode)
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 600; // Ultra-low cutoff for muffled, gentle sound
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  // Global volume reduction for gentleness
  const MASTER_VOL = 0.5 * volume; 

  switch (type) {
    case 'buzz':
      // Gentle pulsing heartbeat / warning
      osc.type = 'sine'; 
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(60, now + 0.4);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.03 * MASTER_VOL, now + 0.1); 
      gain.gain.linearRampToValueAtTime(0.01 * MASTER_VOL, now + 0.3);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      
      osc.start(now);
      osc.stop(now + 0.5);
      break;

    case 'click':
      // Tiny water droplet
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.01 * MASTER_VOL, now + 0.01); 
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      
      osc.start(now);
      osc.stop(now + 0.05);
      break;

    case 'submit':
      // Soft confirmation ping
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(400, now + 0.2);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.02 * MASTER_VOL, now + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + 0.2);
      
      osc.start(now);
      osc.stop(now + 0.2);
      break;

    case 'correct':
      // Ethereal Chord (Sine waves only)
      const notes = [261.63, 329.63, 392.00]; // C4, E4, G4 (Lower octave)
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        
        o.connect(g);
        g.connect(ctx.destination);
        
        const startTime = now + i * 0.1;
        g.gain.setValueAtTime(0, startTime);
        g.gain.linearRampToValueAtTime(0.015 * MASTER_VOL, startTime + 0.4); // Slow attack
        g.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5); // Long decay
        
        o.start(startTime);
        o.stop(startTime + 1.5);
      });
      break;

    case 'incorrect':
      // Soft, sad low wobble
      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.5);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.02 * MASTER_VOL, now + 0.1);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      
      osc.start(now);
      osc.stop(now + 0.5);
      break;

    case 'boot':
      // Deep Ambient Swell
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      
      // Filter the second oscillator too
      const filter2 = ctx.createBiquadFilter();
      filter2.type = 'lowpass';
      filter2.frequency.value = 500; 
      osc2.connect(filter2);
      filter2.connect(gain2);
      gain2.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 3.0);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04 * MASTER_VOL, now + 1.5);
      gain.gain.linearRampToValueAtTime(0, now + 4.0);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(90, now);
      osc2.frequency.exponentialRampToValueAtTime(180, now + 3.0);
      
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(0.03 * MASTER_VOL, now + 1.5);
      gain2.gain.linearRampToValueAtTime(0, now + 4.0);

      osc.start(now);
      osc.stop(now + 4.0);
      osc2.start(now);
      osc2.stop(now + 4.0);
      break;

    case 'start':
      // Soft Breath
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 1.5);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.03 * MASTER_VOL, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      
      osc.start(now);
      osc.stop(now + 1.5);
      break;

    case 'level_up':
      // Gentle Arpeggio
      const levelNotes = [300, 400, 500, 600];
      levelNotes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.value = freq;
        
        const st = now + i * 0.15;
        g.gain.setValueAtTime(0, st);
        g.gain.linearRampToValueAtTime(0.02 * MASTER_VOL, st + 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, st + 0.8);
        
        o.start(st);
        o.stop(st + 0.8);
      });
      break;
      
    case 'badge_unlock':
      // Soft Glimmer
      for(let i=0; i<4; i++) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sine';
        const base = 800;
        const offset = [0, 100, 200, 300][i];
        o.frequency.setValueAtTime(base + offset, now + i*0.1);
        
        g.gain.setValueAtTime(0, now + i*0.1);
        g.gain.linearRampToValueAtTime(0.01 * MASTER_VOL, now + i*0.1 + 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + i*0.1 + 0.4);
        
        o.start(now + i*0.1);
        o.stop(now + i*0.1 + 0.4);
      }
      break;

    case 'warp': {
      // Deep Data Flow
      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.6);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.03 * MASTER_VOL, now + 0.3); 
      gain.gain.linearRampToValueAtTime(0, now + 0.6);
      
      osc.start(now);
      osc.stop(now + 0.6);
      break;
    }
  }

  return () => {
      try {
        osc.stop();
        osc.disconnect();
        filter.disconnect();
        gain.disconnect();
      } catch (e) {
          // Ignore errors if already stopped
      }
  };
};
