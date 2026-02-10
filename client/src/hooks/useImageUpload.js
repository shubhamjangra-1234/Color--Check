import { useState, useCallback } from 'react';
import { imageService } from '../services/api';

export const useImageUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = useCallback(async (file) => {
    if (!file) {
      setError('Please select a file first!');
      return null;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await imageService.uploadImage(formData);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { uploadImage, loading, error };
};
