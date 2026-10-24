import { Link, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { Shield } from 'lucide-react';
import LoginForm from '../../components/LoginForm/LoginForm';
import GoogleOAuthButton from '../../components/GoogleOAuthButton/GoogleOAuthButton';
import useAuth from '../../../hooks/useAuth';
import './LoginPage.css';

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-page" id="login-page">
      {/* ── Decorative left panel ── */}
      <div className="login-page__panel">
        <div className="login-page__panel-content">
          <div className="login-page__panel-logo">
            <Shield size={48} />
          </div>
          <h2 className="login-page__panel-title">Welcome back</h2>
          <p className="login-page__panel-subtitle">
            Sign in to access your accounts, track transactions, and manage your finances securely.
          </p>
          <div className="login-page__panel-features">
            <div className="login-page__feature">
              <div className="login-page__feature-dot" />
              <span>256-bit encryption</span>
            </div>
            <div className="login-page__feature">
              <div className="login-page__feature-dot" />
              <span>Real-time notifications</span>
            </div>
            <div className="login-page__feature">
              <div className="login-page__feature-dot" />
              <span>24/7 fraud protection</span>
            </div>
          </div>
        </div>
        {/* Decorative gradient orbs */}
        <div className="login-page__orb login-page__orb--1" />
        <div className="login-page__orb login-page__orb--2" />
      </div>

      {/* ── Form panel ── */}
      <div className="login-page__form-panel">
        <div className="login-page__form-container">
          <div className="login-page__form-header">
            <h1 className="login-page__form-title">Sign In</h1>
            <p className="login-page__form-subtitle">
              Enter your credentials to access your account
            </p>
          </div>

          <GoogleOAuthButton />

          <div className="login-page__divider">
            <span>or continue with email</span>
          </div>

          <LoginForm />

          <p className="login-page__footer">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="login-page__link">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
