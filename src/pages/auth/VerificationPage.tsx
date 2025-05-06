import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Mail, CheckCircle, XCircle, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EmailVerificationPage: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verifying' | 'success' | 'error'>('pending');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const message = location.state?.message;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const type = params.get('type');

    if (token && type === 'signup') {
      handleEmailConfirmation(token);
    }
  }, []);

  const handleEmailConfirmation = async (token: string) => {
    try {
      setVerificationStatus('verifying');

      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup',
      });

      if (error) throw error;

      setVerificationStatus('success');
      toast.success('Email verified successfully!', {
        className: 'sm:max-w-md md:max-w-lg',
      });

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Verification error:', err);
      setVerificationStatus('error');
      setError('Failed to verify email. Please try again or contact support.');
      toast.error('Verification failed', {
        className: 'sm:max-w-md md:max-w-lg',
      });
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'pending':
        return {
          icon: <Mail className="tw-h-12 tw-w-12 tw-text-cyan-500" />,
          title: 'Check your email',
          message: message || `We've sent a verification link to ${email}. Please check your inbox.`,
        };
      case 'verifying':
        return {
          icon: <Loader className="tw-h-12 tw-w-12 tw-text-cyan-500 tw-animate-spin" />,
          title: 'Verifying your email...',
          message: 'Please wait while we verify your email address.',
        };
      case 'success':
        return {
          icon: <CheckCircle className="tw-h-12 tw-w-12 tw-text-green-500" />,
          title: 'Email Verified!',
          message: 'Your email has been verified. Redirecting to login...',
        };
      case 'error':
        return {
          icon: <XCircle className="tw-h-12 tw-w-12 tw-text-red-500" />,
          title: 'Verification Failed',
          message: error || 'An error occurred during verification.',
        };
    }
  };

  const content = renderContent();

  return (
    <div className="tw-min-h-screen tw-bg-gray-950 tw-flex tw-flex-col tw-justify-center tw-py-12 sm:tw-px-6 lg:tw-px-8">
      <div className="sm:tw-mx-auto sm:tw-w-full sm:tw-max-w-md">
        <div className="tw-bg-gray-900 tw-border tw-border-gray-800 tw-py-8 tw-px-4 tw-shadow-lg sm:tw-rounded-xl sm:tw-px-10">
          <div className="tw-flex tw-justify-center">
            {content.icon}
          </div>
          <h2 className="tw-mt-6 tw-text-center tw-text-3xl tw-font-extrabold tw-text-white">
            {content.title}
          </h2>
          <p className="tw-mt-2 tw-text-center tw-text-sm tw-text-gray-400">
            {content.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;