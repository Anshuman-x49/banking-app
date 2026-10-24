import axiosClient from '../../../config/axios';

/**
 * Auth API service — all authentication-related HTTP calls.
 * Uses the centralized axiosClient from src/config/axios.
 */
const authApi = {
  /**
   * Login with email and password.
   * @param {{ email: string, password: string }} credentials
   */
  login: (credentials) => axiosClient.post('/auth/login', credentials),

  /**
   * Register a new user.
   * @param {{ name: string, email: string, password: string }} userData
   */
  register: (userData) => axiosClient.post('/auth/register', userData),

  /**
   * Logout the current user (clears refresh token cookie server-side).
   */
  logout: () => axiosClient.post('/auth/logout'),

  /**
   * Refresh the access token using the HTTP-only refresh token cookie.
   */
  refreshToken: () => axiosClient.post('/auth/refresh-token'),
};

export default authApi;
