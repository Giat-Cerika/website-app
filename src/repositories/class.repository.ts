import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/constants';
import { Class, CreateClassRequest } from '@/types/class.types';
import { PaginationParams } from '@/types/common.types';

export class ClassRepository {
  endpoint = API_ENDPOINTS.CLASS.BASE;

  async create(data: CreateClassRequest): Promise<Class> {
    return (await axiosInstance.post(`${this.endpoint}/create`, data)).data;
  }

  async getAll(params?: PaginationParams): Promise<{ data: Class[]; pagination: any }> {
    return (await axiosInstance.get(`${this.endpoint}/all`, { params })).data;
  }

  async getById(id: string): Promise<Class> {
    return (await axiosInstance.get(`${this.endpoint}/${id}`)).data;
  }

  async update(id: string, data: Partial<CreateClassRequest>): Promise<Class> {
    return (await axiosInstance.put(`${this.endpoint}/${id}/edit`, data)).data;
  }

  async delete(id: string): Promise<void> {
    return (await axiosInstance.delete(`${this.endpoint}/${id}/delete`)).data;
  }

  async incrementViewCount(id: string): Promise<void> {
    return (await axiosInstance.post(`${this.endpoint}/${id}/view`)).data;
  }
}
