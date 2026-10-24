import { Link, useNavigate } from 'react-router';
import { Shield, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import useAuth from '../../../../features/auth/hooks/useAuth';
import Button from '../Button/Button';
import { getInitials } from '../../../utils';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="navbar" id="navbar">
      <div className="navbar__container">
        {/* ── Brand ── */}
        <Link to="/" className="navbar__brand" onClick={() => setMobileOpen(false)}>
          <div className="navbar__logo">
            <Shield size={24} />
          </div>
          <span className="navbar__brand-text">VaultPay</span>
        </Link>

        {/* ── Mobile toggle ── */}
        <button
          className="navbar__toggle"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* ── Navigation actions ── */}
        <div className={`navbar__actions ${mobileOpen ? 'navbar__actions--open' : ''}`}>
          {isAuthenticated ? (
            <>
              <div className="navbar__user">
                <div className="navbar__avatar" title={user?.name}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="navbar__avatar-img" />
                  ) : (
                    <span className="navbar__avatar-initials">{getInitials(user?.name)}</span>
                  )}
                </div>
                <span className="navbar__username">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={<LogOut size={16} />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
