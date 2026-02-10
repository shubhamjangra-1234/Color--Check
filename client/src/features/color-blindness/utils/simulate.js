/**
 * Color Blindness Simulation Utilities
 * Implements color transformation algorithms for different types of color vision deficiency
 */

import { COLOR_BLINDNESS_TYPES } from '../types';

/**
 * Convert hex color to RGB
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Convert RGB to hex color
 */
export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Apply gamma correction to RGB values
 */
const gammaCorrect = (value) => {
  return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
};

/**
 * Remove gamma correction from RGB values
 */
const gammaUncorrect = (value) => {
  return value <= 0.0031308 ? 12.92 * value : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
};

/**
 * Convert RGB to linear RGB
 */
const rgbToLinear = (r, g, b) => {
  return {
    r: gammaCorrect(r / 255),
    g: gammaCorrect(g / 255),
    b: gammaCorrect(b / 255)
  };
};

/**
 * Convert linear RGB to RGB
 */
const linearToRgb = (r, g, b) => {
  return {
    r: Math.round(gammaUncorrect(r) * 255),
    g: Math.round(gammaUncorrect(g) * 255),
    b: Math.round(gammaUncorrect(b) * 255)
  };
};

/**
 * Simulate Protanopia (red-blind)
 */
const simulateProtanopia = (r, g, b) => {
  return {
    r: 0.567 * r + 0.433 * g,
    g: 0.558 * r + 0.442 * g,
    b: 0.242 * g + 0.758 * b
  };
};

/**
 * Simulate Deuteranopia (green-blind)
 */
const simulateDeuteranopia = (r, g, b) => {
  return {
    r: 0.625 * r + 0.375 * g,
    g: 0.7 * r + 0.3 * g,
    b: 0.3 * g + 0.7 * b
  };
};

/**
 * Simulate Tritanopia (blue-blind)
 */
const simulateTritanopia = (r, g, b) => {
  return {
    r: 0.95 * r + 0.05 * g,
    g: 0.433 * g + 0.567 * b,
    b: 0.475 * g + 0.525 * b
  };
};

/**
 * Simulate Achromatopsia (complete color blindness - grayscale)
 */
const simulateAchromatopsia = (r, g, b) => {
  const gray = 0.299 * r + 0.587 * g + 0.114 * b;
  return { r: gray, g: gray, b: gray };
};

/**
 * Apply color blindness simulation to a color
 */
export const simulateColorBlindness = (hexColor, type) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return null;

  let simulatedRgb = { ...rgb };

  switch (type) {
    case COLOR_BLINDNESS_TYPES.protanopia:
      simulatedRgb = simulateProtanopia(rgb.r, rgb.g, rgb.b);
      break;
    case COLOR_BLINDNESS_TYPES.deuteranopia:
      simulatedRgb = simulateDeuteranopia(rgb.r, rgb.g, rgb.b);
      break;
    case COLOR_BLINDNESS_TYPES.tritanopia:
      simulatedRgb = simulateTritanopia(rgb.r, rgb.g, rgb.b);
      break;
    case COLOR_BLINDNESS_TYPES.achromatopsia:
      simulatedRgb = simulateAchromatopsia(rgb.r, rgb.g, rgb.b);
      break;
    case COLOR_BLINDNESS_TYPES.normal:
    default:
      // Return original color for normal vision
      return {
        original: hexColor,
        simulated: hexColor,
        rgb
      };
  }

  // Clamp values to valid RGB range
  simulatedRgb.r = Math.max(0, Math.min(255, Math.round(simulatedRgb.r)));
  simulatedRgb.g = Math.max(0, Math.min(255, Math.round(simulatedRgb.g)));
  simulatedRgb.b = Math.max(0, Math.min(255, Math.round(simulatedRgb.b)));

  return {
    original: hexColor,
    simulated: rgbToHex(simulatedRgb.r, simulatedRgb.g, simulatedRgb.b),
    rgb: simulatedRgb
  };
};

/**
 * Simulate color blindness for an array of colors
 */
export const simulatePalette = (colors, type) => {
  return colors.map(color => simulateColorBlindness(color, type)).filter(Boolean);
};

/**
 * Get available color blindness modes
 */
export const getColorBlindnessModes = () => [
  {
    type: COLOR_BLINDNESS_TYPES.normal,
    label: 'Normal Vision',
    description: 'Standard color vision'
  },
  {
    type: COLOR_BLINDNESS_TYPES.protanopia,
    label: 'Protanopia',
    description: 'Red-blind (difficulty perceiving red colors)'
  },
  {
    type: COLOR_BLINDNESS_TYPES.deuteranopia,
    label: 'Deuteranopia',
    description: 'Green-blind (difficulty perceiving green colors)'
  },
  {
    type: COLOR_BLINDNESS_TYPES.tritanopia,
    label: 'Tritanopia',
    description: 'Blue-blind (difficulty perceiving blue colors)'
  },
  {
    type: COLOR_BLINDNESS_TYPES.achromatopsia,
    label: 'Achromatopsia',
    description: 'Complete color blindness (grayscale only)'
  }
];
