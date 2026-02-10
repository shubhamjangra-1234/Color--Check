export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  UPLOAD: '/upload',
  GET_IMAGES: '/getImage',
  GET_IMAGE: '/getImage',
  GET_DOMINANT_COLOR: '/getDominantColor',
};

export const WCAG_STANDARDS = {
  NORMAL_TEXT: 4.5,
  LARGE_TEXT: 3.0,
  ENHANCED: 7.0,
};

export const PREDEFINED_COLORS = [
  '#FF0000', // Red
  '#0000FF', // Blue
  '#FFA500', // Orange
  '#800080', // Purple
  '#FFFF00', // Yellow
  '#008000', // Green
];
