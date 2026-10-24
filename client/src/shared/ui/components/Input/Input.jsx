import { forwardRef } from 'react';
import './Input.css';

/**
 * Reusable Input component with label, error message, and icon support.
 * Designed to forward `ref` for react-hook-form `register()` integration.
 *
 * @param {string} label
 * @param {string} [error] - Error message to display below the input
 * @param {React.ReactNode} [icon] - Leading icon element
 * @param {string} [id]
 * @param {object} rest - Additional HTML input attributes
 */
const Input = forwardRef(({ label, error, icon, id, className = '', ...rest }, ref) => {
  const inputId = id || rest.name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-group__label">
          {label}
        </label>
      )}
      <div className="input-group__wrapper">
        {icon && <span className="input-group__icon">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={`input-group__field ${icon ? 'input-group__field--with-icon' : ''}`}
          {...rest}
        />
      </div>
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
