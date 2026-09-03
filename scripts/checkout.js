import { renderCheckoutHeader } from './checkout/checkoutHeader.js';
import {renderOrderSummary} from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import {loadProducts} from '../data/products.js';


Promise.all([ 
  new Promise((resolve, reject) => {
    loadProducts(() => {
    resolve('val1');
   });
 }),
 new Promise((resolve) => {
    resolve();
  })

]).then((values) => {
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary(); 
})


