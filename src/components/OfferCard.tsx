import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface OfferData {
  price: string;
  term: string;
  features: string[];
}

interface OfferCardProps {
  offerData: OfferData;
  loading?: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({ offerData, loading = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-overflow-hidden hover:tw-shadow-xl tw-transition-shadow"
    >
      <div className="tw-bg-protega-700 tw-p-4 tw-text-white tw-text-center">
        <h3 className="tw-text-xl tw-font-semibold">Premium Plan</h3>
      </div>

      <div className="tw-p-6">
        {loading ? (
          <div className="tw-animate-pulse">
            <div className="tw-h-8 tw-bg-gray-200 tw-rounded tw-mb-4 tw-w-3/4 tw-mx-auto"></div>
            <div className="tw-h-4 tw-bg-gray-200 tw-rounded tw-mb-2 tw-w-1/2 tw-mx-auto"></div>
            <div className="tw-space-y-2 tw-mt-6">
              <div className="tw-h-4 tw-bg-gray-200 tw-rounded tw-w-full"></div>
              <div className="tw-h-4 tw-bg-gray-200 tw-rounded tw-w-full"></div>
              <div className="tw-h-4 tw-bg-gray-200 tw-rounded tw-w-full"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="tw-text-center tw-mb-6">
              <p className="tw-text-4xl tw-font-bold tw-text-gray-800">{offerData.price}</p>
              <p className="tw-text-gray-500">{offerData.term}</p>
            </div>

            <ul className="tw-space-y-3 tw-mb-6">
              {offerData.features.map((feature, index) => (
                <li key={index} className="tw-flex tw-items-center">
                  <Check className="tw-text-green-500 tw-mr-2" size={20} />
                  <span className="tw-text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <button className="tw-w-full tw-bg-protega-600 tw-text-white tw-py-2 tw-rounded-md hover:tw-bg-protega-700 tw-transition-colors tw-font-medium">
          {loading ? 'Loading...' : 'Subscribe Now'}
        </button>
      </div>
    </motion.div>
  );
};

export default OfferCard;
