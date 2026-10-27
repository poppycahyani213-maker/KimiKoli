/**
 * Calculates van 't Hoff factor (i)
 * Formula: i = 1 + (n - 1) * alpha
 * 
 * @param {number} n - Number of ions produced per formula unit (n >= 1)
 * @param {number} alpha - Degree of ionization (0 <= alpha <= 1)
 * @returns {number} van 't Hoff factor i
 */
export function calculateVantHoffFactor(n = 1, alpha = 0) {
  const safeN = Math.max(1, Number(n) || 1);
  const safeAlpha = Math.min(1, Math.max(0, Number(alpha) || 0));
  
  if (safeN === 1 || safeAlpha === 0) {
    return 1;
  }
  
  return 1 + (safeN - 1) * safeAlpha;
}

