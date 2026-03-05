const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/HomePage');
const { CatalogPage } = require('../../pages/CatalogPage');
const { TEST_CONFIG } = require('../../config/test-config');

test('Verify products are sorted by price (High to Low)', async ({ page }) => {
  test.setTimeout(120000);

  const homePage = new HomePage(page);
  const catalogPage = new CatalogPage(page);

  await homePage.open();
  const deterministicSearch = await homePage.searchDeterministically({
    minResults: TEST_CONFIG.determinism.minResults,
    getResultCount: () => catalogPage.getResultCount()
  });

  console.log('Search term used:', deterministicSearch.termUsed);
  console.log('Search results:', deterministicSearch.count);
  console.log('Fallback used:', deterministicSearch.usedFallback);
  console.log('Total search attempts:', deterministicSearch.attempts);
  console.log('Homepage redirect recoveries:', deterministicSearch.homeRedirectRecoveries);

  expect(deterministicSearch.count).toBeGreaterThan(0);
  expect(deterministicSearch.attempts).toBeGreaterThan(0);

  await catalogPage.applySortHighToLow();
  const numericPrices = await catalogPage.getVisibleUsdPrices(10);
  const comparablePrices = numericPrices.filter((price) => Number.isFinite(price) && price > 0);

  console.log("Prices:", numericPrices);
  expect(comparablePrices.length).toBeGreaterThan(1);

  for (let i = 1; i < comparablePrices.length; i++) {
    expect(comparablePrices[i]).toBeLessThanOrEqual(comparablePrices[i - 1]);
  }

  await expect(page.getByRole('button', { name: /Sort By: Price: High to Low/i })).toBeVisible();

});