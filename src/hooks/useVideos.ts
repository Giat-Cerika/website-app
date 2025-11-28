import { useEffect } from "react";
import { useVideoStore } from "@/stores";

export function useVideos() {
  const {
    videos,
    selectedVideo,
    isLoading,
    error,
    fetchVideos,
    fetchVideoById,
    createVideo,
    updateVideo,
    deleteVideo,
    // incrementViewCount,
    clearError,
  } = useVideoStore();

  useEffect(() => {
    if (videos.length === 0 && !isLoading) {
      fetchVideos();
    }
  }, [videos.length, isLoading, fetchVideos]);

  return {
    videos,
    selectedVideo,
    isLoading,
    error,
    fetchVideos,
    fetchVideoById,
    createVideo,
    updateVideo,
    deleteVideo,
    // incrementViewCount,
    clearError,
  };
}
