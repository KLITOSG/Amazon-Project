import { renderCheckoutHeader } from './checkout/checkoutHeader.js';
import {renderOrderSummary} from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import {loadProducts} from '../data/products.js';
import {loadCart} from '../data/cart-class.js';

async function loadPage() {

  try {
   
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
  
  catch (error) {
    console.error('Error loading page:', error);
    document.querySelector('.order-summary-Js').innerHTML = 'Unable to load your order. Please refresh the page and try again.';
    document.querySelector('.payment-summary-Js').innerHTML = '';
    return;
  }

}
loadPage();






