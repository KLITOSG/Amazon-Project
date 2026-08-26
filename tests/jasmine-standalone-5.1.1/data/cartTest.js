import { addToCart, cart, removeFromCart, updateDeliveryOption } from '../../../data/cart-class.js';

const productId = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';

describe('Test Suite: addToCart', () => {
  beforeEach(() => {
    cart.cartItems = [];
    spyOn(localStorage, 'setItem');
  });

  it('adds an existing product to the cart', () => {
    cart.cartItems = [{ productId, quantity: 1, deliveryOptionId: '1' }];
    addToCart(productId);
    expect(cart.cartItems.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart.cartItems[0].productId).toEqual(productId);
    expect(cart.cartItems[0].quantity).toEqual(2);
  });

  it('adds a new product to the cart', () => {
    addToCart(productId);
    expect(cart.cartItems.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart.cartItems[0].productId).toEqual(productId);
    expect(cart.cartItems[0].quantity).toEqual(1);
  });
});

describe('Test Suite: removeFromCart', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
  });

  it('removes a product from the cart', () => {
    cart.cartItems = [{ productId, quantity: 1, deliveryOptionId: '1' }];
    removeFromCart(productId);
    expect(cart.cartItems.length).toEqual(0);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('does nothing if the product is not in the cart', () => {
    cart.cartItems = [{ productId, quantity: 1, deliveryOptionId: '1' }];
    removeFromCart('does-not-exist');
    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(productId);
    expect(cart.cartItems[0].quantity).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });
});

describe('Test Suite: updateDeliveryOption', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
  });

  it('updates the delivery option', () => {
    cart.cartItems = [{ productId, quantity: 1, deliveryOptionId: '1' }];
    updateDeliveryOption(productId, '3');
    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(productId);
    expect(cart.cartItems[0].deliveryOptionId).toEqual('3');
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('does nothing if the product is not in the cart', () => {
    cart.cartItems = [{ productId, quantity: 1, deliveryOptionId: '1' }];
    updateDeliveryOption('does-not-exist', '3');
    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].deliveryOptionId).toEqual('1');
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });

  it('does nothing if the delivery option does not exist', () => {
    cart.cartItems = [{ productId, quantity: 1, deliveryOptionId: '1' }];
    updateDeliveryOption(productId, 'does-not-exist');
    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].deliveryOptionId).toEqual('1');
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });
});
