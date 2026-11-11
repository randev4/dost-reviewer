/**
 * Web Audio API Sound Synthesizer
 * Procedural UI audio effects with zero external assets, zero latency,
 * and support across all mobile & desktop browsers (including Firefox Mobile & Safari).
 */

let audioCtx = null;
let soundEnabled = localStorage.getItem('sound_enabled') !== 'false'; // default enabled

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function setSoundEnabled(enabled) {
  soundEnabled = !!enabled;
  localStorage.setItem('sound_enabled', soundEnabled ? 'true' : 'false');
  if (soundEnabled) {
    sound.tap();
  }
  return soundEnabled;
}

export function toggleSound() {
  return setSoundEnabled(!soundEnabled);
}

/**
 * Play a synthesized sound envelope
 */
function playTone({ freq = 440, type = 'sine', duration = 0.1, gain = 0.15, freqEnd = null, delay = 0 }) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime + delay;
    const stopTime = startTime + duration;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    if (freqEnd !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 20), stopTime);
    }

    // Smooth envelope (attack & exponential decay to prevent clicks)
    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, stopTime);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(stopTime + 0.01);
  } catch (err) {
    // Audio errors fail silently
  }
}

export const sound = {
  // Ultra-crisp subtle tactile micro-click for choices and question dots
  tap() {
    playTone({ freq: 850, freqEnd: 320, type: 'sine', duration: 0.035, gain: 0.18 });
  },

  // Soft warm tone for subject card selection or major card taps
  select() {
    playTone({ freq: 440, type: 'triangle', duration: 0.12, gain: 0.15 });
    playTone({ freq: 659.25, type: 'sine', duration: 0.15, gain: 0.12, delay: 0.02 });
  },

  // Rising swoosh chime when moving forward to Next question
  next() {
    playTone({ freq: 480, freqEnd: 740, type: 'triangle', duration: 0.09, gain: 0.14 });
  },

  // Gentle descending tone when navigating backward to Prev question
  prev() {
    playTone({ freq: 620, freqEnd: 420, type: 'triangle', duration: 0.08, gain: 0.12 });
  },

  // Uplifting major two-tone chime for correct items or progress milestones
  correct() {
    playTone({ freq: 587.33, type: 'sine', duration: 0.12, gain: 0.16 });
    playTone({ freq: 880, type: 'triangle', duration: 0.22, gain: 0.18, delay: 0.07 });
  },

  // Gentle, soft low chime for incorrect review (non-punishing)
  incorrect() {
    playTone({ freq: 311.13, freqEnd: 261.63, type: 'sine', duration: 0.18, gain: 0.12 });
  },

  // Affirmative chord when submitting a quiz
  submit() {
    playTone({ freq: 440, type: 'triangle', duration: 0.22, gain: 0.12 });
    playTone({ freq: 554.37, type: 'triangle', duration: 0.26, gain: 0.14, delay: 0.04 });
    playTone({ freq: 659.25, type: 'sine', duration: 0.32, gain: 0.16, delay: 0.08 });
  },

  // Celebratory 4-note victory arpeggio on high quiz score
  fanfare() {
    playTone({ freq: 523.25, type: 'triangle', duration: 0.15, gain: 0.14, delay: 0.0 });
    playTone({ freq: 659.25, type: 'triangle', duration: 0.18, gain: 0.15, delay: 0.09 });
    playTone({ freq: 783.99, type: 'triangle', duration: 0.22, gain: 0.16, delay: 0.18 });
    playTone({ freq: 1046.5, type: 'sine', duration: 0.45, gain: 0.20, delay: 0.27 });
  },

  // Quick mechanical toggle tick for theme or sound toggle
  toggle() {
    playTone({ freq: 1100, freqEnd: 550, type: 'sine', duration: 0.025, gain: 0.15 });
  }
};
