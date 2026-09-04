import {orders} from '../data/orders.js';
import {loadProducts, getProductById} from '../data/products.js';
import {getDeliveryOptionById, calculateDeliveryDate} from '../data/deliveryOptions.js';
import {formatCurrency} from './utils/money.js';
import {cart} from '../data/cart-class.js';

function formatOrderDate(order) {
  if (!order.orderTime) {
    return 'Recently';
  }

  return new Date(order.orderTime).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric'
  });
}

function getOrderItems(order) {
  return order.products || order.cartItems || [];
}

function getOrderTotalCents(order, items) {
  if (typeof order.totalCostCents === 'number') {
    return order.totalCostCents;
  }

  return items.reduce((total, item) => {
    const product = getProductById(item.productId);
    const deliveryOption = getDeliveryOptionById(item.deliveryOptionId || '1');

    return total + (product ? product.priceCents * item.quantity : 0)
      + (deliveryOption ? deliveryOption.priceCents : 0);
  }, 0);
}

function renderOrderItem(item, orderId) {
  const product = getProductById(item.productId);

  if (!product) {
    return '';
  }

  const deliveryDate = item.estimatedDeliveryTime
    ? new Date(item.estimatedDeliveryTime).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    })
    : calculateDeliveryDate(getDeliveryOptionById(item.deliveryOptionId || '1'));

  return `
    <div class="product-image-container">
      <img src="${product.image}">
    </div>

    <div class="product-details">
      <div class="product-name">${product.name}</div>
      <div class="product-delivery-date">Arriving on: ${deliveryDate}</div>
      <div class="product-quantity">Quantity: ${item.quantity}</div>
      <button class="buy-again-button button-primary" data-product-id="${product.id}">
        <img class="buy-again-icon" src="images/icons/buy-again.png">
        <span class="buy-again-message">Buy it again</span>
      </button>
    </div>

    <div class="product-actions">
      <a href="tracking.html?orderId=${encodeURIComponent(orderId)}&productId=${encodeURIComponent(product.id)}">
        <button class="track-package-button button-secondary">Track package</button>
      </a>
    </div>
  `;
}

function renderOrders() {
  const ordersGrid = document.querySelector('.orders-grid');

  if (!ordersGrid) {
    return;
  }

  if (orders.length === 0) {
    ordersGrid.innerHTML = '<div class="page-title">You have not placed any orders yet.</div>';
    return;
  }

  ordersGrid.innerHTML = orders.map(order => {
    const items = getOrderItems(order);
    const itemHTML = items.map(item => renderOrderItem(item, order.id)).join('');

    return `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${formatOrderDate(order)}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>${formatCurrency(getOrderTotalCents(order, items))}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id || 'Unavailable'}</div>
          </div>
        </div>

        <div class="order-details-grid">${itemHTML}</div>
      </div>
    `;
  }).join('');
}

function updateCartQuantity() {
  const quantityElement = document.querySelector('.cart-quantity');
  if (quantityElement) {
    quantityElement.textContent = cart.calculateCartQuantity();
  }
}

async function loadPage() {
  try {
    updateCartQuantity();
    await loadProducts();
    renderOrders();
  } catch (error) {
    console.error('Error loading orders:', error);
    document.querySelector('.orders-grid').innerHTML = 'Unable to load your orders. Please refresh the page and try again.';
  }
}

loadPage();
