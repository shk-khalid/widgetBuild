import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="tw-min-h-screen tw-bg-gray-950 tw-flex tw-flex-col tw-justify-center tw-py-4 sm:tw-px-6 lg:tw-px-8">
      <div className="sm:tw-mx-auto sm:tw-w-full sm:tw-max-w-md tw-mx-2 sm:tw-m-0">
        <div className="tw-bg-gray-900 tw-border tw-border-gray-800 tw-py-8 tw-px-4 tw-shadow-lg tw-rounded-xl sm:tw-px-10">
          <h2 className="tw-text-center tw-text-3xl tw-font-bold tw-tracking-tight tw-text-white tw-mb-6">
            {title}
          </h2>
          {subtitle && (
            <div className="tw-text-center tw-text-sm tw-text-gray-400 tw-mb-6">
              {subtitle}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 