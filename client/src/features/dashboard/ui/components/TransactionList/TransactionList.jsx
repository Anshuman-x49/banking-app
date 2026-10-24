import { Link } from 'react-router';
import { FileText, ChevronRight } from 'lucide-react';
import Button from '../../../../../shared/ui/components/Button/Button';
import Card from '../../../../../shared/ui/components/Card/Card';
import { formatCurrency } from '../../../../../shared/utils';
import './TransactionList.css';

/**
 * Recent Transactions section.
 * Renders the transaction list for authenticated users, or a sign-in
 * placeholder card for guests.
 */
const TransactionList = ({ transactions = [], isAuthenticated = false }) => (
  <section className="section">
    <div className="section__container">
      <div className="section__header">
        <h2 className="section__title">Recent Transactions</h2>
        {isAuthenticated && (
          <button className="section__view-all">
            View All <ChevronRight size={16} />
          </button>
        )}
      </div>

      {isAuthenticated ? (
        <div className="transactions-list">
          {transactions.map((tx) => (
            <div key={tx.id} className="transaction">
              <div className="transaction__icon">{tx.icon}</div>
              <div className="transaction__info">
                <span className="transaction__name">{tx.name}</span>
                <span className="transaction__category">{tx.category}</span>
              </div>
              <div className="transaction__details">
                <span
                  className={`transaction__amount ${
                    tx.amount >= 0
                      ? 'transaction__amount--positive'
                      : 'transaction__amount--negative'
                  }`}
                >
                  {tx.amount >= 0 ? '+' : ''}
                  {formatCurrency(tx.amount)}
                </span>
                <span className="transaction__date">{tx.date}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card variant="elevated">
          <div className="transactions-placeholder">
            <FileText size={48} className="transactions-placeholder__icon" />
            <p className="transactions-placeholder__text">
              Sign in to view your recent activity
            </p>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  </section>
);

export default TransactionList;
