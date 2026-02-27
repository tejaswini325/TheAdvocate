import axios from './axiosConfig';

export const getTasks = async () => {
  const response = await axios.get('/tasks');
  return response;
};

export const getTask = async (id) => {
  const response = await axios.get(`/tasks/${id}`);
  return response;
};

export const createTask = async (taskData) => {
  const response = await axios.post('/tasks', taskData);
  return response;
};

export const updateTask = async (id, taskData) => {
  const response = await axios.put(`/tasks/${id}`, taskData);
  return response;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`/tasks/${id}`);
  return response;
};

export const getTasksByCase = async (caseId) => {
  const response = await axios.get(`/tasks/case/${caseId}`);
  return response;
};