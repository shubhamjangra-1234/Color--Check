import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';

export const useTextExtraction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const extractText = useCallback(async (file) => {
    if (!file) {
      setError('Please provide an image file');
      return '';
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {});
      return text.trim() || 'No text detected in the image.';
    } catch (err) {
      const errorMessage = 'Text extraction failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { extractText, loading, error };
};
