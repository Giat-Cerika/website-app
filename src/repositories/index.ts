// repositories/index.ts
export * from './base.repository';
export * from './auth.repository';
export * from './article.repository';
export * from './video.repository';
export * from './class.repository';
export * from './category.repository';
export * from './questionnaire.repository';
export * from './quiz.repository';

// Import classes first
import { AuthRepository } from './auth.repository';
import { ArticleRepository } from './article.repository';
import { VideoRepository } from './video.repository';
import { ClassRepository } from './class.repository';
import { CategoryRepository } from './category.repository';
import { QuizRepository } from './quiz.repository';
import { QuestionnaireRepository } from './questionnaire.repository';

// Create singleton instances
export const authRepository = new AuthRepository();
export const articleRepository = new ArticleRepository();
export const videoRepository = new VideoRepository();
export const classRepository = new ClassRepository();
export const categoryRepository = new CategoryRepository();
export const quizRepository = new QuizRepository();
export const questionnaireRepository = new QuestionnaireRepository();