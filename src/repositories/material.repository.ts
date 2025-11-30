import axios from "axios";
import {
  Materi,
  CreateMateriRequest,
  UpdateMateriRequest,
  MateriListResponse,
  MateriQueryParams,
} from "@/types/material.types";
import { API_ENDPOINTS } from "@/lib/constants";
import axiosInstance from '@/lib/axios';

export class MateriRepository {
  endpoint = API_ENDPOINTS.MATERIALS.BASE;

  async getAll(params?: MateriQueryParams): Promise<MateriListResponse> {
    const response = await axiosInstance.get(`${this.endpoint}/all`, { params });
    return response.data;
  }

  async getById(id: string): Promise<Materi> {
    const response = await axiosInstance.get(`${this.endpoint}/${id}`);
    return response.data.data;
  }

  async create(data: CreateMateriRequest): Promise<Materi> {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("cover", data.cover);

    data.gallery.forEach((file) => formData.append("gallery", file));

    const response = await axiosInstance.post(
      this.endpoint,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data.data;
  }

  async update(id: string, data: UpdateMateriRequest): Promise<Materi> {
    const response = await axiosInstance.put(`${this.endpoint}/${id}/edit`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`${this.endpoint}/${id}/delete`);
  }
}
