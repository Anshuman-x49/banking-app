import { Link, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { Shield } from 'lucide-react';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import GoogleOAuthButton from '../../components/GoogleOAuthButton/GoogleOAuthButton';
import useAuth from '../../../hooks/useAuth';
import './RegisterPage.css';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="register-page" id="register-page">
      {/* ── Decorative left panel ── */}
      <div className="register-page__panel">
        <div className="register-page__panel-content">
          <div className="register-page__panel-logo">
            <Shield size={48} />
          </div>
          <h2 className="register-page__panel-title">Join VaultPay</h2>
          <p className="register-page__panel-subtitle">
            Open your digital banking account in minutes. Secure, fast, and designed for the modern world.
          </p>
          <div className="register-page__panel-features">
            <div className="register-page__feature">
              <div className="register-page__feature-dot" />
              <span>No minimum balance required</span>
            </div>
            <div className="register-page__feature">
              <div className="register-page__feature-dot" />
              <span>Instant account setup</span>
            </div>
            <div className="register-page__feature">
              <div className="register-page__feature-dot" />
              <span>Free international transfers</span>
            </div>
          </div>
        </div>
        {/* Decorative gradient orbs */}
        <div className="register-page__orb register-page__orb--1" />
        <div className="register-page__orb register-page__orb--2" />
      </div>

      {/* ── Form panel ── */}
      <div className="register-page__form-panel">
        <div className="register-page__form-container">
          <div className="register-page__form-header">
            <h1 className="register-page__form-title">Create Account</h1>
            <p className="register-page__form-subtitle">
              Fill in your details to get started
            </p>
          </div>

          <GoogleOAuthButton />

          <div className="register-page__divider">
            <span>or register with email</span>
          </div>

          <RegisterForm />

          <p className="register-page__footer">
            Already have an account?{' '}
            <Link to="/login" className="register-page__link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
