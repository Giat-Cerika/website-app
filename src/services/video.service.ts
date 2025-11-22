// services/video.service.ts
import { videoRepository } from '@/repositories';
import { Video, CreateVideoRequest } from '@/types/video.types';
import { PaginationParams } from '@/types/common.types';

export class VideoService {
  async getVideos(params?: PaginationParams) {
    try {
      return await videoRepository.getAll(params);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch videos');
    }
  }

  async getVideoById(id: string): Promise<Video> {
    try {
      return await videoRepository.getById(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch video');
    }
  }

  async createVideo(data: CreateVideoRequest): Promise<Video> {
    try {
      return await videoRepository.create(data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create video');
    }
  }

  async updateVideo(id: string, data: Partial<Video>): Promise<Video> {
    try {
      return await videoRepository.update(id, data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update video');
    }
  }

  async deleteVideo(id: string): Promise<void> {
    try {
      await videoRepository.delete(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete video');
    }
  }

  async incrementViewCount(id: string): Promise<void> {
    try {
      await videoRepository.incrementViewCount(id);
    } catch (error: any) {
      console.error('Failed to increment view count:', error);
    }
  }
}

export const videoService = new VideoService();