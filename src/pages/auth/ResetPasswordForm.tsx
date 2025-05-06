import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from '../../service/authService';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Lock, Loader, Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const type = params.get('type');

        if (!token || type !== 'recovery') {
          throw new Error('Invalid reset password link');
        }

        // Verify the recovery token
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'recovery',
        });

        if (error) throw error;
        setIsTokenValid(true);
      } catch (err) {
        console.error('Token verification error:', err);
        toast.error('Invalid or expired reset link');
        navigate('/login');
      }
    };

    verifyToken();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- Inline validation: ---
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error('Both password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const pwdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!pwdPattern.test(newPassword)) {
      toast.error('Password must contain uppercase, lowercase, and a number');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await updatePassword(newPassword);

      if (error) throw error;

      toast.success('Password updated successfully!');
      navigate('/login');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTokenValid) {
    return (
      <div className="tw-min-h-screen tw-bg-gray-950 tw-flex tw-items-center tw-justify-center">
        <Loader className="tw-h-8 tw-w-8 tw-animate-spin tw-text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="tw-min-h-screen tw-bg-gray-950 tw-flex tw-flex-col tw-justify-center tw-py-12 sm:tw-px-6 lg:tw-px-8">
      <div className="sm:tw-mx-auto sm:tw-w-full sm:tw-max-w-md">
        <div className="tw-bg-gray-900 tw-border tw-border-gray-800 tw-py-8 tw-px-4 tw-shadow-lg sm:tw-rounded-xl sm:tw-px-10">
          <h2 className="tw-text-center tw-text-3xl tw-font-bold tw-tracking-tight tw-text-white tw-mb-6">
            Reset your password
          </h2>

          <form className="tw-space-y-6" onSubmit={handleSubmit}>
            <div className="tw-relative">
              <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                <Lock className="tw-h-5 tw-w-5 tw-text-gray-500" />
              </div>
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="tw-py-2 tw-pl-10 tw-pr-10 tw-block tw-w-full tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded-md focus:tw-ring-cyan-500 focus:tw-border-cyan-500 tw-text-gray-200 tw-text-sm"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="tw-absolute tw-inset-y-0 tw-right-0 tw-pr-3 tw-flex tw-items-center tw-text-gray-500 hover:tw-text-cyan-500"
              >
                {showPassword ? <EyeOff className="tw-h-5 tw-w-5" /> : <Eye className="tw-h-5 tw-w-5" />}
              </button>
            </div>

            <div className="tw-relative">
              <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                <Lock className="tw-h-5 tw-w-5 tw-text-gray-500" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="tw-py-2 tw-pl-10 tw-pr-10 tw-block tw-w-full tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded-md focus:tw-ring-cyan-500 focus:tw-border-cyan-500 tw-text-gray-200 tw-text-sm"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="tw-absolute tw-inset-y-0 tw-right-0 tw-pr-3 tw-flex tw-items-center tw-text-gray-500 hover:tw-text-cyan-500"
              >
                {showConfirmPassword ? <EyeOff className="tw-h-5 tw-w-5" /> : <Eye className="tw-h-5 tw-w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="tw-w-full tw-flex tw-justify-center tw-py-2 tw-px-4 tw-border tw-border-transparent tw-rounded-md tw-shadow-sm tw-text-sm tw-font-medium tw-text-white tw-bg-cyan-600 hover:tw-bg-cyan-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-cyan-500 tw-transition-colors tw-duration-300 disabled:tw-opacity-70"
            >
              {isLoading ? <Loader className="tw-h-5 tw-w-5 tw-animate-spin" /> : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
