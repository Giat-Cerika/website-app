import { useEffect } from 'react';
import { useArticleStore } from '@/stores';

export function useArticles() {
  const {
    articles,
    selectedArticle,
    isLoading,
    error,
    pagination,
    fetchArticles,
    fetchArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    searchArticles,
    clearError,
  } = useArticleStore();

  useEffect(() => {
    if (articles.length === 0 && !isLoading) {
      fetchArticles();
    }
  }, [articles.length, isLoading, fetchArticles]);

  return {
    articles,
    selectedArticle,
    isLoading,
    error,
    pagination,
    fetchArticles,
    fetchArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    searchArticles,
    clearError,
  };
}