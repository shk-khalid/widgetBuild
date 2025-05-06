import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from 'lucide-react';

interface AuthGuardProps {
  requiredRole?: 'customer' | 'merchant';
}

const AuthGuard: React.FC<AuthGuardProps> = ({ requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center">
        <Loader className="tw-h-8 tw-w-8 tw-animate-spin tw-text-indigo-600" />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a role is required, check if user has that role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate home page based on user role
    const redirectPath = user?.role === 'customer' ? '/customer/claims' : '/merchant/claims';
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has the right role (or no specific role is required)
  return <Outlet />;
};

export default AuthGuard;