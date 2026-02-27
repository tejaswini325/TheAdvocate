import axios from './axiosConfig';

export const getClients = async (page = 1, limit = 10) => {
  const response = await axios.get(`/clients?page=${page}&limit=${limit}`);
  return response;
};

export const getClient = async (id) => {
  const response = await axios.get(`/clients/${id}`);
  return response;
};

export const createClient = async (clientData) => {
  const response = await axios.post('/clients', clientData);
  return response;
};

export const updateClient = async (id, clientData) => {
  const response = await axios.put(`/clients/${id}`, clientData);
  return response;
};

export const deleteClient = async (id) => {
  const response = await axios.delete(`/clients/${id}`);
  return response;
};

export const searchClients = async (query) => {
  const response = await axios.get(`/clients/search/${query}`);
  return response;
};