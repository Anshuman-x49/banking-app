import { useSelector, useDispatch } from 'react-redux';
import {
  loginUser,
  registerUser,
  logoutUser,
  clearError,
  setCredentials,
} from '../state/authSlice';

/**
 * Custom hook to access auth state and dispatch auth actions.
 * Provides a clean API for components to interact with the auth feature.
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    // State
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,

    // Actions
    login: (credentials) => dispatch(loginUser(credentials)),
    register: (userData) => dispatch(registerUser(userData)),
    logout: () => dispatch(logoutUser()),
    clearError: () => dispatch(clearError()),
    setCredentials: (data) => dispatch(setCredentials(data)),
  };
};

export default useAuth;
