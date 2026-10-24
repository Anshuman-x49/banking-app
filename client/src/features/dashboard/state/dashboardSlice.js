import { createSlice } from '@reduxjs/toolkit';

// ════════════════════════════════════════
//  Mock data (until the dashboard API is live)
// ════════════════════════════════════════

const mockAccounts = [
  { id: 1, name: 'Checking Account', number: '••••  4829', balance: 24580.5, change: +2.4 },
  { id: 2, name: 'Savings Account', number: '••••  7312', balance: 85230.0, change: +5.1 },
  { id: 3, name: 'Investment Portfolio', number: '••••  1056', balance: 142750.75, change: -1.2 },
];

const mockTransactions = [
  { id: 1, name: 'Netflix Subscription', category: 'Entertainment', amount: -15.99, date: '2026-10-17', icon: '🎬' },
  { id: 2, name: 'Salary Deposit', category: 'Income', amount: 4500.0, date: '2026-10-15', icon: '💰' },
  { id: 3, name: 'Amazon Purchase', category: 'Shopping', amount: -89.99, date: '2026-10-14', icon: '📦' },
  { id: 4, name: 'Coffee Shop', category: 'Food & Drink', amount: -6.50, date: '2026-10-14', icon: '☕' },
  { id: 5, name: 'Freelance Payment', category: 'Income', amount: 1200.0, date: '2026-10-12', icon: '💼' },
];

// ════════════════════════════════════════
//  Initial State
// ════════════════════════════════════════

const initialState = {
  accounts: mockAccounts,
  transactions: mockTransactions,
  isLoading: false,
  error: null,
};

// ════════════════════════════════════════
//  Slice
// ════════════════════════════════════════

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    /** Replace the accounts list (e.g., after fetching from the API). */
    setAccounts(state, action) {
      state.accounts = action.payload;
    },

    /** Replace the transactions list (e.g., after fetching from the API). */
    setTransactions(state, action) {
      state.transactions = action.payload;
    },
  },
});

export const { setAccounts, setTransactions } = dashboardSlice.actions;
export default dashboardSlice.reducer;
