import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';
export const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_DATA !== 'false';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for future token injection (Clerk / JWT)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sahara_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
