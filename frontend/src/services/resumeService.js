import api from '../services/api';

/**
 * Uploads a resume PDF file to the backend and returns the parsed data.
 * @param {File} file - PDF file selected by the candidate
 * @returns {Promise<Object>} Parsed resume information
 */
export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
