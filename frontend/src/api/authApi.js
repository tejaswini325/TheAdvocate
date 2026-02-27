import axios from './axiosConfig';

export const register = async (userData) => {
  const response = await axios.post('/auth/register', userData);
  return response;
};

export const login = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response;
};

export const getMe = async () => {
  const response = await axios.get('/auth/me');
  return response;
};

// Add this function
export const getUsers = async () => {
  const response = await axios.get('/users');
  return response;
};