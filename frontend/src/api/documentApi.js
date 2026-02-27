import axios from './axiosConfig';

export const getDocuments = async () => {
  const response = await axios.get('/documents');
  return response;
};

export const getDocument = async (id) => {
  const response = await axios.get(`/documents/${id}`);
  return response;
};

export const uploadDocument = async (formData) => {
  const response = await axios.post('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
};

// FIXED: This is the update function
export const updateDocument = async (id, documentData) => {
  const response = await axios.put(`/documents/${id}`, documentData);
  return response;
};

export const deleteDocument = async (id) => {
  const response = await axios.delete(`/documents/${id}`);
  return response;
};

export const getDocumentsByCase = async (caseId) => {
  const response = await axios.get(`/documents/case/${caseId}`);
  return response;
};

export const downloadDocument = async (id) => {
  window.open(`${axios.defaults.baseURL}/documents/download/${id}`, '_blank');
};

export const viewDocument = async (id) => {
  window.open(`${axios.defaults.baseURL}/documents/view/${id}`, '_blank');
};