// services/article.service.ts
import { articleRepository } from '@/repositories';
import { Article, CreateArticleRequest, UpdateArticleRequest } from '@/types/article.types';
import { PaginationParams } from '@/types/common.types';

export class ArticleService {
  async getArticles(params?: PaginationParams) {
    try {
      return await articleRepository.getAll(params);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch articles');
    }
  }

  async getArticleById(id: string): Promise<Article> {
    try {
      return await articleRepository.getById(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch article');
    }
  }

  async createArticle(data: CreateArticleRequest): Promise<Article> {
    try {
      return await articleRepository.create(data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create article');
    }
  }

  async updateArticle(id: string, data: UpdateArticleRequest): Promise<Article> {
    try {
      return await articleRepository.update(id, data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update article');
    }
  }

  async deleteArticle(id: string): Promise<void> {
    try {
      await articleRepository.delete(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete article');
    }
  }

  async searchArticles(query: string): Promise<Article[]> {
    try {
      return await articleRepository.search(query);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search articles');
    }
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    try {
      return await articleRepository.getByCategory(category);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch articles by category');
    }
  }
}

export const articleService = new ArticleService();