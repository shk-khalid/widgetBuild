import '../../index.css'
import React, { useState, useEffect } from 'react';
import { LockIcon, AlertTriangle, Loader } from 'lucide-react';
import { useInsurance } from '../../hooks/useInsurance';
import { fetchOffers, Offer } from '../../service/offerService';

interface PDPWidgetProps {
  product: Product;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const PDPWidget: React.FC<PDPWidgetProps> = ({ product }) => {
  const { selectedPlan, setSelectedPlan } = useInsurance();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noProtection, setNoProtection] = useState(false);
  const [shippingChecked, setShippingChecked] = useState(true);
  const [productChecked, setProductChecked] = useState(true);

  const insuranceVariantId = "45122925822127";

  useEffect(() => {
    if (noProtection) {
      window.selectedProtectionPlan = null;
    } else {
      window.selectedProtectionPlan = selectedOffer?.label ?? null;
    }
  }, [selectedOffer, noProtection]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    fetchOffers(product.id)
      .then(data => {
        if (isMounted) {
          if (data.length === 0) {
            setError("No protection plans available for this product.");
          } else {
            setOffers(data);
            const firstProductPlan = data.find(offer => offer.plan_type === 'product');
            if (firstProductPlan) {
              setSelectedOffer(firstProductPlan);
            }
          }
        }
      })
      .catch(err => {
        console.error('Error fetching offers:', err);
        if (isMounted) {
          setError("Couldn't fetch protection plans from server.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [product.id]);

  useEffect(() => {
    const handleAddInsuranceToCart = async () => {
      try {
        const res = await fetch('/cart.js');
        const cart = await res.json();
        const alreadyInCart = cart.items.some(
          (item: any) => item.variant_id === Number(insuranceVariantId)
        );
        if (!alreadyInCart) {
          await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: insuranceVariantId, quantity: 1 })
          });
        }
      } catch (err) {
        console.error('Error adding insurance to cart:', err);
      }
    };

    const handleBuyNowClick = async (e: Event) => {
      if (!noProtection && (shippingChecked || productChecked)) {
        e.preventDefault();
        await handleAddInsuranceToCart();
        window.location.href = '/checkout';
      }
    };

    const handleAddToCartClick = async () => {
      if (!noProtection && (shippingChecked || productChecked)) {
        await handleAddInsuranceToCart();
      }
    };

    const addToCartBtn = document.querySelector('.add-to-cart');
    const buyNowBtn = document.querySelector('.buy-now');

    addToCartBtn?.addEventListener('click', handleAddToCartClick);
    buyNowBtn?.addEventListener('click', handleBuyNowClick);

    return () => {
      addToCartBtn?.removeEventListener('click', handleAddToCartClick);
      buyNowBtn?.removeEventListener('click', handleBuyNowClick);
    };
  }, [noProtection, shippingChecked, productChecked]);

  const handleAddProtection = () => {
    if (noProtection || (!shippingChecked && !productChecked)) {
      setSelectedPlan(null);
    } else if (productChecked && selectedOffer) {
      setSelectedPlan(selectedOffer.label);
    } else if (shippingChecked && !productChecked) {
      setSelectedPlan('Shipping Protection');
    }
  };

  const toggleNoProtection = (value: boolean) => {
    setNoProtection(value);
    if (value) {
      setShippingChecked(false);
      setProductChecked(false);
      setSelectedOffer(null);
    } else {
      setShippingChecked(true);
      setProductChecked(true);
      const firstProductPlan = offers.find(offer => offer.plan_type === 'product');
      if (firstProductPlan) {
        setSelectedOffer(firstProductPlan);
      }
    }
  };

  const shippingPlan = offers.find(offer => offer.plan_type === 'shipping');
  const productPlans = offers.filter(offer => offer.plan_type === 'product');

  const totalProtectionPrice =
    (shippingChecked && shippingPlan ? shippingPlan.total_premium_inr : 0) +
    (productChecked && selectedOffer ? selectedOffer.total_premium_inr : 0);

  return (
    <div className="tw-max-w-xl tw-mx-auto tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm tw-p-6 tw-mb-8">
      <div className="tw-flex tw-items-center tw-mb-4">
        <LockIcon className="tw-h-5 tw-w-5 tw-text-[#0A0A44] tw-mr-2" />
        <h3 className="tw-text-xl tw-font-bold tw-text-[#0A0A44]">Protect Your Purchase</h3>
      </div>

      {loading ? (
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-10">
          <Loader className="tw-h-6 tw-w-6 tw-text-[#0A0A44] tw-animate-spin tw-mb-2" />
          <p className="tw-text-sm tw-text-gray-600">Loading protection plans...</p>
        </div>
      ) : error ? (
        <div className="tw-mb-4 tw-p-3 tw-bg-amber-50 tw-border tw-border-amber-200 tw-rounded tw-flex tw-items-start">
          <AlertTriangle className="tw-h-5 tw-w-5 tw-text-amber-500 tw-mt-0.5 tw-mr-2 tw-flex-shrink-0" />
          <div>
            <p className="tw-text-sm tw-text-amber-700 tw-font-medium">{error}</p>
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
                id="choose-protection"
                name="protection-option"
                checked={!noProtection}
                onChange={() => toggleNoProtection(false)}
                className="tw-h-4 tw-w-4 tw-mr-2 tw-accent-[#0A0A44]"
              />
              <span className="tw-font-medium tw-text-gray-900">
                Yes, I want to protect my purchase
              </span>
            </label>

            {!noProtection && (
              <div className="tw-ml-6">
                {shippingPlan && (
                  <div className="tw-mb-4 tw-flex tw-items-center">
                    <input
                      type="checkbox"
                      id="shipping-protection"
                      checked={shippingChecked}
                      onChange={() => setShippingChecked(v => !v)}
                      className="tw-h-4 tw-w-4 tw-mr-2 tw-accent-[#0A0A44]"
                    />
                    <label
                      htmlFor="shipping-protection"
                      className="tw-flex tw-justify-between tw-w-full tw-text-gray-800 tw-cursor-pointer"
                    >
                      <span className="tw-font-medium">{shippingPlan.label}</span>
                      <span>₹{shippingPlan.total_premium_inr}</span>
                    </label>
                    <span className="tw-text-xs tw-text-gray-500 tw-ml-6">
                      Covers loss, theft & damage in transit
                    </span>
                  </div>
                )}

                {productPlans.length > 0 && (
                  <div>
                    <div className="tw-flex tw-items-center tw-mb-2">
                      <input
                        type="checkbox"
                        id="product-protection"
                        checked={productChecked}
                        onChange={() => setProductChecked(v => !v)}
                        className="tw-h-4 tw-w-4 tw-mr-2 tw-accent-[#0A0A44]"
                      />
                      <label
                        htmlFor="product-protection"
                        className="tw-font-medium tw-text-gray-800 tw-cursor-pointer"
                      >
                        Product Protection
                      </label>
                    </div>

                    {productChecked && (
                      <div className="tw-flex tw-gap-3 tw-mt-3">
                        {productPlans.map((offer: Offer) => (
                          <button
                            key={offer.term_months}
                            className={`tw-flex-1 tw-py-4 tw-px-4 tw-rounded-lg tw-border tw-transition-all tw-duration-150 tw-text-center focus:tw-outline-none ${
                              selectedOffer?.term_months === offer.term_months
                                ? 'tw-bg-blue-50 tw-border-blue-400 tw-text-[#0A0A44] tw-font-semibold tw-shadow'
                                : 'tw-bg-white tw-border-gray-300 tw-text-gray-800 hover:tw-border-blue-300'
                            }`}
                            onClick={() => setSelectedOffer(offer)}
                          >
                            <div className="tw-text-lg tw-font-bold tw-mb-1">{offer.label}</div>
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
                    )}
                  </div>
                )}
              </div>
            )}

            <label className="tw-flex tw-items-center tw-cursor-pointer tw-mt-2">
              <input
                type="radio"
                id="no-protection"
                name="protection-option"
                checked={noProtection}
                onChange={() => toggleNoProtection(true)}
                className="tw-h-4 tw-w-4 tw-mr-2 tw-accent-[#0A0A44]"
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
              noProtection || (!shippingChecked && !productChecked)
                ? 'tw-bg-gray-200 tw-text-gray-800 tw-cursor-pointer'
                : 'tw-bg-[#0A0A44] tw-text-white hover:tw-bg-[#18186A] tw-cursor-pointer'
            }`}
            onClick={handleAddProtection}
            disabled={noProtection || (!shippingChecked && !productChecked)}
          >
            {noProtection || (!shippingChecked && !productChecked)
              ? 'Continue Without Protection'
              : `Add Protection for ₹${totalProtectionPrice}`}
          </button>
        </>
      )}
    </div>
  );
};

export default PDPWidget;
