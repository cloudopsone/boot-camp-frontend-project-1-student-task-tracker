import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Task endpoints
export const getTasks = () => api.get('/tasks');
export const getTask = (id) => api.get(`/tasks/${id}`);
export const getTasksByBoard = (boardId) => api.get(`/tasks?boardId=${boardId}`);
export const getTasksByStatus = (status) => api.get(`/tasks?status=${status}`);
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// Board endpoints
export const getBoards = () => api.get('/boards');
export const getBoard = (id) => api.get(`/boards/${id}`);
export const createBoard = (data) => api.post('/boards', data);
export const updateBoard = (id, data) => api.put(`/boards/${id}`, data);
export const deleteBoard = (id) => api.delete(`/boards/${id}`);

export default api;
