export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVideoRequest {
  title: string;
  description: string;
  videoUrl: string;
}
