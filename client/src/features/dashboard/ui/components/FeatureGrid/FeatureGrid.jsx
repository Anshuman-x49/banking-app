import { Shield, Zap, Globe } from 'lucide-react';
import Card from '../../../../../shared/ui/components/Card/Card';
import './FeatureGrid.css';

const features = [
  { icon: Shield, title: 'Bank-Grade Security', desc: '256-bit AES encryption with biometric authentication' },
  { icon: Zap, title: 'Instant Transfers', desc: 'Move money in seconds with zero processing fees' },
  { icon: Globe, title: 'Global Access', desc: 'Send and receive money in 150+ currencies worldwide' },
];

/**
 * "Why VaultPay?" feature grid. Rendered for guests only.
 */
const FeatureGrid = () => (
  <section className="section section--features">
    <div className="section__container">
      <div className="section__header section__header--center">
        <h2 className="section__title">Why VaultPay?</h2>
        <p className="section__description">
          Built with cutting-edge technology to give you the best banking experience.
        </p>
      </div>
      <div className="features-grid">
        {features.map((feature) => (
          <Card key={feature.title} variant="elevated" hoverable>
            <div className="feature-card">
              <div className="feature-card__icon">
                <feature.icon size={28} />
              </div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureGrid;
