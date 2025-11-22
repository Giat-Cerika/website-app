import { BaseRepository } from './base.repository';
import { Article, CreateArticleRequest, UpdateArticleRequest } from '@/types/article.types';
import { API_ENDPOINTS } from '@/lib/constants';
import axiosInstance from '@/lib/axios';

export class ArticleRepository extends BaseRepository<Article> {
  constructor() {
    super(API_ENDPOINTS.ARTICLES.BASE);
  }

  async getByCategory(category: string): Promise<Article[]> {
    const response = await axiosInstance.get<{ data: Article[] }>(
      `${this.endpoint}?category=${category}`
    );
    return response.data.data;
  }

  async search(query: string): Promise<Article[]> {
    const response = await axiosInstance.get<{ data: Article[] }>(
      `${this.endpoint}/search?q=${query}`
    );
    return response.data.data;
  }
}