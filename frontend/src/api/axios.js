import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('world-design-admin-auth');
  if (stored) {
    try {
      const auth = JSON.parse(stored);
      if (auth?.state?.accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${auth.state.accessToken}`;
      }
    } catch {
      // ignore
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('world-design-admin-auth');
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && !window.location.pathname.startsWith('/admin/login')) {
        window.location.assign('/admin/login');
      }
    }
    return Promise.reject(error);
  },
);

export default api;
