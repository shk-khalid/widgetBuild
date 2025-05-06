import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../../service/authService';
import { toast } from 'react-hot-toast';
import { Mail, Loader, ArrowLeft } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) throw error;

      setEmailSent(true);
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={emailSent ? "Check your email" : "Reset your password"}
      subtitle={!emailSent && "Enter your email address and we'll send you instructions to reset your password."}
    >
      {!emailSent ? (
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
                className="tw-py-2 tw-pl-10 tw-block tw-w-full tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded-md focus:tw-ring-cyan-500 focus:tw-border-cyan-500 tw-text-gray-200 tw-text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="tw-w-full tw-flex tw-justify-center tw-py-2 tw-px-4 tw-border tw-border-transparent tw-rounded-md tw-shadow-md tw-text-sm tw-font-medium tw-text-white tw-bg-cyan-600 hover:tw-bg-cyan-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-cyan-500 tw-transition-colors tw-duration-300 disabled:tw-opacity-70 disabled:tw-cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="tw-h-5 tw-w-5 tw-animate-spin" />
            ) : (
              'Send reset instructions'
            )}
          </button>
        </form>
      ) : (
        <div className="tw-text-center">
          <Mail className="tw-mx-auto tw-h-12 tw-w-12 tw-text-cyan-500 tw-mb-4" />
          <p className="tw-text-sm tw-text-gray-400 tw-mb-6">
            We've sent password reset instructions to {email}
          </p>
        </div>
      )}

      <div className="tw-mt-6">
        <Link
          to="/login"
          className="tw-flex tw-items-center tw-justify-center tw-text-sm tw-font-medium tw-text-cyan-500 hover:tw-text-cyan-400 tw-transition-colors tw-duration-300"
        >
          <ArrowLeft className="tw-h-4 tw-w-4 tw-mr-2" />
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;