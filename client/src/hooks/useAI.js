import { useState, useCallback } from 'react';
import { aiService } from '../services/aiService';

/**
 * AI Analysis Hook
 * Provides AI analysis functionality with loading and error states
 */
export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Perform AI analysis
   * @param {string} type - Analysis type
   * @param {Object} payload - Analysis payload
   * @returns {Promise} Analysis result
   */
  const analyze = useCallback(async (type, payload) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await aiService.analyze(type, payload);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'AI analysis failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset AI state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  /**
   * Get AI service status
   * @returns {Promise} Service status
   */
  const getStatus = useCallback(async () => {
    try {
      return await aiService.getStatus();
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to get AI status';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    analyze,
    getStatus,
    reset,
    loading,
    error,
    data
  };
};
