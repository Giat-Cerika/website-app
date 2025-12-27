import { quizHistoryRepository } from '@/repositories/quiz-history.repository';
import { QuizHistory, QuizHistoryStats, DetailHistory } from '@/types/quiz-history.types';

class QuizHistoryService {
  /**
   * Fetch all quiz histories from API
   */
  async getQuizHistories(): Promise<QuizHistory[]> {
    try {
      return await quizHistoryRepository.getAll();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quiz histories');
    }
  }

  /**
   * Fetch single quiz history by ID
   */
  async getQuizHistoryById(quizId: string): Promise<QuizHistory> {
    try {
      return await quizHistoryRepository.getById(quizId);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quiz history');
    }
  }

  /**
   * Calculate statistics from quiz detail histories
   */
  calculateStats(details: DetailHistory[]): QuizHistoryStats {
    const total = details.length;
    const avgScore = total > 0 
      ? details.reduce((sum, d) => sum + d.percentage, 0) / total 
      : 0;
    const completed = details.filter(d => d.status === "completed").length;

    return {
      total,
      avgScore: avgScore.toFixed(1),
      completed
    };
  }

  getStatusLabel(category: number): { label: string; color: string } {
    switch (category) {
      case 1:
        return { 
          label: "Baik", 
          color: "bg-green-100 text-green-700 border-green-300" 
        };
      case 2:
        return { 
          label: "Sedang", 
          color: "bg-yellow-100 text-yellow-700 border-yellow-300" 
        };
      case 3:
        return { 
          label: "Buruk", 
          color: "bg-red-100 text-red-700 border-red-300" 
        };
      default:
        return { 
          label: "Tidak Diketahui", 
          color: "bg-gray-100 text-gray-700 border-gray-300" 
        };
    }
  }

  /**
   * Filter quiz histories by search query
   */
  filterQuizHistories(quizzes: QuizHistory[], searchQuery: string): QuizHistory[] {
    if (!searchQuery.trim()) return quizzes;

    const query = searchQuery.toLowerCase();
    return quizzes.filter(quiz =>
      quiz.title.toLowerCase().includes(query) ||
      quiz.description.toLowerCase().includes(query)
    );
  }

  /**
   * Sort quiz histories by date (newest first)
   */
  sortByDate(quizzes: QuizHistory[]): QuizHistory[] {
    return [...quizzes].sort((a, b) => {
      const dateA = new Date(a.start_date).getTime();
      const dateB = new Date(b.start_date).getTime();
      return dateB - dateA; // Descending order
    });
  }
}

export const quizHistoryService = new QuizHistoryService();