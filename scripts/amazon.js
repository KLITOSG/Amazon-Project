
let productsHTML = '';

products.forEach(product => {
  productsHTML += `<div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
           ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating}
            </div>
          </div>

          <div class="product-price">
            ${(product.priceCents / 100).toFixed(2)}
          </div>

          <div class="product-quantity-container">
            <select class="quantity-selector-Js-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary add-to-cart-JS"
          data-product-id= "${product.id}">
            Add to Cart
          </button>
        </div>
        `;

});


document.querySelector('.product-grid-JS').innerHTML = productsHTML;

document.querySelectorAll('.add-to-cart-JS')
  .forEach(button => {
      button.addEventListener('click', () => {
      const {productId} = button.dataset;

      const quantitySelector = document.querySelector(`.quantity-selector-Js-${productId}`);

      const quantity = Number(quantitySelector.value);
      
      let matchingItem;

      cart.forEach(item => {
        if(productId === item.productId) {
        matchingItem = item;
        }
      });

      if(matchingItem) {
        matchingItem.quantity +=quantity;
      }
      else {
        cart.push({
        productId,
        quantity
      })
      };
      
      cartQuantity = 0;

      cart.forEach(item => {
       cartQuantity += item.quantity
      })
      
      document.querySelector('.cart-quantity-Js')
        .innerHTML = cartQuantity;
      })
    });
