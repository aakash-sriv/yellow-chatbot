import axios from 'axios';
import type { AuthResponse, Project, Prompt, Chat, Message } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  getProfile: () =>
    api.get('/auth/profile'),
};

// Projects API
export const projectAPI = {
  create: (data: { name: string; description?: string }) =>
    api.post<{ message: string; project: Project }>('/projects', data),

  getAll: () =>
    api.get<{ projects: Project[] }>('/projects'),

  getById: (id: string) =>
    api.get<{ project: Project }>(`/projects/${id}`),

  update: (id: string, data: { name?: string; description?: string }) =>
    api.put<{ message: string; project: Project }>(`/projects/${id}`, data),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/projects/${id}`),
};

// Prompts API
export const promptAPI = {
  create: (data: { content: string; projectId: string; role?: string }) =>
    api.post<{ message: string; prompt: Prompt }>('/prompts', data),

  getByProject: (projectId: string) =>
    api.get<{ prompts: Prompt[] }>(`/prompts/project/${projectId}`),

  update: (id: string, data: { content?: string; role?: string }) =>
    api.put<{ message: string; prompt: Prompt }>(`/prompts/${id}`, data),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/prompts/${id}`),
};

// Chats API
export const chatAPI = {
  create: (projectId: string) =>
    api.post<{ message: string; chat: Chat }>('/chats', { projectId }),

  getByProject: (projectId: string) =>
    api.get<{ chats: Chat[] }>(`/chats/project/${projectId}`),

  getById: (id: string) =>
    api.get<{ chat: Chat }>(`/chats/${id}`),

  sendMessage: (chatId: string, content: string) =>
    api.post<{
      message: string;
      userMessage: Message;
      assistantMessage: Message;
    }>('/chats/message', { chatId, content }),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/chats/${id}`),
};

export default api;