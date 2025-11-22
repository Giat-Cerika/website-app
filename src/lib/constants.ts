// lib/constants.ts
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
  CLASS: {
    BASE: '/class',
    BY_ID: (id: string) => `/class/${id}`,
  },
  QUESTIONNAIRES: {
    BASE: '/questionnaires',
    BY_ID: (id: string) => `/questionnaires/${id}`,
    RESPONSES: (id: string) => `/questionnaires/${id}/responses`,
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
} as const;
