import { renderOrderSummary } from "../../../scripts/checkout/orderSummary.js";
import { loadFromStorage,cart } from '../../../data/cart.js';

describe('Test Suite: renderOrderSummary', ()=> {
  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  beforeEach(()=>{
      document.querySelector('.js-test-container').innerHTML = `
        <div class="js-checkout-header"></div>
        <div class="return-to-home-link-Js"></div>
        <div class="order-summary-Js"></div>
        <div class="payment-summary-Js"></div>
      `;

      spyOn(localStorage, 'setItem');

     spyOn(localStorage, 'getItem').and.callFake(()=>{
        return JSON.stringify([{
          productId: productId1,
          quantity: 2,
          deliveryOptionId: '1'
        }, {
          productId: productId2,
          quantity: 1,
          deliveryOptionId: '2'
        }]);
      });
      
      loadFromStorage();
      renderOrderSummary();
  })

  afterEach(()=>{
    document.querySelector('.js-test-container').innerHTML='';
  })

  it('Displays the cart', ()=> {
    
   

      expect(document.querySelector('.cart-item-container-Js-e43638ce-6aa0-4b85-b27f-e1d07eb678c6')).not.toBeNull();

      expect(
        document.querySelectorAll('.cart-item-container').length
      ).toEqual(2);

     expect(
       document.querySelector(`.js-product-name-${productId1}`).innerText).toEqual('Black and Gray Athletic Cotton Socks - 6 Pairs'
      );
       
     expect(
       document.querySelector(`.js-product-name-${productId2}`).innerText
      ).toEqual('Intermediate Size Basketball');

      expect(
       document.querySelector(`.js-product-price-${productId1}`).innerText
      ).toEqual('$10.90');
     
      expect(
       document.querySelector(`.js-product-price-${productId2}`).innerText
      ).toEqual('$20.95');

  });

  it('removes a product',()=>{
      document.querySelector(`.delete-link-Js[data-product-id="${productId1}"]`).click();

      expect(document.querySelector(`.cart-item-container-Js-${productId1}`)).toBeNull();
      expect(document.querySelector(`.cart-item-container-Js-${productId2}`)).not.toBeNull();

      expect(
       document.querySelector(`.js-product-name-${productId2}`).innerText
      ).toEqual('Intermediate Size Basketball');

      expect(
       document.querySelector(`.js-product-price-${productId2}`).innerText
      ).toEqual('$20.95');

      expect(cart.length).toEqual(1);
      expect(cart[0].productId).toEqual(productId2);
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);

  });

   it('updates the delivery option', () => {
    document.querySelector(`.js-delivery-option-${productId1}-3`).click();

    expect(
      document.querySelector(`.js-delivery-option-input-${productId1}-3`).checked
    ).toEqual(true);

    expect(cart.length).toEqual(2);
    expect(cart[0].productId).toEqual(productId1);
    expect(cart[0].deliveryOptionId).toEqual('3');

    expect(
      document.querySelector('.js-payment-summary-shipping').innerText
    ).toEqual('$14.98');
    expect(
      document.querySelector('.js-payment-summary-total').innerText
    ).toEqual('$63.50');
  });
});
