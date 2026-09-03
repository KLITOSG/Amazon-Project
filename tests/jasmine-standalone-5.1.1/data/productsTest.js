import { Appliance, Clothing, Product, loadProducts, products } from '../../../data/products.js';

const productDetails = {
  id: 'product-id',
  image: 'images/products/product.jpg',
  name: 'Test Product',
  rating: {
    stars: 4.5,
    count: 100
  },
  priceCents: 2599,
  keywords: ['test', 'product'],
  type: 'product'
};

describe('Test Suite: Product', () => {
  it('stores the product properties', () => {
    const product = new Product(productDetails);

    expect(product.id).toEqual(productDetails.id);
    expect(product.image).toEqual(productDetails.image);
    expect(product.name).toEqual(productDetails.name);
    expect(product.rating).toEqual(productDetails.rating);
    expect(product.priceCents).toEqual(productDetails.priceCents);
    expect(product.keywords).toEqual(productDetails.keywords);
    expect(product.type).toEqual(productDetails.type);
  });

  it('returns the stars image URL and formatted price', () => {
    const product = new Product(productDetails);

    expect(product.getStarsUrl()).toEqual('images/ratings/rating-45.png');
    expect(product.getPrice()).toEqual('$25.99');
  });

  it('returns no extra information by default', () => {
    const product = new Product(productDetails);

    expect(product.extraInfoHTML()).toEqual('');
  });
});

describe('Test Suite: Clothing', () => {
  it('stores the size chart link', () => {
    const clothing = new Clothing({
      ...productDetails,
      type: 'clothing',
      sizeChartLink: 'images/clothing-size-chart.png'
    });

    expect(clothing.sizeChartLink).toEqual('images/clothing-size-chart.png');
    expect(clothing.extraInfoHTML()).toContain('Size Chart');
    expect(clothing.extraInfoHTML()).toContain('images/clothing-size-chart.png');
  });
});

describe('Test Suite: Appliance', () => {
  it('stores the instruction and warranty links', () => {
    const appliance = new Appliance({
      ...productDetails,
      type: 'appliance',
      instructionsLink: 'manual.pdf',
      warrantyLink: 'warranty.pdf'
    });

    expect(appliance.instructionsLink).toEqual('manual.pdf');
    expect(appliance.warrantyLink).toEqual('warranty.pdf');
    expect(appliance.extraInfoHTML()).toContain('Instructions');
    expect(appliance.extraInfoHTML()).toContain('manual.pdf');
    expect(appliance.extraInfoHTML()).toContain('Warranty');
    expect(appliance.extraInfoHTML()).toContain('warranty.pdf');
  });
});

describe('Test Suite: loadProducts', () => {
  it('loads products from the backend', (done) => {
    loadProducts(() => {
      expect(products.length).toBeGreaterThan(0);
      expect(products[0] instanceof Product).toBeTrue();
      done();
    });
  });
});