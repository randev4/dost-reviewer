/**
 * Confetti effects for DOST Reviewer
 * Uses canvas-confetti with DOST theme palette & responsive origins
 */
import confetti from 'canvas-confetti';

const DOST_PALETTE = [
  '#3b82f6', // Primary Blue
  '#10b981', // Success Emerald
  '#f59e0b', // Amber Gold
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#ffffff'  // Crisp White
];

/**
 * Quick celebratory confetti burst for every correct answer
 * @param {HTMLElement|null} sourceEl - The element (e.g. Check button) from which confetti emanates
 */
export function fireCorrectConfetti(sourceEl = null) {
  let origin = { x: 0.5, y: 0.65 };

  if (sourceEl && typeof sourceEl.getBoundingClientRect === 'function') {
    const rect = sourceEl.getBoundingClientRect();
    origin = {
      x: Math.max(0.1, Math.min(0.9, (rect.left + rect.width / 2) / window.innerWidth)),
      y: Math.max(0.1, Math.min(0.9, (rect.top + rect.height / 2) / window.innerHeight))
    };
  }

  // Dual pop for extra dynamic feel
  confetti({
    particleCount: 35,
    angle: 60,
    spread: 55,
    origin,
    colors: DOST_PALETTE,
    startVelocity: 32,
    gravity: 1.1,
    ticks: 140,
    scalar: 0.85,
    disableForReducedMotion: true
  });

  confetti({
    particleCount: 35,
    angle: 120,
    spread: 55,
    origin,
    colors: DOST_PALETTE,
    startVelocity: 32,
    gravity: 1.1,
    ticks: 140,
    scalar: 0.85,
    disableForReducedMotion: true
  });
}

/**
 * Grand celebration cascade for quiz completion with high score
 */
export function fireGrandConfetti() {
  const duration = 2.2 * 1000;
  const animationEnd = Date.now() + duration;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);

    confetti({
      particleCount,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: DOST_PALETTE,
      disableForReducedMotion: true
    });

    confetti({
      particleCount,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: DOST_PALETTE,
      disableForReducedMotion: true
    });
  }, 220);
}
