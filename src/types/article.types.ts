export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  imageUrl?: string;
  category: string;
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {
  id: string;
}
