// repositories/index.ts
export * from './base.repository';
export * from './auth.repository';
export * from './article.repository';
export * from './video.repository';
export * from './class.repository';
export * from './category.repository';
export * from './quiz.repository';
export * from './question.repository';
export * from './quiz-history.repository';

// Import classes first
import { AuthRepository } from './auth.repository';
import { ArticleRepository } from './article.repository';
import { VideoRepository } from './video.repository';
import { ClassRepository } from './class.repository';
import { CategoryRepository } from './category.repository';
import { QuizRepository } from './quiz.repository';
import { QuestionRepository } from './question.repository';
import { PredictionRepository } from './prediction.repository';
import { QuizHistoryRepository } from './quiz-history.repository';

// Create singleton instances
export const authRepository = new AuthRepository();
export const articleRepository = new ArticleRepository();
export const videoRepository = new VideoRepository();
export const classRepository = new ClassRepository();
export const categoryRepository = new CategoryRepository();
export const quizRepository = new QuizRepository();
export const questionRepository = new QuestionRepository();
export const predictionRepository = new PredictionRepository();
export const quizHistoryRepository = new QuizHistoryRepository();