import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  isStorefront: boolean;
}

const Header: React.FC<HeaderProps> = ({ isStorefront }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const headerClass = isStorefront
    ? 'tw-fixed tw-w-full tw-z-50 tw-transition-all tw-duration-300 tw-bg-opacity-50 tw-backdrop-blur-lg tw-bg-cyan-800'
    : 'tw-bg-gray-900 tw-border-b tw-border-gray-800';

  const textClass = 'tw-text-gray-100';

  return (
    <header className={headerClass}>
      <div className="tw-container tw-mx-auto tw-px-4">
        <div className="tw-flex tw-items-center tw-justify-between tw-h-16">
          <div className="tw-flex tw-items-center">
            <Link to="/storefront" className="tw-flex tw-items-center tw-group">
              <ShieldCheck className="tw-h-8 tw-w-8 tw-text-cyan-400 group-hover:tw-text-cyan-300 tw-transition-colors" />
              <span className={`tw-ml-2 tw-text-xl tw-font-bold ${textClass} group-hover:tw-text-cyan-400 tw-transition-colors`}>
                Protega
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="tw-hidden md:tw-flex tw-items-center tw-space-x-8">
            {isStorefront ? (
              <>
                <Link to="/merchant" className="tw-bg-protega-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-font-medium hover:tw-bg-protega-700 tw-transition-colors">
                  Merchant Login
                </Link>
              </>
            ) : (
              <>
                <Link to="/storefront" className="tw-bg-protega-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-font-medium hover:tw-bg-protega-700 tw-transition-colors">
                  View Storefront
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:tw-hidden">
            <button
              onClick={toggleMobileMenu}
              className={`${textClass} focus:tw-outline-none`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:tw-hidden tw-bg-gray-900 tw-border-t tw-border-gray-800"
        >
          <div className="tw-container tw-mx-auto tw-px-4 tw-py-4 tw-space-y-3">
            {isStorefront ? (
              <>
                <Link to="/merchant" className="tw-block tw-bg-protega-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-font-medium hover:tw-bg-protega-700 tw-transition-colors tw-text-center">
                  Merchant Login
                </Link>
              </>
            ) : (
              <>
                <Link to="/storefront" className="tw-block tw-bg-protega-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-font-medium hover:tw-bg-protega-700 tw-transition-colors tw-text-center">
                  View Storefront
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;