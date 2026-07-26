/**
 * Format milliseconds to "m:ss" display string.
 */
export const formatTime = (millis) => {
  if (!millis || isNaN(millis) || !isFinite(millis)) return '0:00';
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

/**
 * Format a countdown in seconds to "m:ss" display string.
 */
export const formatTimer = (secs) => {
  if (secs === null || secs === undefined) return '';
  const m = Math.floor(Math.abs(secs) / 60);
  const s = Math.abs(secs) % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

/**
 * Derive a consistent accent color from a string (song title / artist).
 */
export const getColorForString = (str = '') => {
  const palette = [
    '#7c3aed', // violet
    '#3b82f6', // blue
    '#ec4899', // pink
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#06b6d4', // cyan
    '#8b5cf6', // purple
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
};
