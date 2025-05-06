import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AuthGuard from '@/components/auth/AuthGuard';
import PublicRoute from '@/components/auth/PublicRoute';

// Pages
import Storefront from '@/pages/Storefront';
import Merchant from '@/pages/Merchant';
import Policies from '@/components/Policies';
import NewClaim from '@/pages/customer/NewClaim';
import ClaimsList from '@/pages/merchant/ClaimList';
import ClaimDetail from '@/pages/merchant/ClaimDetail';
import LoginPage from '@/pages/auth/LoginForm';
import SignupPage from '@/pages/auth/SignupForm';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/pages/auth/ResetPasswordForm';
import EmailVerificationPage from '@/pages/auth/VerificationPage';
import CustomerDashboard from '@/pages/dashboard/CustomerDashboard';


const AppRoutes: React.FC = () => {
    return (
        <AnimatePresence mode='wait'>
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicRoute />}>
                    <Route path="/storefront" element={<Storefront />} />
                    <Route path="/merchant" element={<Merchant />} />
                    <Route path="merchant/policies" element={<Policies />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordForm />} />
                    <Route path="/email-verification" element={<EmailVerificationPage />} />
                    <Route path="/customer" element={<CustomerDashboard />} />
                    <Route path="/customer/claims/new" element={<NewClaim />} />
                </Route>

                {/* Protected Customer Routes */}
                <Route element={<AuthGuard requiredRole="customer" />}>
                </Route>

                {/* Protected Merchant Routes */}
                <Route element={<AuthGuard requiredRole="merchant" />}>
                    <Route path="/merchant/claims" element={<ClaimsList />} />
                    <Route path="/merchant/claims/:claimId" element={<ClaimDetail />} />
                </Route>

                {/* Redirect any unmatched routes */}
                <Route path="*" element={<Navigate to="/storefront" replace />} />
            </Routes>
        </AnimatePresence>
    );
};

export default AppRoutes;