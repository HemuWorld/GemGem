const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/HomePage');
const { CatalogApiService } = require('../../services/CatalogApiService');

test('UI ↔ API Correlation Test - Product Listing', async ({ page }) => {
  const homePage = new HomePage(page);
  const catalogApiService = new CatalogApiService(page.request);

  await homePage.open();

  const expectedShopEndpoint = catalogApiService.getShopEndpointPath();
  const expectedShopPrefix = `${expectedShopEndpoint}?`;

  // Wait for the exact API call triggered by UI
  const apiResponsePromise = page.waitForResponse(response =>
    response.request().method() === 'GET' &&
    response.url().startsWith(expectedShopPrefix) &&
    response.status() === 200
  );

  // UI action that triggers the API
  await homePage.openAllCategories();

  // Capture the API response
  const response = await apiResponsePromise;
  const body = await response.json();
  const products = body?.data?.products?.data;

  console.log("Products returned:", Array.isArray(products) ? products.length : 0);

  // Validate API response
  expect(body.status).toBe('success');
  expect(Array.isArray(products)).toBe(true);
  expect(products.length).toBeGreaterThan(0);

});