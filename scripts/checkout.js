import { renderCheckoutHeader } from './checkout/checkoutHeader.js';
import {renderOrderSummary} from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import {loadProducts} from '../data/products.js';
import {loadCart} from '../data/cart-class.js';

async function loadPage() {
   await loadProducts();

   await new Promise ((resolve) => {
    loadCart(() => {
      resolve();
    });
   });

  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();






