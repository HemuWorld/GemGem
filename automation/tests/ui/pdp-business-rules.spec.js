const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/HomePage');
const { CatalogPage } = require('../../pages/CatalogPage');
const { ProductPage } = require('../../pages/ProductPage');
const { TEST_CONFIG } = require('../../config/test-config');

test('Validate PDP business rules', async ({ page }) => {
  test.setTimeout(120000);

  const homePage = new HomePage(page);
  const catalogPage = new CatalogPage(page);
  const productPage = new ProductPage(page);

  await homePage.open();
  const deterministicSearch = await homePage.searchDeterministically({
    minResults: TEST_CONFIG.determinism.minResults,
    getResultCount: () => catalogPage.getResultCount()
  });
  console.log('Search term used:', deterministicSearch.termUsed);
  console.log('Search results:', deterministicSearch.count);
  console.log('Fallback used:', deterministicSearch.usedFallback);

  expect(deterministicSearch.count).toBeGreaterThan(0);

  await catalogPage.waitForProducts();

  const count = await catalogPage.getProductCount();
  let validatedProduct = false;

  for (let i = 0; i < count; i++) {
    const product = catalogPage.getProduct(i);

    // ---------- IMAGE VALIDATION ----------

    const imgSrc = await product.locator('img').first().getAttribute('src');

    if (!imgSrc || imgSrc.includes('default_product_image')) {
      console.log(`Product ${i+1} skipped → Default image`);
      continue;
    }

    // ---------- PLP NAME ----------

    const plpName = await product
      .locator('.item-box-detail span')
      .first()
      .textContent();

    if (!plpName || !plpName.trim()) {
      console.log(`Product ${i+1} skipped → Missing PLP name`);
      continue;
    }

    console.log("PLP Name:", plpName);

    // ---------- PLP PRICE ----------

    const plpPriceText = await product
      .locator('.text-blue-primary span')
      .first()
      .textContent();

    if (!plpPriceText || !plpPriceText.includes('USD')) {
      console.log(`Product ${i+1} skipped → Missing USD price`);
      continue;
    }

    console.log("PLP Price:", plpPriceText);

    const plpPrice = productPage.parseUsdPrice(plpPriceText);

    // ---------- PLP TAGS ----------

    const tagLocator = product.locator('.inline-flex span');
    const tagCount = await tagLocator.count();

    const plpTags = [];

    for (let t = 0; t < tagCount; t++) {
      const tag = await tagLocator.nth(t).textContent();
      if (tag) {
        plpTags.push(tag.trim());
      }
    }

    console.log("PLP Tags:", plpTags);

    // ---------- OPEN PDP ----------

    await product.click();

    await expect(page).toHaveURL(/product/);

    // ---------- PDP TITLE ----------

    const pdpTitle = await page.locator('h1.title').first().textContent();
    expect(pdpTitle).toBeTruthy();

    console.log("PDP Title:", pdpTitle);

    expect(pdpTitle.toLowerCase())
      .toContain(plpName.toLowerCase().trim().substring(0,10));

    // ---------- PDP PRICE ----------

    const pdpPriceText = await productPage.getPriceText();
    expect(pdpPriceText).toBeTruthy();

    console.log("PDP Price:", pdpPriceText);

    const pdpPrice = productPage.parseUsdPrice(pdpPriceText);

    expect(pdpPrice).toBe(plpPrice);

    // ---------- DISCOUNT VALIDATION ----------

    const discountTag = plpTags.find(t => t.includes('%'));

    if (discountTag) {

      const discountPercent = parseInt(discountTag, 10);

      const originalPrice = await productPage.getOriginalPriceValue();

      const actualDiscount =
        Math.round(((originalPrice - pdpPrice) / originalPrice) * 100);

      console.log("Expected Discount:", discountPercent);
      console.log("Actual Discount:", actualDiscount);

      expect(actualDiscount).toBe(discountPercent);
    }

    // ---------- SOLD OUT VALIDATION ----------

    const soldOut = await productPage.isSoldOut();

    console.log("Sold Out:", soldOut);

    const addToCartButton = productPage.getAddToCartButton();

    if (soldOut) {

      await expect(addToCartButton).toHaveCount(0);
      console.log("Add to Cart correctly hidden");

    } else {

      await expect(addToCartButton).toBeVisible();
      console.log("Add to Cart available");

    }

    // ---------- PDP TAG VALIDATION ----------

    const pdpTags = await productPage.getTagValues();

    console.log("PDP Tags:", pdpTags);

    for (const tag of plpTags) {
      expect(pdpTags).toContain(tag);
    }

    validatedProduct = true;

    // only one product
    break;

  }

  expect(validatedProduct).toBeTruthy();

});