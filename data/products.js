import { formatCurrency } from "../scripts/utils/money.js";

export class Product{
  id;
  image;
  name;
  rating;
  priceCents;
  keywords;
  type;
  sizeChartLink;
  
  constructor(productDetails){
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
    this.type = productDetails.type;
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  getStarsUrl(){
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice(){
    return formatCurrency(this.priceCents);
  }

  extraInfoHTML(){
    return '';
  }
}

export class Clothing extends Product{ 
  sizeChartLink;

  constructor( productDetails){
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML(){
  //super.extraInfoHTML();
    return `<a href="${this.sizeChartLink}" target="_blank" class="product-size-chart-link">Size Chart</a>`;
  }
}

const tshirt = new Clothing({
  id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
  image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
  name: "Adults Plain Cotton T-Shirt - 2 Pack",
  rating: {
    stars: 4.5,
    count: 56
  },
  priceCents: 799,
  keywords: [
    "tshirts",
    "apparel",
    "mens"
  ],
  type: "clothing",
  sizeChartLink: "images/clothing-size-chart.png" 
});

export class Appliance extends Product{
  instructionsLink;
  warrantyLink;

  constructor(productDetails){
    super(productDetails);
    this.instructionsLink = productDetails.instructionsLink;
    this.warrantyLink = productDetails.warrantyLink;
  }

  extraInfoHTML(){
    return `<a href="${this.instructionsLink}" target="_blank" class="product-instructions-link">Instructions</a>
            <a href="${this.warrantyLink}" target="_blank" class="product-warranty-link">Warranty</a>`;
  }
}

export let products = [];

export function getProductById(productId) {
  return products.find(product => product.id === productId);
}

export function loadProducts(callback) {
  return fetch('https://supersimplebackend.dev/products').then((response) => {
    return response.json();
  }).then((productsData) => {
    products = productsData.map(productDetails => {
      if (productDetails.type === "clothing") {
        return new Clothing(productDetails);
      }
      if (productDetails.type === "appliance") {
        return new Appliance(productDetails);
      }
      return new Product(productDetails);
    });
    if (callback) {
      callback();
    }
    return products;
  }).catch((error) => {
    console.error('Error loading products:', error);
    throw error;
  });
}


