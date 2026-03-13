import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const courseService = {
  getAllCourses: () => api.get('/api/courses'),
  getCourseById: (id) => api.get(`/api/courses/${id}`),
  createCourse: (data) => api.post('/api/courses', data),
  updateCourse: (id, data) => api.put(`/api/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/api/courses/${id}`),
};

export const lessonService = {
  getLessonsByCourse: (courseId) => api.get(`/api/lessons?courseId=${courseId}`),
  getLessonById: (id) => api.get(`/api/lessons/${id}`),
  createLesson: (data) => api.post('/api/lessons', data),
  updateLesson: (id, data) => api.put(`/api/lessons/${id}`, data),
  deleteLesson: (id) => api.delete(`/api/lessons/${id}`),
};

export const quizService = {
  getQuizzesByCourse: (courseId) => api.get(`/api/quizzes?courseId=${courseId}`),
  getQuizById: (id) => api.get(`/api/quizzes/${id}`),
  submitQuiz: (id, data) => api.post(`/api/quizzes/${id}/submit`, data),
};

export const enrollmentService = {
  enrollCourse: (courseId) => api.post('/api/enrollments', { courseId }),
  getMyEnrollments: () => api.get('/api/enrollments/my'),
  getEnrollmentProgress: (enrollmentId) => api.get(`/api/enrollments/${enrollmentId}/progress`),
};

export default api;
