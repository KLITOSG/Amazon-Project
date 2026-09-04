import {cart, calculateCartQuantity} from '../../data/cart-class.js';
import {getProductById} from '../../data/products.js';
import {getDeliveryOptionById} from '../../data/deliveryOptions.js';
import {formatCurrency} from '../utils/money.js';
import {addOrder} from '../../data/orders.js';

export function renderPaymentSummary() {
  const paymentSummary = document.querySelector('.payment-summary-Js');

  if (!paymentSummary || !Array.isArray(cart.cartItems)) {
    console.error('Error rendering payment summary: invalid cart data');
    if (paymentSummary) {
      paymentSummary.innerHTML = 'Unable to load your order. Please refresh the page and try again.';
    }
    return;
  }

  const hasInvalidCartItem = cart.cartItems.some(cartItem => (
    !getProductById(cartItem.productId) || !getDeliveryOptionById(cartItem.deliveryOptionId)
  ));

  if (hasInvalidCartItem) {
    console.error('Error rendering payment summary: invalid cart item');
    paymentSummary.innerHTML = 'Unable to load your order. Please refresh the page and try again.';
    return;
  }

  let productPriceCents = 0;
  let shippingPriceCents = 0;
  
  cart.cartItems.forEach(cartItem => {
    const product = getProductById(cartItem.productId);
    const deliveryOption = getDeliveryOptionById(cartItem.deliveryOptionId);

    productPriceCents += product.priceCents * cartItem.quantity;
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
      <div class="payment-summary-money js-payment-summary-shipping">
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
      <div class="payment-summary-money js-payment-summary-total">
      ${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary
    js-place-order-button" >
      Place your order
    </button>

  `

  paymentSummary.innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order-button')
   .addEventListener('click', async() => {
    const button = document.querySelector('.js-place-order-button');
    button.disabled = true;

    try {
      const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: cart.cartItems,
        })
      });

      if (!response.ok) {
        throw new Error(`Order placement failed: ${response.status}`);
      }

      const orderData = await response.json();
      if (!orderData) {
        throw new Error('Order placement returned no order data');
      }

      addOrder(orderData);
      cart.cartItems = [];
      cart.saveToLocalStorage();
      window.location.href = `orders.html?orderPlaced=${Date.now()}`;
    } catch (error) {
      console.error('Error placing order:', error);
      button.disabled = false;
      button.textContent = 'Unable to place order. Try again';
    }
  });
}
