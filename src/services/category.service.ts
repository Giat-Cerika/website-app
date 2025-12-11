import { categoryRepository } from '@/repositories';
import { Category, CreateCategoryRequest } from '@/types/category.types';
import { PaginationParams } from '@/types/common.types';

export class CategoryService {
  async getCategory(params?: PaginationParams) {
    try {
      return await categoryRepository.getAll(params);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch category');
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      return await categoryRepository.getById(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch category');
    }
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    try {
      return await categoryRepository.create(data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create category');
    }
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    try {
      return await categoryRepository.update(id, data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await categoryRepository.delete(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  }

  async incrementViewCount(id: string): Promise<void> {
    try {
      await categoryRepository.incrementViewCount(id);
    } catch (error: any) {
      console.error('Failed to increment view count:', error);
    }
  }
}

export const categoryService = new CategoryService();