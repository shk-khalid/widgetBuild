// src/entry-widget.tsx

import { createRoot } from 'react-dom/client';
import PDPWidget from './components/widgets/PDPWidget';
import PostCartModal from './components/widgets/PostCartModal';

declare global {
  interface Window {
    __PRODUCT__: any;
    selectedProtectionPlan: string | null;
  }
}

// Helper to grab the Shopify product JSON (injected via Liquid)
function getShopifyProduct() {
  return window.__PRODUCT__;
}

(function mountWidgets() {
  // Only on product pages
  if (!window.location.pathname.match(/^\/products\//)) return;

  // 1️⃣ Find the Add‑to‑cart form
  const productForm = document.querySelector<HTMLFormElement>(
    'form[action*="/cart/add"]'
  );
  if (!productForm) return;

  // 2️⃣ Create your PDP mount point above the buttons
  const widgetRoot = document.createElement('div');
  widgetRoot.id = 'pdp-widget-root';
  const buttonGroup = productForm.querySelector('.product-form__controls-group');
  if (buttonGroup) productForm.insertBefore(widgetRoot, buttonGroup);
  else productForm.appendChild(widgetRoot);

  // 3️⃣ Grab and guard the product data
  const product = getShopifyProduct();
  if (!product) {
    console.error('Protega Widget: no product data found, aborting mount.');
    return;
  }

  // 4️⃣ Grab the currently selected variant ID from the hidden "id" input
  const variantInput = productForm.querySelector<HTMLInputElement>('input[name="id"]');
  if (!variantInput || !variantInput.value) {
    console.error('Protega Widget: no variant input found, aborting mount.');
    return;
  }
  const variantId = variantInput.value;

  // 5️⃣ Render the PDP widget, passing both product and variantId
  const pdpRoot = createRoot(widgetRoot);
  pdpRoot.render(<PDPWidget product={product} variantId={variantId} />);

  // 6️⃣ Intercept form submission to show the PostCartModal if no plan chosen
  productForm.addEventListener('submit', (e) => {
    if (!window.selectedProtectionPlan) {
      e.preventDefault();

      // a) Highlight & scroll the PDP widget
      widgetRoot.scrollIntoView({ behavior: 'smooth', block: 'center' });
      widgetRoot.classList.add('highlight');
      setTimeout(() => widgetRoot.classList.remove('highlight'), 1500);

      // b) Create and mount the PostCartModal, passing product + variantId
      const modalRoot = document.createElement('div');
      modalRoot.id = 'postcart-modal-root';
      document.body.appendChild(modalRoot);

      const modalApi = createRoot(modalRoot);
      const closeModal = () => {
        modalApi.unmount();
        modalRoot.remove();
      };

      modalApi.render(
        <PostCartModal
          product={product}
          variantId={variantId}
          onClose={closeModal}
        />
      );
    }
  });
})();
