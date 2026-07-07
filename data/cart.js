export let cart = JSON.parse(localStorage.getItem('cart'))
 if(!cart) {
  cart = [];
 }

function saveToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity) {

  let matchingItem;

    cart.forEach(cartItem => {
      if(productId === cartItem.productId) {
      matchingItem = cartItem;
      }
    });

    if(matchingItem) {
      matchingItem.quantity +=quantity;
    }
    else {
     cart.push({
        productId,
        quantity,
        deliveryOptionId: '1'
      })
   };

  saveToLocalStorage();
};

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach(cartItem => {
    if(cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToLocalStorage();
};

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach(cartItem => {
    cartQuantity += cartItem.quantity
  })
  return cartQuantity;
}

export function updateCartQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach(cartItem => {
    if(productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  matchingItem.quantity = newQuantity;

  saveToLocalStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach(cartItem => {
    if(productId === cartItem.productId) {
    matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToLocalStorage();

}

export function updateQuantity(productId,newQuantity) {
  let matchingItem;

  cart.forEach(cartItem => {
    if(productId ===cartItem.productId) {
      matchingItem = cartItem
    }
  });

  matchingItem.quantity = newQuantity;

  saveToLocalStorage();
}
