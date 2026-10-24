import { useSelector, useDispatch } from 'react-redux';
import {
  setAccounts,
  setTransactions,
} from '../state/dashboardSlice';

/**
 * Custom hook to access dashboard state and dispatch dashboard actions.
 * Provides a clean API for components to interact with the dashboard feature.
 */
const useDashboard = () => {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard);

  return {
    // State
    accounts: dashboard.accounts,
    transactions: dashboard.transactions,
    isLoading: dashboard.isLoading,
    error: dashboard.error,

    // Actions
    setAccounts: (accounts) => dispatch(setAccounts(accounts)),
    setTransactions: (transactions) => dispatch(setTransactions(transactions)),
  };
};

export default useDashboard;
