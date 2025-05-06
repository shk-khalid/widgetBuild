import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../../service/authService';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Briefcase, User, Loader, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '../../lib/supabase';
import AuthLayout from '../../components/auth/AuthLayout';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameAutofilled, setNameAutofilled] = useState(false);
  const [emailAutofilled, setEmailAutofilled] = useState(false);
  const [passwordAutofilled, setPasswordAutofilled] = useState(false);
  const [confirmPasswordAutofilled, setConfirmPasswordAutofilled] = useState(false);
  const [formMounted, setFormMounted] = useState(false);
  const navigate = useNavigate();

  // Set mounted flag after render to prevent false autofill detection
  useEffect(() => {
    setFormMounted(true);
  }, []);

  // Check for autofilled fields on page load
  useEffect(() => {
    if (!formMounted) return;

    // Short delay to allow browser autofill to complete
    const timer = setTimeout(() => {
      const nameInput = document.getElementById('name') as HTMLInputElement;
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;

      if (nameInput && nameInput.value) {
        setName(nameInput.value);
        setNameAutofilled(!!nameInput.value);
      }

      if (emailInput && emailInput.value) {
        setEmail(emailInput.value);
        setEmailAutofilled(!!emailInput.value);
      }

      if (passwordInput && passwordInput.value) {
        setPassword(passwordInput.value);
        setPasswordAutofilled(!!passwordInput.value);
      }

      if (confirmPasswordInput && confirmPasswordInput.value) {
        setConfirmPassword(confirmPasswordInput.value);
        setConfirmPasswordAutofilled(!!confirmPasswordInput.value);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formMounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signUp(email, password, role, name);

      if (error) throw error;

      toast.success('Account created successfully! You can now sign in.');
      navigate('/email-verification', {
        state: {
          email,
          message: 'Please check your email to verify your account.'
        }
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Handler for detecting autofill
  const handleAnimationStart = (e: React.AnimationEvent<HTMLInputElement>, field: 'name' | 'email' | 'password' | 'confirmPassword') => {
    // Only process after component is fully mounted to avoid false positives
    if (!formMounted) return;

    // The animation name for WebKit autofill is 'onAutoFillStart'
    if (e.animationName.includes('AutoFill') || e.animationName.includes('autofill')) {
      if (field === 'name') {
        if (e.currentTarget.value) {
          setName(e.currentTarget.value);
          setNameAutofilled(true);
        }
      } else if (field === 'email') {
        if (e.currentTarget.value) {
          setEmail(e.currentTarget.value);
          setEmailAutofilled(true);
        }
      } else if (field === 'password') {
        if (e.currentTarget.value) {
          setPassword(e.currentTarget.value);
          setPasswordAutofilled(true);
        }
      } else if (field === 'confirmPassword') {
        if (e.currentTarget.value) {
          setConfirmPassword(e.currentTarget.value);
          setConfirmPasswordAutofilled(true);
        }
      }
    }
  };

  // Explicitly check if input has a true value to determine label position
  const hasValue = (value: string) => {
    return value !== undefined && value !== null && value.trim() !== '';
  };

  return (
    <AuthLayout
      title="Create a new account"
      subtitle={
        <>
          Or{' '}
          <Link to="/login" className="tw-font-medium tw-text-cyan-500 hover:tw-text-cyan-400 tw-transition-colors tw-duration-300">
            sign in to your existing account
          </Link>
        </>
      }
    >
      <form className="tw-space-y-6" onSubmit={handleSubmit}>
        <div className="tw-relative">
          <div className="tw-relative">
            <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
              <User className="tw-h-5 tw-w-5 tw-text-gray-500" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              onAnimationStart={(e) => handleAnimationStart(e, 'name')}
              className="tw-py-2 tw-pl-10 tw-block tw-w-full tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded-md focus:tw-ring-cyan-500 focus:tw-border-cyan-500 tw-text-gray-200 tw-text-sm"
              placeholder=""
            />
            <label
              htmlFor="name"
              className={`tw-absolute tw-bg-gray-900 tw-text-sm tw-transition-all tw-duration-200 ${hasValue(name) || nameAutofilled ? 'tw-top-0 tw-px-1 tw-text-cyan-500 -tw-translate-y-3 tw-left-2' : 'tw-top-2 tw-left-10 tw-text-gray-500'
                }`}
            >
              Full name
            </label>
          </div>
        </div>

        <div className="tw-relative">
          <div className="tw-relative">
            <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
              <Mail className="tw-h-5 tw-w-5 tw-text-gray-500" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onAnimationStart={(e) => handleAnimationStart(e, 'email')}
              className="tw-py-2 tw-pl-10 tw-block tw-w-full tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded-md focus:tw-ring-cyan-500 focus:tw-border-cyan-500 tw-text-gray-200 tw-text-sm"
              placeholder=""
            />
            <label
              htmlFor="email"
              className={`tw-absolute tw-bg-gray-900 tw-text-sm tw-transition-all tw-duration-200 ${hasValue(email) || emailAutofilled ? 'tw-top-0 tw-px-1 tw-text-cyan-500 -tw-translate-y-3 tw-left-2' : 'tw-top-2 tw-left-10 tw-text-gray-500'
                }`}
            >
              Email address
            </label>
          </div>
        </div>

        <div className="tw-relative">
          <div className="tw-relative">
            <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
              <Lock className="tw-h-5 tw-w-5 tw-text-gray-500" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onAnimationStart={(e) => handleAnimationStart(e, 'password')}
              className="tw-py-2 tw-pl-10 tw-pr-10 tw-block tw-w-full tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded-md focus:tw-ring-cyan-500 focus:tw-border-cyan-500 tw-text-gray-200 tw-text-sm"
              placeholder=""
            />
            <label
              htmlFor="password"
              className={`tw-absolute tw-bg-gray-900 tw-text-sm tw-transition-all tw-duration-200 ${hasValue(password) || passwordAutofilled ? 'tw-top-0 tw-px-1 tw-text-cyan-500 -tw-translate-y-3 tw-left-2' : 'tw-top-2 tw-left-10 tw-text-gray-500'
                }`}
            >
              Password
            </label>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="tw-absolute tw-inset-y-0 tw-right-0 tw-pr-3 tw-flex tw-items-center tw-text-gray-500 hover:tw-text-cyan-500 focus:tw-outline-none"
            >
              {showPassword ? (
                <EyeOff className="tw-h-5 tw-w-5" />
              ) : (
                <Eye className="tw-h-5 tw-w-5" />
              )}
            </button>
          </div>
          <p className="tw-text-xs tw-text-gray-500 tw-mt-1">Password must be at least 6 characters</p>
        </div>

        <div className="tw-relative">
          <div className="tw-relative">
            <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
              <Lock className="tw-h-5 tw-w-5 tw-text-gray-500" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onAnimationStart={(e) => handleAnimationStart(e, 'confirmPassword')}
              className="tw-py-2 tw-pl-10 tw-pr-10 tw-block tw-w-full tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded-md focus:tw-ring-cyan-500 focus:tw-border-cyan-500 tw-text-gray-200 tw-text-sm"
              placeholder=""
            />
            <label
              htmlFor="confirmPassword"
              className={`tw-absolute tw-bg-gray-900 tw-text-sm tw-transition-all tw-duration-200 ${hasValue(confirmPassword) || confirmPasswordAutofilled ? 'tw-top-0 tw-px-1 tw-text-cyan-500 -tw-translate-y-3 tw-left-2' : 'tw-top-2 tw-left-10 tw-text-gray-500'
                }`}
            >
              Confirm password
            </label>
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="tw-absolute tw-inset-y-0 tw-right-0 tw-pr-3 tw-flex tw-items-center tw-text-gray-500 hover:tw-text-cyan-500 focus:tw-outline-none"
            >
              {showConfirmPassword ? (
                <EyeOff className="tw-h-5 tw-w-5" />
              ) : (
                <Eye className="tw-h-5 tw-w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="tw-space-y-3">
          <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-300">
            Account type
          </label>
          <div className="tw-grid tw-grid-cols-2 tw-gap-3">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`tw-relative tw-flex tw-items-center tw-justify-center tw-py-2 tw-px-3 tw-rounded-md tw-shadow-sm tw-text-sm tw-font-medium tw-transition-colors tw-duration-300 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-cyan-500 ${
                role === 'customer'
                  ? 'tw-border-2 tw-border-cyan-600 tw-text-white'
                  : 'tw-border tw-border-gray-600 tw-text-gray-300'
              } tw-bg-gray-900 hover:tw-border-cyan-500`}
              
            >
              <User className="tw-h-5 tw-w-5 tw-mr-2" />
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole('merchant')}
              className={`tw-relative tw-flex tw-items-center tw-justify-center tw-py-2 tw-px-3 tw-rounded-md tw-shadow-sm tw-text-sm tw-font-medium tw-transition-colors tw-duration-300 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-cyan-500 ${
                role === 'merchant'
                  ? 'tw-border-2 tw-border-cyan-600 tw-text-white'
                  : 'tw-border tw-border-gray-600 tw-text-gray-300'
              } tw-bg-gray-900 hover:tw-border-cyan-500`}
              
            >
              <Briefcase className="tw-h-5 tw-w-5 tw-mr-2" />
              Merchant
            </button>
          </div>
        </div>

        <div className="tw-pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="tw-w-full tw-flex tw-justify-center tw-py-2 tw-px-4 tw-border tw-border-transparent tw-rounded-md tw-shadow-md tw-text-sm tw-font-medium tw-text-white tw-bg-cyan-600 hover:tw-bg-cyan-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-cyan-500 tw-transition-colors tw-duration-300 disabled:tw-opacity-70 disabled:tw-cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="tw-h-5 tw-w-5 tw-animate-spin" />
            ) : (
              'Create account'
            )}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;