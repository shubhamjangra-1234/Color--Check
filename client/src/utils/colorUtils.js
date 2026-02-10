import tinycolor from 'tinycolor2';

/**
 * Calculate color similarity between two colors
 * @param {string} color1 - First color (hex format)
 * @param {string} color2 - Second color (hex format)
 * @returns {number} - Similarity percentage (0-100)
 */
export const calculateSimilarity = (color1, color2) => {
  const c1 = tinycolor(color1).toRgb();
  const c2 = tinycolor(color2).toRgb();
  const distance = Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
  return Math.max(0, 100 - distance / 4.42);
};

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First color (hex format)
 * @param {string} color2 - Second color (hex format)
 * @returns {number} - Contrast ratio
 */
export const calculateContrast = (color1, color2) => {
  return tinycolor.readability(color1, color2).toFixed(2);
};

/**
 * Generate WCAG feedback based on contrast ratio
 * @param {number} contrastRatio - Contrast ratio value
 * @returns {string} - Feedback message
 */
export const generateFeedback = (contrastRatio) => {
  if (contrastRatio >= 4.5) {
    return "Pass ✅";
  } else if (contrastRatio >= 3) {
    return "Pass ⚠️";
  } else {
    return "Fail ❌";
  }
};

/**
 * Suggest better colors for accessibility
 * @param {Array} extractedColors - Array of extracted colors
 * @param {Array} predefinedColors - Array of predefined colors
 * @returns {Array} - Array of suggestions
 */
export const suggestBetterColors = (extractedColors, predefinedColors) => {
  const bgColor = extractedColors[0]; // Assume first color is the background
  return extractedColors.map((color) => {
    const contrast = calculateContrast(color, bgColor);
    if (contrast < 3) {
      const betterColor = predefinedColors.find(
        (preColor) => calculateContrast(preColor, bgColor) >= 4.5
      );
      return {
        color,
        suggestion: betterColor || "Consider a higher contrast color",
      };
    }
    return { color, suggestion: "Good contrast" };
  });
};
