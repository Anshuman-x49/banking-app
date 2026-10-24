import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useDispatch } from 'react-redux';
import Navbar from '../../shared/ui/components/Navbar/Navbar';
import { setCredentials } from '../../features/auth/state/authSlice';
import authApi from '../../features/auth/api/authApi';
import './RootLayout.css';

/**
 * Root layout component.
 * Renders the shared Navbar on every page with a main content area via <Outlet />.
 */
const RootLayout = () => {
  const dispatch = useDispatch();

  // Rebuild the session from the refresh cookie on load (the access token lives only
  // in Redux, so a reload would otherwise drop it). A failure just means "guest".
  useEffect(() => {
    authApi
      .refreshToken()
      .then(({ data }) => dispatch(setCredentials(data.data)))
      .catch(() => {});
  }, [dispatch]);

  return (
    <div className="root-layout">
      <Navbar />
      <main className="root-layout__main">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
