import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/constants';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types/auth.types';

export class AuthRepository {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data;
  }

  async logout(): Promise<void> {
    await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async getProfile(): Promise<User> {
    const response = await axiosInstance.get<{ data: User }>(
      API_ENDPOINTS.AUTH.PROFILE
    );
    return response.data.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REFRESH
    );
    return response.data;
  }
}