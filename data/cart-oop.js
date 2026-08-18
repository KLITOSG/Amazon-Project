import {validDeliveryOption} from './deliveryOptions.js';

export class Cart {
  cartItems = [];
  #localStorageKey;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const storedCart = JSON.parse(localStorage.getItem(this.#localStorageKey));
      this.cartItems = Array.isArray(storedCart) ? storedCart : [];
    } catch (error) {
      this.cartItems = [];
    }
  }

  saveToLocalStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }

  addToCart(productId, quantity = 1) {
    const quantityToAdd = Number(quantity);

    if (!productId || !Number.isFinite(quantityToAdd) || quantityToAdd <= 0) {
      return;
    }

    const matchingItem = this.#findItem(productId);

    if (matchingItem) {
      matchingItem.quantity += quantityToAdd;
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
    return this.cartItems.reduce((totalQuantity, cartItem) => (
      totalQuantity + cartItem.quantity
    ), 0);
  }

  updateCartQuantity(productId, newQuantity) {
    this.updateQuantity(productId, newQuantity);
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    const matchingItem = this.#findItem(productId);

    if (!matchingItem || !validDeliveryOption(deliveryOptionId)) {
      return;
    }

    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToLocalStorage();
  }

  updateQuantity(productId, newQuantity) {
    const matchingItem = this.#findItem(productId);
    const quantity = Number(newQuantity);

    if (!matchingItem || !Number.isFinite(quantity) || quantity < 0 || quantity >= 1000) {
      return;
    }

    matchingItem.quantity = quantity;
    this.saveToLocalStorage();
  }

  #findItem(productId) {
    return this.cartItems.find(cartItem => cartItem.productId === productId);
  }
}

export const cart = new Cart('cart-oop');
