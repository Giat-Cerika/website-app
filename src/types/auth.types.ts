export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  createdAt: string;
}