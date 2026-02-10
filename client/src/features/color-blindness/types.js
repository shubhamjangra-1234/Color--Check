/**
 * Color Blindness Simulation Types
 * Defines the structure for color vision deficiency simulations
 */

export const COLOR_BLINDNESS_TYPES = {
  normal: 'normal',
  protanopia: 'protanopia',      // Red-blind
  deuteranopia: 'deuteranopia',  // Green-blind
  tritanopia: 'tritanopia',      // Blue-blind
  achromatopsia: 'achromatopsia'  // Complete color blindness (grayscale)
};

// Available color blindness types
export const COLOR_BLINDNESS_MODES = Object.keys(COLOR_BLINDNESS_TYPES);
