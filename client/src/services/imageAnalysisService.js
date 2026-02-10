import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Image Analysis Service
 * Calls backend for server-side color analysis
 */
export const imageAnalysisService = {
  /**
   * Analyze uploaded image on backend
   * @param {string} imageUrl - Image filename
   * @param {Object} options - Analysis options
   * @returns {Promise} Analysis result
   */
  analyzeImage: async (imageUrl, options = {}) => {
    try {
      const response = await api.post('/api/analyze-image', {
        imageUrl,
        options: {
          colorCount: 5,
          includeText: true,
          ...options
        }
      });
      return response.data;
    } catch (error) {
      console.error('Image analysis error:', error);
      throw error;
    }
  },
};

export default api;
