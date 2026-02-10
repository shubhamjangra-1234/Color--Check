import axios from 'axios';
import { API_BASE_URL } from '../constants';

const aiApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * AI Service
 * Handles communication with backend AI endpoints
 */
export const aiService = {
  /**
   * Analyze using AI
   * @param {string} type - Analysis type
   * @param {Object} payload - Analysis payload
   * @returns {Promise} Analysis result
   */
  analyze: async (type, payload) => {
    try {
      const response = await aiApi.post('/api/ai/analyze', {
        type,
        payload
      });
      return response.data;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  },

  /**
   * Get AI service status
   * @returns {Promise} Service status
   */
  getStatus: async () => {
    try {
      const response = await aiApi.get('/api/ai/status');
      return response.data;
    } catch (error) {
      console.error('AI Status Error:', error);
      throw error;
    }
  },
};

export default aiApi;
