import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/state/authSlice';
import dashboardReducer from '../features/dashboard/state/dashboardSlice';

/**
 * Redux Toolkit store configuration.
 * All feature slices are registered here.
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
