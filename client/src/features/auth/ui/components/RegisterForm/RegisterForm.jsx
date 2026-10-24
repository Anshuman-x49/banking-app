import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { User, Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import Input from '../../../../../shared/ui/components/Input/Input';
import Button from '../../../../../shared/ui/components/Button/Button';
import './RegisterForm.css';

const RegisterForm = () => {
  const { register: registerUser, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setError: setFormError,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');

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
    const { confirmPassword, ...userData } = data;
    await registerUser(userData);
  };

  return (
    <form className="register-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Server-level error banner */}
      {error?.message && !error.errors && (
        <div className="register-form__alert" role="alert">
          <AlertCircle size={16} />
          <span>{error.message}</span>
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        icon={<User size={18} />}
        error={errors.name?.message}
        {...register('name', {
          required: 'Full name is required',
          minLength: {
            value: 3,
            message: 'Name must be at least 3 characters',
          },
        })}
      />

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
        placeholder="Min. 6 characters"
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

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Re-enter your password"
        icon={<ShieldCheck size={18} />}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (value) =>
            value === passwordValue || 'Passwords do not match',
        })}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
        id="register-submit-btn"
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
