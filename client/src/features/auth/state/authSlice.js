import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../api/authApi';

// ════════════════════════════════════════
//  Async Thunks
// ════════════════════════════════════════

/**
 * Login a user with email and password.
 * On success, returns { user, accessToken }; the token lives in Redux only.
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Login failed' },
      );
    }
  },
);

/**
 * Register a new user.
 * On success, returns { user, accessToken }; the token lives in Redux only.
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Registration failed' },
      );
    }
  },
);

/**
 * Logout the current user (clears the refresh token cookie server-side).
 */
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
    } catch (error) {
      // Even if logout API fails, local state is force-cleared by the reducer
      return rejectWithValue(
        error.response?.data || { message: 'Logout failed' },
      );
    }
  },
);

// ════════════════════════════════════════
//  Initial State
// ════════════════════════════════════════

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ════════════════════════════════════════
//  Slice
// ════════════════════════════════════════

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Clear any error state */
    clearError(state) {
      state.error = null;
    },

    /** Manually set credentials (e.g., after a silent refresh or Google OAuth) */
    setCredentials(state, action) {
      if (action.payload.user) state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
    },

    /** Clear credentials when the session can no longer be refreshed */
    clearCredentials(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    // ── Login ──
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── Register ──
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── Logout ──
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Force-clear auth state even on failure
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { clearError, setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
