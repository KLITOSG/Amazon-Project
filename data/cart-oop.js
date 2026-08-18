import {validDeliveryOption} from './deliveryOptions.js';

const cart = { 
  cartItems : undefined,
    
  loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem('cart-oop'));

    if(!this.cartItems) {
      this.cartItems = [];
    }
  },

  saveToLocalStorage() {
   localStorage.setItem('cart-oop', JSON.stringify(this.cartItems));
  },

  addToCart(productId, quantity = 1) {

  let matchingItem;

    this.cartItems.forEach(cartItem => {
      if(productId === cartItem.productId) {
      matchingItem = cartItem;
      }
    });

    if(matchingItem) {
      matchingItem.quantity += quantity;
    }
    else {
     this.cartItems.push({
        productId,
        quantity,
        deliveryOptionId: '1'
      })
   };

   this.saveToLocalStorage();
  },

 removeFromCart(productId) {
  const newCart = [];

  this.cartItems.forEach(cartItem => {
    if(cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  this.cartItems = newCart;

  this.saveToLocalStorage();
 },

 calculateCartQuantity() {
  let cartQuantity = 0;

  this.cartItems.forEach(cartItem => {
    cartQuantity += cartItem.quantity
  })
  return cartQuantity;
 },

 calculateCartQuantity() {
  let cartQuantity = 0;

  this.cartItems.forEach(cartItem => {
    cartQuantity += cartItem.quantity
  })
  return cartQuantity;
 },

 calculateCartQuantity() {
  let cartQuantity = 0;

  this.cartItems.forEach(cartItem => {
    cartQuantity += cartItem.quantity
  })
  return cartQuantity;
 },

 updateCartQuantity(productId, newQuantity) {
  let matchingItem;

  this.cartItems.forEach(cartItem => {
    if(productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  matchingItem.quantity = newQuantity;

  this.saveToLocalStorage();
 },

 updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  this.cartItems.forEach(cartItem => {
    if(productId === cartItem.productId) {
    matchingItem = cartItem;
    }
  });

  if (!matchingItem) {
    return;
  }

  if (!validDeliveryOption(deliveryOptionId)) {
    return;
  }

  matchingItem.deliveryOptionId = deliveryOptionId;

  this.saveToLocalStorage();

 },

 updateQuantity(productId,newQuantity) {
  let matchingItem;

  this.cartItems.forEach(cartItem => {
    if(productId ===cartItem.productId) {
      matchingItem = cartItem
    }
  });

  matchingItem.quantity = newQuantity;

  this.saveToLocalStorage();
 } 
};

cart.loadFromStorage();
