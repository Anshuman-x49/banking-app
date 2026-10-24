import axiosClient from '../../../config/axios';

/**
 * Dashboard API service — account and transaction data for the dashboard.
 *
 * NOTE: These endpoints are not implemented on the server yet. They define the
 * contract the dashboard will use once the backend exposes them.
 */
const dashboardApi = {
  /** Fetch the current user's accounts. */
  getAccounts: () => axiosClient.get('/dashboard/accounts'),

  /** Fetch the current user's recent transactions. */
  getTransactions: () => axiosClient.get('/dashboard/transactions'),
};

export default dashboardApi;
