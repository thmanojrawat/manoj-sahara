import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';
const rawMock = import.meta.env.VITE_ENABLE_MOCK_DATA;
export const USE_MOCK = rawMock === true || rawMock === 'true' || rawMock === '"true"';

console.log(`[SAHARA CRM API] Base URL: ${API_BASE_URL} | USE_MOCK: ${USE_MOCK} (raw: ${rawMock})`);

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
