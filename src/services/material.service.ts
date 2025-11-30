import { MateriRepository } from "@/repositories/material.repository";
import {
  Materi,
  CreateMateriRequest,
  UpdateMateriRequest,
  MateriQueryParams,
  Pagination,
} from "@/types/material.types";

export class MateriService {
  private repository: MateriRepository;

  constructor() {
    this.repository = new MateriRepository();
  }

  async fetchMateri(params?: MateriQueryParams) {
    try {
      const response = await this.repository.getAll(params);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Gagal memuat data materi",
        data: [],
        pagination: null,
      };
    }
  }

  async getMateriById(id: string) {
    try {
      const data = await this.repository.getById(id);
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Gagal memuat detail materi",
      };
    }
  }

  async createMateri(data: CreateMateriRequest) {
    try {
      // Validations
      if (!data.title.trim()) {
        return {
          success: false,
          error: "Judul materi wajib diisi",
        };
      }
      if (!data.description.trim()) {
        return {
          success: false,
          error: "Deskripsi wajib diisi",
        };
      }
      if (!data.cover) {
        return {
          success: false,
          error: "Cover image wajib diupload",
        };
      }
      if (!data.gallery || data.gallery.length === 0) {
        return {
          success: false,
          error: "Minimal 1 gambar gallery wajib diupload",
        };
      }

      const result = await this.repository.create(data);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Gagal menyimpan materi",
      };
    }
  }

  async updateMateri(id: string, data: UpdateMateriRequest) {
    try {
      if (data.title !== undefined && !data.title.trim()) {
        return {
          success: false,
          error: "Judul materi tidak boleh kosong",
        };
      }

      const result = await this.repository.update(id, data);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Gagal memperbarui materi",
      };
    }
  }

  async deleteMateri(id: string) {
    try {
      await this.repository.delete(id);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Gagal menghapus materi",
      };
    }
  }
}