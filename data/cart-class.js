import {validDeliveryOption} from './deliveryOptions.js';

export class Cart {
  cartItems = undefined;
  localStorageKey = undefined;

  constructor(localStorageKey) {
    this.localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  loadFromStorage() {
    const savedItems = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    this.cartItems = Array.isArray(savedItems) ? savedItems : [];

    this.cartItems.forEach(cartItem => {
      if (!cartItem.deliveryOptionId) {
        cartItem.deliveryOptionId = '1';
      }
    });
  }

  saveToLocalStorage() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
  }

  addToCart(productId, quantity = 1) {
    const quantityToAdd = Number(quantity);

    if (Number.isNaN(quantityToAdd) || quantityToAdd <= 0) {
      return;
    }

    const existingItem = this.cartItems.find(cartItem => cartItem.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantityToAdd;
    } else {
      this.cartItems.push({
        productId,
        quantity: quantityToAdd,
        deliveryOptionId: '1'
      });
    }

    this.saveToLocalStorage();
  }

  removeFromCart(productId) {
    this.cartItems = this.cartItems.filter(cartItem => (
      cartItem.productId !== productId
    ));
    this.saveToLocalStorage();
  }

  calculateCartQuantity() {
    let cartQuantity = 0;

    this.cartItems.forEach(cartItem => {
      cartQuantity += cartItem.quantity;
    });

    return cartQuantity;
  }

  updateCartQuantity(productId, newQuantity) {
    const updatedQuantity = Number(newQuantity);

    if (Number.isNaN(updatedQuantity)) {
      return;
    }

    if (updatedQuantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const cartItem = this.cartItems.find(item => item.productId === productId);

    if (!cartItem) {
      return;
    }

    cartItem.quantity = updatedQuantity;
    this.saveToLocalStorage();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    const cartItem = this.cartItems.find(item => item.productId === productId);

    if (!cartItem) {
      return;
    }

    if (!validDeliveryOption(deliveryOptionId)) {
      return;
    }

    cartItem.deliveryOptionId = deliveryOptionId;
    this.saveToLocalStorage();
  }
}

export const cart = new Cart('cart-oop');
export const businessCart = new Cart('businessCart');

export function addToCart(productId, quantity) {
  cart.addToCart(productId, quantity);
}

export function removeFromCart(productId) {
  cart.removeFromCart(productId);
}

export function calculateCartQuantity() {
  return cart.calculateCartQuantity();
}

export function updateCartQuantity(productId, newQuantity) {
  cart.updateCartQuantity(productId, newQuantity);
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  cart.updateDeliveryOption(productId, deliveryOptionId);
}
