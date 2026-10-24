import { Send, CreditCard, FileText } from 'lucide-react';
import './QuickActions.css';

const quickActions = [
  { label: 'Transfer', icon: Send, color: 'var(--color-primary)' },
  { label: 'Pay Bills', icon: CreditCard, color: 'var(--color-accent)' },
  { label: 'Statements', icon: FileText, color: 'var(--color-warning)' },
];

/**
 * Quick Actions section. Buttons are disabled for guests.
 */
const QuickActions = ({ disabled = false }) => (
  <section className="section">
    <div className="section__container">
      <h2 className="section__title">Quick Actions</h2>
      <div className="actions-grid">
        {quickActions.map((action) => (
          <button
            key={action.label}
            className={`action-card ${disabled ? 'action-card--disabled' : ''}`}
            disabled={disabled}
          >
            <div
              className="action-card__icon"
              style={{ '--action-color': action.color }}
            >
              <action.icon size={24} />
            </div>
            <span className="action-card__label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  </section>
);

export default QuickActions;
