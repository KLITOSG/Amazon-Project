import {cart, 
  removeFromCart, 
  calculateCartQuantity,
  updateCartQuantity,
  updateDeliveryOption} from'../../data/cart.js';
import {products, getProductById} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions, getDeliveryOptionById} from '../../data/deliveryOptions.js';
import {renderPaymentSummary} from './paymentSummary.js';

const today = dayjs();
const deliveryDate = today.add(7, 'days');
const formattedDeliveryDate = deliveryDate.format('dddd, MMMM D');

export function renderOrderSummary() {
  let cartHTML = '';

  cart.forEach(cartItem => {
    const productId = cartItem.productId;

    const matchingProduct = getProductById(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption = getDeliveryOptionById(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const formattedDeliveryDate = deliveryDate.format('dddd, MMMM D');

    cartHTML += `
  <div class="cart-item-container 
    cart-item-container-Js-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: ${formattedDeliveryDate}
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          ${formatCurrency(matchingProduct.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label quantity-label-Js-${matchingProduct.id}">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary update-link-Js" data-product-id="${matchingProduct.id}">
            Update
          </span>
          <input class="quantity-input quantity-input-Js-${matchingProduct.id}">
          <span class = "save-quantity-link link-primary save-link-Js" data-product-id="${matchingProduct.id}">Save</span>
          <span class="delete-quantity-link link-primary delete-link-Js" data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${deliveryOptionsHTML(matchingProduct, cartItem)}
      </div>
    </div>
  </div>

`;
});

  function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';
  deliveryOptions.forEach(deliveryOption => {
   const today = dayjs();
   const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
   const formattedDeliveryDate = deliveryDate.format('dddd, MMMM D');

   const priceString = deliveryOption.priceCents === 0 
   ? 'FREE Shipping' 
   : `$${(deliveryOption.priceCents / 100).toFixed(2)} - Shipping`;
   
const isChecked = deliveryOption.id ===cartItem.deliveryOptionId 
? 'checked' 
: '';

   html += `
     <div class="delivery-option delivery-option-js"
     data-product-id="${matchingProduct.id}"
     data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
        ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${formattedDeliveryDate}
          </div>
          <div class="delivery-option-price">
            ${priceString}
          </div>
        </div>
      </div>
    `
    });

    return html;
  }

  document.querySelector('.order-summary-Js').innerHTML = cartHTML;

  document.querySelectorAll('.delete-link-Js').forEach(link => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
    

      const container = document.querySelector(`.cart-item-container-Js-${productId}`);

      container.remove();

      updateCheckoutQuantity();
      renderPaymentSummary();
    });
  });



  function updateCheckoutQuantity() {
    const cartQuantity = calculateCartQuantity();

  document.querySelector('.return-to-home-link-Js').innerHTML = `${cartQuantity} items`;
  };

  updateCheckoutQuantity();

  document.querySelectorAll('.update-link-Js').forEach(link => {
    link.addEventListener('click', () => {
    const productId = link.dataset.productId;

    const container = document.querySelector(`.cart-item-container-Js-${productId}`);

    container.classList.add('updating-quantity');
    })
  });

  document.querySelectorAll('.save-link-Js').forEach(link => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      const container = document.querySelector(`.cart-item-container-Js-${productId}`);

      container.classList.remove('updating-quantity');

      const quantityInput = document.querySelector(`.quantity-input-Js-${productId}`);

      const newQuantity = Number(quantityInput.value);

      if(newQuantity < 0 || newQuantity >= 1000) {
        alert('Quantity must be at least 0 and less than 1000');
        return;
      }

      updateCartQuantity(productId, newQuantity);

      container.classList.remove('updating-quantity');

      const quantityLabel = document.querySelector(`.quantity-label-Js-${productId}`);

      quantityLabel.innerHTML = newQuantity;

      updateCheckoutQuantity();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.delivery-option-js').forEach(element => {
    element.addEventListener('click', () => {
      const{productId, deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId,deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    })
  })
  }

