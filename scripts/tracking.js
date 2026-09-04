import {orders} from '../data/orders.js';
import {loadProducts, getProductById} from '../data/products.js';
import {cart} from '../data/cart-class.js';

function formatDate(dateValue) {
  if (!dateValue) {
    return 'Unavailable';
  }

  return new Date(dateValue).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}

function updateCartQuantity() {
  const quantityElement = document.querySelector('.cart-quantity');
  if (quantityElement) {
    quantityElement.textContent = cart.calculateCartQuantity();
  }
}

function renderTracking() {
  const params = new URLSearchParams(window.location.search);
  const selectedOrder = orders.find(order => order.id === params.get('orderId')) || orders[0];
  const items = selectedOrder?.products || selectedOrder?.cartItems || [];
  const selectedItem = items.find(item => item.productId === params.get('productId')) || items[0];
  const product = selectedItem ? getProductById(selectedItem.productId) : undefined;

  if (!selectedOrder || !selectedItem || !product) {
    document.querySelector('.order-tracking').innerHTML = 'Unable to load tracking details.';
    return;
  }

  const deliveryDate = selectedItem.estimatedDeliveryTime
    ? formatDate(selectedItem.estimatedDeliveryTime)
    : 'Unavailable';

  document.querySelector('.delivery-date').textContent = `Arriving on ${deliveryDate}`;
  document.querySelector('.product-info').textContent = product.name;
  document.querySelectorAll('.product-info')[1].textContent = `Quantity: ${selectedItem.quantity}`;
  document.querySelector('.product-image').src = product.image;
}

async function loadPage() {
  try {
    updateCartQuantity();
    await loadProducts();
    renderTracking();
  } catch (error) {
    console.error('Error loading tracking details:', error);
    document.querySelector('.order-tracking').innerHTML = 'Unable to load tracking details. Please try again.';
  }
}

loadPage();
