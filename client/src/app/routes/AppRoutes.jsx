import { createBrowserRouter } from 'react-router';
import RootLayout from '../layouts/RootLayout';
import LoginPage from '../../features/auth/ui/pages/LoginPage/LoginPage';
import RegisterPage from '../../features/auth/ui/pages/RegisterPage/RegisterPage';
import DashboardPage from '../../features/dashboard/ui/pages/DashboardPage/DashboardPage';

/**
 * Data-based route configuration using createBrowserRouter.
 * This is the single source of truth for all application routes.
 * Every page is imported from its owning feature's `ui/pages` folder.
 * All routes are wrapped in the RootLayout which provides the Navbar + Outlet.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
]);
