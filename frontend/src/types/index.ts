export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    prompts: number;
    chats: number;
    files: number;
  };
}

export interface Prompt {
  id: string;
  content: string;
  projectId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  id: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
  _count?: {
    messages: number;
  };
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}