/**
 * Haptic feedback utility using Web Vibration API
 * Provides tactile sensations for important user actions on mobile devices.
 */

function canVibrate() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

export function vibrate(pattern = 10) {
  if (!canVibrate()) return false;
  try {
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
}

export const haptic = {
  // Ultra-crisp tick for choices, pagination dots, toggles (~10ms)
  tap: () => vibrate(10),

  // Light pulse for buttons (Prev, Next, Back, Theme) (~15ms)
  light: () => vibrate(15),

  // Medium pulse for card selections and major action buttons (~22ms)
  medium: () => vibrate(22),

  // Celebratory pulse pattern for submitting or completing a quiz
  success: () => vibrate([18, 50, 25]),

  // Warning pulse pattern for destructive actions like reset
  warning: () => vibrate([30, 40, 30])
};
