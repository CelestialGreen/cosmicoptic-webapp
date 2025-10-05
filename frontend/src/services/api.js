import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const cosmicOpticAPI = {
  /**
   * Get list of available sample signals
   */
  getSamples: async () => {
    const response = await api.get('/api/samples');
    return response.data;
  },

  /**
   * Analyze a stellar signal
   * @param {string} sampleId - ID of the sample to analyze
   */
  predictExoplanet: async (sampleId) => {
    const response = await api.post('/api/predict', {
      sample_id: sampleId,
    });
    return response.data;
  },

  /**
   * Upload file and analyze
   * @param {File} file - File to upload
   */
  uploadAndPredict: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${API_BASE_URL}/api/predict/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      }
    );
    return response.data;
  },

  /**
   * Get model performance metrics
   */
  getMetrics: async () => {
    const response = await api.get('/api/metrics');
    return response.data;
  },

  /**
   * Health check
   */
  getStatus: async () => {
    const response = await api.get('/');
    return response.data;
  },
};

export default api;
