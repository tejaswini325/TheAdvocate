import axios from './axiosConfig';

export const getCases = async (params) => {
  const response = await axios.get('/cases', { params });
  return response;
};

export const getCase = async (id) => {
  const response = await axios.get(`/cases/${id}`);
  return response;
};

export const createCase = async (caseData) => {
  const response = await axios.post('/cases', caseData);
  return response;
};

export const updateCase = async (id, caseData) => {
  const response = await axios.put(`/cases/${id}`, caseData);
  return response;
};

export const deleteCase = async (id) => {
  const response = await axios.delete(`/cases/${id}`);
  return response;
};

// Make sure this function is exported
export const getCasesByClient = async (clientId) => {
  const response = await axios.get(`/cases/client/${clientId}`);
  return response;
};

export const searchCases = async (query) => {
  const response = await axios.get(`/cases/search/${query}`);
  return response;
};