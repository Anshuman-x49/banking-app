import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import Input from '../../../../../shared/ui/components/Input/Input';
import Button from '../../../../../shared/ui/components/Button/Button';
import './LoginForm.css';

const LoginForm = () => {
  const { login, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  // Map server-side field errors into react-hook-form
  useEffect(() => {
    if (error?.errors) {
      error.errors.forEach((err) => {
        if (err.path && err.msg) {
          setFormError(err.path, { type: 'server', message: err.msg });
        }
      });
    }
  }, [error, setFormError]);

  // Clear Redux error state on unmount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data) => {
    await login(data);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Server-level error banner */}
      {error?.message && !error.errors && (
        <div className="login-form__alert" role="alert">
          <AlertCircle size={16} />
          <span>{error.message}</span>
        </div>
      )}

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        icon={<Mail size={18} />}
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address',
          },
        })}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        icon={<Lock size={18} />}
        error={errors.password?.message}
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        })}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
        id="login-submit-btn"
      >
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
