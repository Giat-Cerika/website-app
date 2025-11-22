import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/constants';
import { Video, CreateVideoRequest } from '@/types/video.types';
import { PaginationParams } from '@/types/common.types';

export class VideoRepository {
  endpoint = API_ENDPOINTS.VIDEOS.BASE;

  async create(data: CreateVideoRequest): Promise<Video> {
    return (await axiosInstance.post(`${this.endpoint}/create`, data)).data;
  }

  async getAll(params?: PaginationParams): Promise<{ data: Video[]; pagination: any }> {
    return (await axiosInstance.get(`${this.endpoint}/all`, { params })).data;
  }

  async getById(id: string): Promise<Video> {
    return (await axiosInstance.get(`${this.endpoint}/${id}`)).data;
  }

  async update(id: string, data: Partial<CreateVideoRequest>): Promise<Video> {
    return (await axiosInstance.put(`${this.endpoint}/${id}/edit`, data)).data;
  }

  async delete(id: string): Promise<void> {
    return (await axiosInstance.delete(`${this.endpoint}/${id}/delete`)).data;
  }

  async incrementViewCount(id: string): Promise<void> {
    return (await axiosInstance.post(`${this.endpoint}/${id}/view`)).data;
  }
}
