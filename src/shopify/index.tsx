import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { InsuranceContext } from '../context/InsuranceContext';
import { 
  PDPWidget, 
  PostCartModal, 
  CartWidget 
} from '../components/widgets';

// Create InsuranceProvider component
const InsuranceProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [hasInsurance, setHasInsurance] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  return (
    <InsuranceContext.Provider value={{
      hasInsurance,
      selectedPlan,
      setSelectedPlan,
      setHasInsurance
    }}>
      {children}
    </InsuranceContext.Provider>
  );
};

// Define interfaces
interface ProtegaOptions {
  apiKey: string;
  shopDomain: string;
  mountPoints?: {
    pdp?: string;
    cart?: string;
    postCart?: string;
  };
  product?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  onInsuranceAdded?: (plan: any) => void;
  onWidgetLoaded?: () => void;
  debug?: boolean;
}

interface ShopifyProduct {
  id: number;
  title: string;
  featured_image: string;
  price: number;
}

/**
 * Convert Shopify product to our internal format
 */
function convertShopifyProduct(shopifyProduct: ShopifyProduct) {
  return {
    id: shopifyProduct.id.toString(),
    name: shopifyProduct.title,
    price: shopifyProduct.price,
    image: shopifyProduct.featured_image
  };
}

/**
 * Get current product from Shopify meta tags
 */
function getCurrentShopifyProduct(): any {
  try {
    // Look for the JSON object in a script tag
    const jsonElement = document.querySelector('script[type="application/json"][data-product-json]');
    if (jsonElement) {
      const productData = JSON.parse(jsonElement.textContent || '{}');
      if (productData && productData.id) {
        return convertShopifyProduct(productData);
      }
    }
    
    // Fallback: try to get meta values
    const product = {
      id: document.querySelector('meta[property="product:id"]')?.getAttribute('content') || '',
      name: document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
      image: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
      price: 0
    };
    
    // Try to extract price (this is trickier as Shopify doesn't have a standard format)
    const priceElement = document.querySelector('[data-product-price]') || 
                         document.querySelector('.price') || 
                         document.querySelector('[data-price]');
    
    if (priceElement) {
      // Get text content and extract numerics
      const priceText = priceElement.textContent || '';
      const priceMatch = priceText.match(/[\d,.]+/);
      if (priceMatch) {
        product.price = parseFloat(priceMatch[0].replace(/[^0-9.]/g, ''));
      }
    }
    
    return product;
  } catch (error) {
    console.error('Error getting Shopify product:', error);
    return null;
  }
}

/**
 * Main Protega Shopify class
 */
class ProtegaShopify {
  private options: ProtegaOptions;
  private mountedElements: Record<string, HTMLElement> = {};
  private rootContainers: Record<string, any> = {};
  private modalContainer: HTMLElement | null = null;
  private modalRoot: any = null;
  private currentProduct: any = null;
  
  constructor(options: ProtegaOptions) {
    this.options = {
      ...options,
      mountPoints: {
        pdp: '[data-protega-pdp]',
        cart: '[data-protega-cart]',
        postCart: 'body', // For modal we'll create our own container
        ...options.mountPoints
      }
    };
    
    this.init();
  }
  
  /**
   * Initialize the Protega widgets
   */
  private init() {
    this.log('Initializing Protega Shopify integration');
    
    // Try to get current product from page if not provided
    if (!this.options.product) {
      this.currentProduct = getCurrentShopifyProduct();
    } else {
      this.currentProduct = this.options.product;
    }
    
    this.log('Current product:', this.currentProduct);
    
    // Mount widgets based on the current page
    this.mountPDPWidget();
    this.mountCartWidget();
    
    // Listen for cart form submissions to show post-cart modal
    this.listenForCartAdditions();
    
    // Call onWidgetLoaded callback if provided
    if (typeof this.options.onWidgetLoaded === 'function') {
      this.options.onWidgetLoaded();
    }
  }
  
  /**
   * Mount the PDP Widget
   */
  private mountPDPWidget() {
    if (!this.currentProduct) return;
    
    const mountPoint = document.querySelector(this.options.mountPoints?.pdp || '');
    if (!mountPoint) {
      this.log('PDP mount point not found:', this.options.mountPoints?.pdp);
      return;
    }
    
    // Create container
    const container = document.createElement('div');
    container.className = 'protega-pdp-widget-container';
    mountPoint.appendChild(container);
    
    // Store for cleanup
    this.mountedElements['pdp'] = container;
    
    // Mount React component
    const root = createRoot(container);
    this.rootContainers['pdp'] = root;
    
    root.render(
      <InsuranceProvider>
        <PDPWidget product={this.currentProduct} />
      </InsuranceProvider>
    );
    
    this.log('PDP widget mounted');
  }
  
  /**
   * Mount the Cart Widget
   */
  private mountCartWidget() {
    const mountPoint = document.querySelector(this.options.mountPoints?.cart || '');
    if (!mountPoint) {
      this.log('Cart mount point not found:', this.options.mountPoints?.cart);
      return;
    }
    
    // Create container
    const container = document.createElement('div');
    container.className = 'protega-cart-widget-container';
    mountPoint.appendChild(container);
    
    // Store for cleanup
    this.mountedElements['cart'] = container;
    
    // Mount React component 
    const root = createRoot(container);
    this.rootContainers['cart'] = root;
    
    root.render(
      <InsuranceProvider>
        <CartWidget product={this.currentProduct} />
      </InsuranceProvider>
    );
    
    this.log('Cart widget mounted');
  }
  
  /**
   * Show Post Cart Modal
   */
  public showPostCartModal() {
    if (!this.currentProduct) return;
    
    // Create modal container if not exists
    if (!this.modalContainer) {
      this.modalContainer = document.createElement('div');
      this.modalContainer.className = 'protega-postcart-modal-container';
      document.body.appendChild(this.modalContainer);
      
      // Create root
      this.modalRoot = createRoot(this.modalContainer);
    }
    
    // Render modal
    this.modalRoot.render(
      <InsuranceProvider>
        <PostCartModal 
          product={this.currentProduct} 
          onClose={() => {
            // Unmount modal
            if (this.modalContainer && this.modalRoot) {
              this.modalRoot.unmount();
              this.modalContainer.remove();
              this.modalContainer = null;
              this.modalRoot = null;
            }
          }} 
        />
      </InsuranceProvider>
    );
    
    this.log('Post-cart modal shown');
  }
  
  /**
   * Listen for add to cart button clicks
   */
  private listenForCartAdditions() {
    // Listen for form submissions
    document.addEventListener('submit', (event) => {
      const target = event.target as HTMLElement;
      
      // Check if this is an add to cart form
      if (target && 
          ((target.matches('form[action*="/cart/add"]') || 
           target.matches('form[action*="/checkout"]')))) {
        this.log('Cart form submitted, will show post-cart modal');
        
        // Show modal after a small delay to ensure the cart updated
        setTimeout(() => {
          this.showPostCartModal();
        }, 500);
      }
    });
    
    // Also listen for AJAX cart additions
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      const [url, config] = args;
      
      // Check if this is a cart addition
      if (typeof url === 'string' && 
          (url.includes('/cart/add') || url.includes('/cart/update'))) {
        this.log('AJAX cart addition detected');
        
        return originalFetch(...args).then(response => {
          // Show modal after success
          setTimeout(() => {
            this.showPostCartModal();
          }, 500);
          return response;
        });
      }
      
      return originalFetch(...args);
    };
  }
  
  /**
   * Clean up all mounted components
   */
  public cleanup() {
    // Unmount all React components
    Object.keys(this.rootContainers).forEach(key => {
      if (this.rootContainers[key]) {
        this.rootContainers[key].unmount();
      }
    });
    
    // Remove all mounted elements
    Object.keys(this.mountedElements).forEach(key => {
      if (this.mountedElements[key]) {
        this.mountedElements[key].remove();
      }
    });
    
    // Clean up modal if exists
    if (this.modalContainer && this.modalRoot) {
      this.modalRoot.unmount();
      this.modalContainer.remove();
    }
    
    this.log('Protega widgets cleaned up');
  }
  
  /**
   * Log debug messages
   */
  private log(...args: any[]) {
    if (this.options.debug) {
      console.log('[Protega]', ...args);
    }
  }
}

// Create global object
declare global {
  interface Window {
    Protega: {
      init: (options: ProtegaOptions) => ProtegaShopify;
    };
  }
}

// Export init function to global object
window.Protega = {
  init: (options: ProtegaOptions) => new ProtegaShopify(options)
};

export default ProtegaShopify; 