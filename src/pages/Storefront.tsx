import React, { useState } from 'react'
import PDPWidget from '../components/widgets/PDPWidget'
import CartWidget from '../components/widgets/CartWidget'
import PostCartModal from '../components/widgets/PostCartModal'
import DemoControls from '../components/storefront/DemoControls'
import { InsuranceContext } from '../context/InsuranceContext'
import { motion } from 'framer-motion'
import Header from '@/components/Header'

interface Product {
  id: string
  name: string
  price: number
  image: string
}

const mockProduct: Product = {
  id: '123',
  name: 'Premium Smartphone',
  price: 999.99,
  image:
    'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
}

const StoreFront: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product>(mockProduct)
  const [activeView, setActiveView] = useState<'pdp' | 'cart'>('pdp')
  const [hasInsurance, setHasInsurance] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleAddToCart = () => setShowModal(true)

  const closeModal = () => {
    setShowModal(false)
    if (selectedPlan) setHasInsurance(true)
    setActiveView('cart')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="tw-min-h-screen tw-bg-gray-900"
    >
      <Header isStorefront={true} />
      <main className="tw-container tw-mx-auto tw-px-6 tw-py-20 tw-space-y-16">
        <InsuranceContext.Provider
          value={{
            hasInsurance,
            selectedPlan,
            setSelectedPlan,
            setHasInsurance,
          }}
        >
          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-overflow-hidden">
            <DemoControls
              activeView={activeView}
              setActiveView={setActiveView}
              product={selectedProduct}
              setProduct={setSelectedProduct}
            />

            <div className="tw-p-6">
              {activeView === 'pdp' ? (
                // — PRODUCT DETAIL VIEW —
                <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-8">
                  <div className="md:tw-w-1/2">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="tw-w-full tw-h-auto tw-rounded-lg tw-tw-object-cover"
                    />
                  </div>
                  <div className="md:tw-w-1/2">
                    <h2 className="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-2">
                      {selectedProduct.name}
                    </h2>
                    <p className="tw-text-3xl tw-font-bold tw-text-gray-900 tw-mb-6">
                      ${selectedProduct.price.toFixed(2)}
                    </p>
                    <div className="tw-prose tw-max-w-none tw-mb-6">
                      <p>
                        Experience the latest technology with our premium
                        smartphone. This feature-packed device offers exceptional
                        performance, an amazing camera system, and all-day battery
                        life.
                      </p>
                    </div>
                    <PDPWidget product={selectedProduct} />
                    <button
                      onClick={handleAddToCart}
                      className="tw-mt-6 tw-w-full tw-bg-protega-500 tw-text-white tw-py-3 tw-px-4 tw-rounded-md hover:tw-bg-protega-600 tw-transition tw-duration-200"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ) : (
                // — CART VIEW —
                <>
                  <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Your Cart</h2>
                  <div className="tw-border tw-rounded-lg tw-p-4 tw-mb-6">
                    <div className="tw-flex tw-items-center">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="tw-w-16 tw-h-16 tw-tw-object-cover tw-rounded"
                      />
                      <div className="tw-ml-4">
                        <h3 className="tw-font-medium">{selectedProduct.name}</h3>
                        <p className="tw-text-gray-600">Qty: 1</p>
                        <p className="tw-font-bold">
                          ${selectedProduct.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <CartWidget product={selectedProduct} />

                  <div className="tw-mt-6 tw-border-t tw-pt-4">
                    <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
                      <span className="tw-text-gray-600">Subtotal:</span>
                      <span className="tw-font-medium">
                        ${selectedProduct.price.toFixed(2)}
                      </span>
                    </div>
                    {hasInsurance && selectedPlan && (
                      <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
                        <span className="tw-text-gray-600">Insurance:</span>
                        <span className="tw-font-medium">
                          $
                          {(
                            selectedPlan === 'basic'
                              ? selectedProduct.price * 0.1
                              : selectedProduct.price * 0.15
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="tw-flex tw-justify-between tw-items-center tw-text-lg tw-font-bold">
                      <span>Total:</span>
                      <span>
                        $
                        {(
                          selectedProduct.price +
                          (hasInsurance && selectedPlan
                            ? selectedPlan === 'basic'
                              ? selectedProduct.price * 0.1
                              : selectedProduct.price * 0.15
                            : 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <button className="tw-mt-4 tw-w-full tw-bg-protega-500 tw-text-white tw-py-3 tw-px-4 tw-rounded-md hover:tw-bg-protega-600 tw-transition tw-duration-200">
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {showModal && (
            <PostCartModal product={selectedProduct} onClose={closeModal} />
          )}
        </InsuranceContext.Provider>
      </main>
    </motion.div>
  )
}

export default StoreFront
