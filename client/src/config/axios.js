import axios from 'axios';
import { API_BASE_URL } from '../shared/constants';
import store from '../app/store';
import {
  setCredentials,
  clearCredentials,
} from '../features/auth/state/authSlice';

/**
 * Centralized Axios instance with request/response interceptors.
 *
 * - Request interceptor attaches the Bearer token read from Redux state.
 * - Response interceptor handles 401 errors by attempting a silent token refresh.
 *
 * Note: importing the store here creates a benign import cycle (axios -> store ->
 * authSlice -> authApi -> axios). It is safe because the store is only read inside
 * interceptor callbacks, which run long after all modules have initialised.
 */
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send cookies (refreshToken)
});

// ── Request Interceptor ──
axiosClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor ──
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Attempt silent token refresh on 401 (only once per request)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        // Keep Redux in sync so subsequent requests use the fresh token
        store.dispatch(setCredentials(data.data));
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        store.dispatch(clearCredentials());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
