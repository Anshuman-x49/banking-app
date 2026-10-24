import { Loader2 } from 'lucide-react';
import './Button.css';

/**
 * Reusable Button component.
 *
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} [variant='primary']
 * @param {'sm'|'md'|'lg'} [size='md']
 * @param {boolean} [isLoading=false]
 * @param {boolean} [fullWidth=false]
 * @param {React.ReactNode} [icon]
 * @param {React.ReactNode} children
 * @param {object} rest - Additional HTML button attributes
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  className = '',
  ...rest
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full',
    isLoading && 'btn--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={isLoading || rest.disabled} {...rest}>
      {isLoading ? (
        <Loader2 className="btn__spinner" size={18} />
      ) : (
        <>
          {icon && <span className="btn__icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
