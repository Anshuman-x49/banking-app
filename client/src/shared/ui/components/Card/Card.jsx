import './Card.css';

/**
 * Glassmorphic Card wrapper component.
 *
 * @param {'default'|'elevated'|'gradient'} [variant='default']
 * @param {boolean} [hoverable=false]
 * @param {React.ReactNode} children
 */
const Card = ({ children, variant = 'default', hoverable = false, className = '', ...rest }) => {
  const classes = [
    'card',
    `card--${variant}`,
    hoverable && 'card--hoverable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};

export default Card;
