import axios, { AxiosResponse } from 'axios';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  boardId: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Board {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

const api = axios.create({
  baseURL: '/api',
});

// Task endpoints
export const getTasks = (): Promise<AxiosResponse<Task[]>> => api.get('/tasks');
export const getTask = (id: number): Promise<AxiosResponse<Task>> => api.get(`/tasks/${id}`);
export const getTasksByBoard = (boardId: number): Promise<AxiosResponse<Task[]>> => 
  api.get(`/tasks?boardId=${boardId}`);
export const getTasksByStatus = (status: string): Promise<AxiosResponse<Task[]>> => 
  api.get(`/tasks?status=${status}`);
export const createTask = (data: Partial<Task>): Promise<AxiosResponse<Task>> => 
  api.post('/tasks', data);
export const updateTask = (id: number, data: Partial<Task>): Promise<AxiosResponse<Task>> => 
  api.put(`/tasks/${id}`, data);
export const deleteTask = (id: number): Promise<AxiosResponse<void>> => 
  api.delete(`/tasks/${id}`);

// Board endpoints
export const getBoards = (): Promise<AxiosResponse<Board[]>> => api.get('/boards');
export const getBoard = (id: number): Promise<AxiosResponse<Board>> => api.get(`/boards/${id}`);
export const createBoard = (data: Partial<Board>): Promise<AxiosResponse<Board>> => 
  api.post('/boards', data);
export const updateBoard = (id: number, data: Partial<Board>): Promise<AxiosResponse<Board>> => 
  api.put(`/boards/${id}`, data);
export const deleteBoard = (id: number): Promise<AxiosResponse<void>> => 
  api.delete(`/boards/${id}`);

export default api;
