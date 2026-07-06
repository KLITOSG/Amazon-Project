import {cart, calculateCartQuantity} from '../../data/cart.js';
import {getProductById} from '../../data/products.js';
import {getDeliveryOptionById} from '../../data/deliveryOptions.js';
import {formatCurrency} from '../utils/money.js';

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  
  cart.forEach(cartItem => {
    const product = getProductById(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;
    const deliveryOption = getDeliveryOptionById(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforTaxCents = productPriceCents + shippingPriceCents;

  const taxcents = totalBeforTaxCents * 0.1; 
  const totalCents = totalBeforTaxCents + taxcents;
  const cartQuantity = calculateCartQuantity();

  const paymentSummaryHTML = 
  `
   <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${cartQuantity}):</div>
      <div class="payment-summary-money">
      ${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">
      ${formatCurrency(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
      ${formatCurrency(totalBeforTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
      ${formatCurrency(taxcents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">
      ${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>

  `

  document.querySelector('.payment-summary-Js').innerHTML = paymentSummaryHTML;
}
