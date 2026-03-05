const { test, expect } = require('@playwright/test');
const { ShopApiService } = require('../../services/ShopApiService');
const { ProductApiService } = require('../../services/ProductApiService');

test('Negative Test - modify slug number', async ({ request }) => {
  const shopApiService = new ShopApiService(request);
  const productApiService = new ProductApiService(request);

  const { response: listResponse, body } = await shopApiService.fetchProducts('ring');
  expect(listResponse.status()).toBe(200);

  const slug = body.data.products.data[0].slug;
  const invalidSlug = productApiService.createInvalidSlug(slug);

  const response = await productApiService.fetchBySlug(invalidSlug);
  const status = response.status();

  expect([400, 404]).toContain(status);

});