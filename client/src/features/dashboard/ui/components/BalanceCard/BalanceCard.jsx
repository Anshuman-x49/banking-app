import { TrendingUp, ArrowDownLeft } from 'lucide-react';
import Card from '../../../../../shared/ui/components/Card/Card';
import { formatCurrency } from '../../../../../shared/utils';
import './BalanceCard.css';

/**
 * A single account balance card. Shows the account name, masked number,
 * balance (or masked value for guests), and the change percentage.
 */
const BalanceCard = ({ account, masked = false }) => {
  const isPositive = account.change >= 0;

  return (
    <Card variant="gradient" hoverable>
      <div className={`balance-card ${masked ? 'balance-card--blurred' : ''}`}>
        <div className="balance-card__header">
          <span className="balance-card__name">{account.name}</span>
          <span className="balance-card__number">{account.number}</span>
        </div>
        <div className="balance-card__amount">
          <span className="balance-card__value">
            {masked ? '••••••' : formatCurrency(account.balance)}
          </span>
          <span
            className={`balance-card__change ${
              isPositive
                ? 'balance-card__change--positive'
                : 'balance-card__change--negative'
            }`}
          >
            {isPositive ? <TrendingUp size={14} /> : <ArrowDownLeft size={14} />}
            {Math.abs(account.change)}%
          </span>
        </div>
      </div>
    </Card>
  );
};

export default BalanceCard;
