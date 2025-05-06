// This script should be added to the Shopify theme.liquid file
// Alternatively, it can be loaded via Shopify's Script Editor app

(function() {
  // Configuration
  const PROTEGA_CONFIG = {
    apiKey: "YOUR_API_KEY_HERE", // Replace with your actual API key
    shopDomain: Shopify.shop || window.location.hostname,
    debug: false,
    mountPoints: {
      pdp: '#protega-pdp-container', // Add a div with this ID where you want the PDP widget
      cart: '#protega-cart-container', // Add a div with this ID where you want the cart widget
    }
  };
  
  // Load CSS
  function loadCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.yourcdn.com/protega-shopify.css'; // Replace with actual CDN URL
    document.head.appendChild(link);
  }
  
  // Load JS
  function loadJS(callback) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://cdn.yourcdn.com/protega-shopify.umd.js'; // Replace with actual CDN URL
    script.onload = callback;
    document.head.appendChild(script);
  }

  // Initialize Protega once loaded
  function initProtega() {
    if (window.Protega) {
      // Initialize with configuration
      const protega = window.Protega.init(PROTEGA_CONFIG);
      
      // Store instance for later use
      window.protegaInstance = protega;
    } else {
      console.error('Protega script failed to load properly');
    }
  }
  
  // Create containers if needed
  function createContainers() {
    // For product pages
    if (window.location.pathname.includes('/products/')) {
      if (!document.querySelector(PROTEGA_CONFIG.mountPoints.pdp)) {
        // Try to find good insertion points, specific to the theme
        let insertAfter;
        
        // Dawn theme - after product form
        insertAfter = document.querySelector('.product__info-wrapper .product-form');
        
        // Debut theme - after product form
        if (!insertAfter) {
          insertAfter = document.querySelector('.product-single__meta form.product-form');
        }
        
        // Expanse theme
        if (!insertAfter) {
          insertAfter = document.querySelector('.product__details .product-block--form');
        }
        
        // Create and insert container
        if (insertAfter) {
          const container = document.createElement('div');
          container.id = 'protega-pdp-container';
          container.className = 'protega-container';
          insertAfter.parentNode.insertBefore(container, insertAfter.nextSibling);
        }
      }
    }
    
    // For cart page
    if (window.location.pathname.includes('/cart')) {
      if (!document.querySelector(PROTEGA_CONFIG.mountPoints.cart)) {
        // Try to find good insertion points, specific to the theme
        let insertAfter;
        
        // Dawn theme - before checkout button
        insertAfter = document.querySelector('.cart__footer .cart__ctas');
        
        // Debut theme - before checkout button
        if (!insertAfter) {
          insertAfter = document.querySelector('.cart__footer');
        }
        
        // Create and insert container
        if (insertAfter) {
          const container = document.createElement('div');
          container.id = 'protega-cart-container';
          container.className = 'protega-container';
          insertAfter.parentNode.insertBefore(container, insertAfter);
        }
      }
    }
  }
  
  // Load CSS first
  loadCSS();
  
  // Create containers for widgets
  document.addEventListener('DOMContentLoaded', createContainers);
  
  // Load JS and initialize
  loadJS(initProtega);
})(); 