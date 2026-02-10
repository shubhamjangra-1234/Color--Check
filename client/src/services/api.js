import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const imageService = {
  baseURL: API_BASE_URL,
  
  /**
   * Upload an image
   * @param {FormData} formData - Image data
   * @returns {Promise} - Upload response
   */
  uploadImage: (formData) => api.post(API_ENDPOINTS.UPLOAD, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  /**
   * Get all images
   * @returns {Promise} - Images list
   */
  getImages: () => api.get(API_ENDPOINTS.GET_IMAGES),

  /**
   * Get specific image
   * @param {string} name - Image name
   * @returns {Promise} - Image data
   */
  getImage: (name) => api.get(`${API_ENDPOINTS.GET_IMAGE}/${name}`),

  /**
   * Get dominant color from image
   * @param {string} name - Image name
   * @returns {Promise} - Dominant color data
   */
  getDominantColor: (name) => api.get(`${API_ENDPOINTS.GET_DOMINANT_COLOR}/${name}`),
};

export default api;
