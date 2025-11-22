import axiosInstance from '@/lib/axios';
import { AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/common.types';

export class BaseRepository<T> {
  constructor(protected endpoint: string) {}

  async getAll(params?: PaginationParams): Promise<PaginatedResponse<T>> {
    const response: AxiosResponse<PaginatedResponse<T>> = await axiosInstance.get(
      this.endpoint,
      { params }
    );
    return response.data;
  }

  async getById(id: string): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.get(
      `${this.endpoint}/${id}`
    );
    return response.data.data;
  }

  async create(data: Partial<T>): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.post(
      this.endpoint,
      data
    );
    return response.data.data;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.put(
      `${this.endpoint}/${id}`,
      data
    );
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`${this.endpoint}/${id}`);
  }
}
