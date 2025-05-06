import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from 'lucide-react';

const PublicRoute: React.FC = () => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return (
      <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center">
        <Loader className="tw-h-8 tw-w-8 tw-animate-spin tw-text-indigo-600" />
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to the appropriate home page based on user role
    const homeRoute = user?.role === 'customer' ? '/customer/claims' : '/merchant/claims';
    return <Navigate to={homeRoute} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;