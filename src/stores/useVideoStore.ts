import { create } from "zustand";
import { Video } from "@/types/video.types";
import { videoService } from "@/services/video.service";

interface VideoState {
  videos: Video[];
  selectedVideo: Video | null;
  isLoading: boolean;
  error: string | null;
  total:number;

  fetchVideos: (params?: any) => Promise<void>;
  fetchVideoById: (id: string) => Promise<void>;
  createVideo: (data: any) => Promise<void>;
  updateVideo: (id: string, data: any) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  videos: [],
  selectedVideo: null,
  isLoading: false,
  error: null,
  total: 0,

  fetchVideos: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await videoService.getVideos(params);

      const mappedVideos: Video[] = response.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        videoUrl: item.video_path || item.url,
        createdAt: item.createdAt || "",
        updatedAt: item.updatedAt || "",
      }));

      set({ videos: mappedVideos, isLoading: false, total: response.pagination.total_data });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchVideoById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const video = await videoService.getVideoById(id);
      set({ selectedVideo: video, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createVideo: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newVideo = await videoService.createVideo(data);
      set((state) => ({
        videos: [newVideo, ...state.videos],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateVideo: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedVideo = await videoService.updateVideo(id, data);
      set((state) => ({
        videos: state.videos.map((video) =>
          video.id === id ? updatedVideo : video
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteVideo: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await videoService.deleteVideo(id);
      set((state) => ({
        videos: state.videos.filter((video) => video.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
