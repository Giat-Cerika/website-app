import { classRepository } from '@/repositories';
import { Class, CreateClassRequest } from '@/types/class.types';
import { PaginationParams } from '@/types/common.types';

export class ClassService {
  async getClass(params?: PaginationParams) {
    try {
      return await classRepository.getAll(params);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch class');
    }
  }

  async getClassById(id: string): Promise<Class> {
    try {
      return await classRepository.getById(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch class');
    }
  }

  async createClass(data: CreateClassRequest): Promise<Class> {
    try {
      return await classRepository.create(data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create class');
    }
  }

  async updateClass(id: string, data: Partial<Class>): Promise<Class> {
    try {
      return await classRepository.update(id, data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update class');
    }
  }

  async deleteClass(id: string): Promise<void> {
    try {
      await classRepository.delete(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete class');
    }
  }

  async incrementViewCount(id: string): Promise<void> {
    try {
      await classRepository.incrementViewCount(id);
    } catch (error: any) {
      console.error('Failed to increment view count:', error);
    }
  }
}

export const classService = new ClassService();