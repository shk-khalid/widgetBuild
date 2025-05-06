import React from 'react';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
  }

interface DemoControlsProps {
  activeView: 'pdp' | 'cart';
  setActiveView: (view: 'pdp' | 'cart') => void;
  product: Product;
  setProduct: (product: Product) => void;
}

const productOptions = [
  {
    id: '123',
    name: 'Premium Smartphone',
    price: 999.99,
    image: 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '456',
    name: 'Luxury Watch',
    price: 499.99,
    image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '789',
    name: 'Wireless Headphones',
    price: 199.99,
    image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const DemoControls: React.FC<DemoControlsProps> = ({
  activeView,
  setActiveView,
  product,
  setProduct
}) => {
  return (
    <div className="tw-bg-gray-100 tw-border-b tw-p-4">
      <div className="tw-mb-4">
        <h3 className="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">Demo Controls</h3>
        <div className="tw-flex tw-space-x-2">
          <button
            onClick={() => setActiveView('pdp')}
            className={`tw-px-3 tw-py-1.5 tw-text-sm tw-rounded-md ${
              activeView === 'pdp'
                ? 'tw-bg-protega-500 tw-text-white'
                : 'tw-bg-white tw-border tw-border-gray-300 tw-text-gray-700 hover:tw-bg-gray-50'
            }`}
          >
            Product Page
          </button>
          <button
            onClick={() => setActiveView('cart')}
            className={`tw-px-3 tw-py-1.5 tw-text-sm tw-rounded-md ${
              activeView === 'cart'
                ? 'tw-bg-protega-500 tw-text-white'
                : 'tw-bg-white tw-border tw-border-gray-300 tw-text-gray-700 hover:tw-bg-gray-50'
            }`}
          >
            Cart Page
          </button>
        </div>
      </div>
      
      <div>
        <label htmlFor="product-select" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
          Select Product
        </label>
        <select
          id="product-select"
          className="tw-w-full tw-rounded-md tw-border-gray-300 tw-shadow-sm focus:tw-border-protega-500 focus:tw-ring-protega-500 tw-text-sm"
          value={product.id}
          onChange={(e) => {
            const selectedProduct = productOptions.find(p => p.id === e.target.value);
            if (selectedProduct) setProduct(selectedProduct);
          }}
        >
          {productOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name} - ${option.price.toFixed(2)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DemoControls;