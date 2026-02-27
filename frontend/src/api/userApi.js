import axios from './axiosConfig';

export const getUsers = async () => {
  const response = await axios.get('/users');
  return response;
};

export const getUser = async (id) => {
  const response = await axios.get(`/users/${id}`);
  return response;
};

export const createUser = async (userData) => {
  const response = await axios.post('/users', userData);
  return response;
};

export const updateUser = async (id, userData) => {
  const response = await axios.put(`/users/${id}`, userData);
  return response;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`/users/${id}`);
  return response;
};