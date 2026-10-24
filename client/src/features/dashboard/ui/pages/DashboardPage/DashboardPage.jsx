import { Link } from 'react-router';
import { Zap, ChevronRight } from 'lucide-react';
import useAuth from '../../../../auth/hooks/useAuth';
import useDashboard from '../../../hooks/useDashboard';
import Button from '../../../../../shared/ui/components/Button/Button';
import BalanceCard from '../../components/BalanceCard/BalanceCard';
import QuickActions from '../../components/QuickActions/QuickActions';
import TransactionList from '../../components/TransactionList/TransactionList';
import FeatureGrid from '../../components/FeatureGrid/FeatureGrid';
import './DashboardPage.css';

/**
 * Dashboard page — the app's landing page.
 * Shows a hero, account balances, quick actions, recent transactions,
 * and (for guests) a marketing feature grid.
 */
const DashboardPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { accounts, transactions } = useDashboard();

  return (
    <div className="dashboard-page" id="dashboard-page">
      {/* ════════ HERO SECTION ════════ */}
      <section className="hero">
        <div className="hero__background">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
          <div className="hero__grid" />
        </div>

        <div className="hero__content">
          {isAuthenticated ? (
            <>
              <p className="hero__greeting">Welcome back,</p>
              <h1 className="hero__title">{user?.name || 'User'}</h1>
              <p className="hero__subtitle">
                Here&apos;s an overview of your finances today.
              </p>
            </>
          ) : (
            <>
              <div className="hero__badge">
                <Zap size={14} />
                <span>Next-Gen Digital Banking</span>
              </div>
              <h1 className="hero__title">
                Your Money,{' '}
                <span className="hero__title-accent">Reimagined.</span>
              </h1>
              <p className="hero__subtitle">
                Experience banking built for the digital age. Instant transfers,
                smart insights, and security that never sleeps.
              </p>
              <div className="hero__cta">
                <Link to="/register">
                  <Button variant="primary" size="lg" icon={<ChevronRight size={18} />}>
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ════════ BALANCE CARDS ════════ */}
      <section className="section">
        <div className="section__container">
          <div className="section__header">
            <h2 className="section__title">
              {isAuthenticated ? 'Your Accounts' : 'Account Overview'}
            </h2>
            {!isAuthenticated && (
              <p className="section__badge">Demo Preview</p>
            )}
          </div>

          <div className="balance-grid">
            {accounts.map((account) => (
              <BalanceCard
                key={account.id}
                account={account}
                masked={!isAuthenticated}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════ QUICK ACTIONS ════════ */}
      <QuickActions disabled={!isAuthenticated} />

      {/* ════════ RECENT TRANSACTIONS ════════ */}
      <TransactionList
        transactions={transactions}
        isAuthenticated={isAuthenticated}
      />

      {/* ════════ FEATURES (Guest only) ════════ */}
      {!isAuthenticated && <FeatureGrid />}
    </div>
  );
};

export default DashboardPage;
