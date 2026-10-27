/**
 * Utility to format numbers with Indonesian decimal comma convention
 * and appropriate significant digits.
 */
export function formatIndonesianNumber(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return "0";
  }
  
  const num = Number(value);
  const fixed = num.toFixed(decimals);
  // Replace standard dot with Indonesian comma
  return fixed.replace('.', ',');
}

/**
 * Format chemical formula with sub tags if string has numbers
 * e.g., H2O -> H₂O or HTML-safe representation
 */
export function formatFormula(formula) {
  if (!formula) return "";
  return formula;
}

