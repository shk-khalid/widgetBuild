// src/components/widgets/PostCartModal.tsx
import '../../index.css';
import React, { useEffect, useState } from 'react';
import { XIcon, AlertTriangle, Loader } from 'lucide-react';
import { useInsurance } from '../../hooks/useInsurance';
import { fetchOffers, Offer } from '../../service/offerService';

interface PostCartModalProps {
  product: Product;
  variantId: string;
  onClose: () => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const PostCartModal: React.FC<PostCartModalProps> = ({ product, variantId, onClose }) => {
  const { selectedPlan, setSelectedPlan } = useInsurance();
  const [closing, setClosing] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedProductPlan, setSelectedProductPlan] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noProtection, setNoProtection] = useState(false);
  
  // fetch offers from API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    
    fetchOffers(variantId)
      .then(data => {
        if (isMounted) {
          if (data.length === 0) {
            setError("No protection plans available for this product.");
          } else {
            setOffers(data);
            const firstProductPlan = data.find(offer => offer.plan_type === 'product');
            if (firstProductPlan) {
              setSelectedProductPlan(firstProductPlan);
            }
          }
        }
      })
      .catch(err => {
        console.error('Error fetching offers:', err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
      
    return () => {
      isMounted = false;
    };
  }, [variantId]);
  
  const shippingPlan = offers.find(offer => offer.plan_type === 'shipping');
  const productPlans = offers.filter(offer => offer.plan_type === 'product');
  
  const totalProtectionPrice = noProtection
    ? 0
    : (shippingPlan?.total_premium_inr || 0) + (selectedProductPlan?.total_premium_inr || 0);

  const handleAddProtection = () => {
    if (noProtection) {
      setSelectedPlan(null);
    } else if (selectedProductPlan) {
      setSelectedPlan(selectedProductPlan.label);
    }
    handleClose();
  };

  const toggleNoProtection = (value: boolean) => {
    setNoProtection(value);
    if (value) {
      setSelectedProductPlan(null);
    } else {
      const firstProductPlan = productPlans[0];
      if (firstProductPlan) {
        setSelectedProductPlan(firstProductPlan);
      }
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && handleClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      className={`tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50 tw-transition-opacity tw-duration-300 ${
        closing ? 'tw-opacity-0' : 'tw-opacity-100'
      }`}
    >
      <div className="tw-max-w-xl tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm tw-w-full tw-mx-4 tw-relative">
        <button
          onClick={handleClose}
          className="tw-absolute tw-top-4 tw-right-4 tw-text-gray-500 hover:tw-text-gray-700"
        >
          <XIcon className="tw-h-5 tw-w-5" />
        </button>
        <div className="tw-p-6">
          <h2 className="tw-text-xl tw-font-bold tw-text-[#0a0a44] tw-mb-4">
            Protect Your Purchase
          </h2>
          {loading ? (
            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-10">
              <Loader className="tw-h-6 tw-w-6 tw-text-[#0a0a44] tw-animate-spin tw-mb-2" />
              <p className="tw-text-sm tw-text-gray-600">
                Loading protection plans...
              </p>
            </div>
          ) : error ? (
            <div className="tw-mb-4 tw-p-3 tw-bg-amber-50 tw-border tw-border-amber-200 tw-rounded tw-flex tw-items-start">
              <AlertTriangle className="tw-h-5 tw-w-5 tw-text-amber-500 tw-mt-0.5 tw-mr-2 tw-flex-shrink-0" />
              <div>
                <p className="tw-text-sm tw-text-amber-700 tw-font-medium">
                  {error}
                </p>
                <p className="tw-text-xs tw-text-gray-500 tw-mt-1">
                  Please try again later or contact support.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="tw-flex tw-flex-col tw-gap-2 tw-mb-4">
                <label className="tw-flex tw-items-center tw-cursor-pointer">
                  <input
                    type="radio"
                    id="choose-protection-modal"
                    name="modal-protection-option"
                    checked={!noProtection}
                    onChange={() => toggleNoProtection(false)}
                    className="tw-h-4 tw-w-4 tw-mr-2 tw-accent-[#0a0a44]"
                  />
                  <span className="tw-font-medium tw-text-gray-900">
                    Yes, I want to protect my purchase
                  </span>
                </label>
                {!noProtection && (
                  <div className="tw-ml-6">
                    {shippingPlan && (
                      <div className="tw-mb-4">
                        <div className="tw-flex tw-items-center">
                          <input
                            type="checkbox"
                            id="modal-shipping-protection"
                            checked
                            readOnly
                            className="tw-h-4 tw-w-4 tw-mr-2 tw-accent-[#0a0a44]"
                          />
                          <label
                            htmlFor="modal-shipping-protection"
                            className="tw-flex tw-justify-between tw-w-full tw-text-gray-800"
                          >
                            <span className="tw-font-medium">
                              {shippingPlan.label}
                            </span>
                            <span>₹{shippingPlan.total_premium_inr}</span>
                          </label>
                        </div>
                        <p className="tw-text-xs tw-text-gray-500 tw-ml-6">
                          Covers loss, theft & damage in transit
                        </p>
                      </div>
                    )}
                    {productPlans.length > 0 && (
                      <div>
                        <div className="tw-flex tw-items-center tw-mb-2">
                          <input
                            type="checkbox"
                            id="modal-product-protection"
                            checked
                            readOnly
                            className="tw-h-4 tw-w-4 tw-mr-2 tw-accent-[#0a0a44]"
                          />
                          <label
                            htmlFor="modal-product-protection"
                            className="tw-font-medium tw-text-gray-800"
                          >
                            Product Protection
                          </label>
                        </div>
                        <div className="tw-flex tw-gap-3 tw-mt-3">
                          {productPlans.map(offer => (
                            <button
                              key={offer.term_months}
                              className={`tw-flex-1 tw-py-4 tw-px-4 tw-rounded-lg tw-border tw-transition-all tw-duration-150 tw-text-center focus:tw-outline-none ${
                                selectedProductPlan?.term_months === offer.term_months
                                  ? 'tw-bg-blue-50 tw-border-blue-400 tw-text-[#0a0a44] tw-font-semibold tw-shadow'
                                  : 'tw-bg-white tw-border-gray-300 tw-text-gray-800 hover:tw-border-blue-300'
                              }`}
                              onClick={() => setSelectedProductPlan(offer)}
                            >
                              <div className="tw-text-lg tw-font-bold tw-mb-1">
                                {offer.label}
                              </div>
                              <div className="tw-text-base tw-font-medium tw-mb-1">
                                ₹{offer.total_premium_inr}
                              </div>
                              {offer.deductible_inr > 0 && (
                                <div className="tw-text-xs tw-text-gray-500">
                                  Deductible: ₹{offer.deductible_inr}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <label className="tw-flex tw-items-center tw-cursor-pointer tw-mt-2">
                  <input
                    type="radio"
                    id="no-protection-modal"
                    name="modal-protection-option"
                    checked={noProtection}
                    onChange={() => toggleNoProtection(true)}
                    className="tw-h-4 tw-w-4 tw-mr-2 tw-accent-[#0a0a44]"
                  />
                  <span className="tw-font-medium tw-text-gray-900">
                    No, I don't want to protect my purchase
                  </span>
                </label>
                {noProtection && (
                  <div className="tw-ml-6 tw-mt-1 tw-text-xs tw-text-gray-500">
                    Your purchase will not be protected against damage, loss, or theft.
                  </div>
                )}
              </div>
              <button
                className={`tw-w-full tw-mt-2 tw-py-3 tw-rounded-md tw-font-semibold tw-text-lg tw-transition-colors tw-duration-150 ${
                  noProtection
                    ? 'tw-bg-gray-200 tw-text-gray-800 tw-cursor-pointer'
                    : 'tw-bg-[#0a0a44] tw-text-white hover:tw-bg-[#18186a] tw-cursor-pointer'
                }`}
                onClick={handleAddProtection}
              >
                {noProtection
                  ? 'Continue Without Protection'
                  : `Add Protection • ₹${totalProtectionPrice.toLocaleString()}`}
              </button>
              <div className="tw-flex tw-flex-col tw-items-center tw-mt-4">
                <a
                  href="#"
                  className="tw-text-xs tw-text-gray-500 hover:tw-underline tw-mb-1"
                >
                  See contract terms & FAQ
                </a>
                <div className="tw-text-xs tw-text-gray-500 tw-flex tw-items-center">
                  <span>Powered by</span>
                  <span className="tw-ml-1 tw-font-bold tw-text-[#0a0a44]">
                    PROTEGA
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCartModal;
