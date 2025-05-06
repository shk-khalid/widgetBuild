import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../../service/authService';
import { toast } from 'react-hot-toast';
import { Lock, Mail, Loader, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailAutofilled, setEmailAutofilled] = useState(false);
  const [passwordAutofilled, setPasswordAutofilled] = useState(false);
  const navigate = useNavigate();

  // Check for autofilled fields on page load
  useEffect(() => {
    // Short delay to allow browser autofill to complete
    const timer = setTimeout(() => {
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;

      if (emailInput && emailInput.value && !email) {
        setEmail(emailInput.value);
        setEmailAutofilled(true);
      }

      if (passwordInput && passwordInput.value && !password) {
        setPassword(passwordInput.value);
        setPasswordAutofilled(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signIn(email, password);

      if (error) throw error;

      if (data) {
        const role = data.user?.user_metadata?.role || 'customer';
        const redirectPath = role === 'customer' ? '/customer/claims' : '/merchant/claims';

        toast.success('Login successful!');
        navigate(redirectPath);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Handler for detecting autofill
  const handleAnimationStart = (e: React.AnimationEvent<HTMLInputElement>, field: 'email' | 'password') => {
    // The animation name for WebKit autofill is 'onAutoFillStart'
    if (e.animationName.includes('AutoFill') || e.animationName.includes('autofill')) {
      if (field === 'email') {
        setEmailAutofilled(true);
        if (e.currentTarget.value && !email) {
          setEmail(e.currentTarget.value);
        }
      } else if (field === 'password') {
        setPasswordAutofilled(true);
        if (e.currentTarget.value && !password) {
          setPassword(e.currentTarget.value);
        }
      }
    }
  };

  return (
    <AuthLayout 
      title="Sign in to your account"
      subtitle={
        <>
          Or{' '}
          <Link to="/signup" className="tw-font-medium tw-text-cyan-500 hover:tw-text-cyan-400 tw-transition-colors tw-duration-300">
            create a new account
          </Link>
        </>
      }
    >
      <form className="tw-space-y-6" onSubmit={handleSubmit}>
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
              className={`tw-absolute tw-bg-gray-900 tw-text-sm tw-transition-all tw-duration-200 ${email || emailAutofilled ? 'tw-top-0 tw-px-1 tw-text-cyan-500 -tw-translate-y-2 tw-left-2' : 'tw-top-2 tw-left-10 tw-text-gray-500'
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onAnimationStart={(e) => handleAnimationStart(e, 'password')}
              className="tw-py-2 tw-pl-10 tw-pr-10 tw-block tw-w-full tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded-md focus:tw-ring-cyan-500 focus:tw-border-cyan-500 tw-text-gray-200 tw-text-sm"
              placeholder=""
            />
            <label
              htmlFor="password"
              className={`tw-absolute tw-bg-gray-900 tw-text-sm tw-transition-all tw-duration-200 ${password || passwordAutofilled ? 'tw-top-0 tw-px-1 tw-text-cyan-500 -tw-translate-y-3 tw-left-2' : 'tw-top-2 tw-left-10 tw-text-gray-500'
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
          <div className="tw-flex tw-justify-end tw-mt-1">
            <Link to="/forgot-password" className="tw-text-xs tw-font-medium tw-text-cyan-500 hover:tw-text-cyan-400 tw-transition-colors">
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="tw-w-full tw-flex tw-justify-center tw-py-2 tw-px-4 tw-border tw-border-transparent tw-rounded-md tw-shadow-md tw-text-sm tw-font-medium tw-text-white tw-bg-cyan-600 hover:tw-bg-cyan-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-cyan-500 tw-transition-colors tw-duration-300 disabled:tw-opacity-70 disabled:tw-cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="tw-h-5 tw-w-5 tw-animate-spin" />
            ) : (
              'Sign in'
            )}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;