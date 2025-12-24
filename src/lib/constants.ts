export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin/login',
    REGISTER: '/admin/register',
    LOGOUT: '/admin/logout',
    REFRESH: '/admin/refresh',
    PROFILE: '/admin/profile',
  },
  ARTICLES: {
    BASE: '/articles',
    BY_ID: (id: string) => `/articles/${id}`,
  },
  VIDEOS: {
    BASE: '/video',
    BY_ID: (id: string) => `/video/${id}`,
  },
  MATERIALS: {
    BASE: '/material',
    BY_ID: (id: string) => `/material/${id}`,
  },
  CLASS: {
    BASE: '/class',
    BY_ID: (id: string) => `/class/${id}`,
  },
  CATEGORY: {
    BASE: '/quizType',
    BY_ID: (id: string) => `/quizType/${id}`,
  },
  QUIZ: {
    BASE: '/quiz',
    BY_ID: (id: string) => `/quiz/${id}`,
  },
  QUESTION: {
    BASE: '/question',
    BY_ID: (id: string) => `/question/${id}`,
    RESPONSES: (id: string) => `/question/${id}/responses`,
  },
  PREDICTION: {
    BASE: '/prediction',
    BY_ID: (id: string) => `/prediction/${id}`,
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
} as const;
