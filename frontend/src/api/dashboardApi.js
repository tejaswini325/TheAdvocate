import axios from './axiosConfig';

export const getDashboardStats = async () => {
  const response = await axios.get('/dashboard/stats');
  return response;
};