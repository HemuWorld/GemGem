class CatalogPage {
  constructor(page) {
    this.page = page;
    this.resultLocator = page.locator('span:has-text("Result Available")').first();
    this.productCards = page.locator('a.item-box');
  }

  parseCount(text) {
    const match = (text || '').replace(/,/g, '').match(/\d+/);
    return Number(match?.[0] || 0);
  }

  async getResultCount() {
    try {
      await this.resultLocator.waitFor({ timeout: 5000 });
      const text = await this.resultLocator.textContent();
      return this.parseCount(text);
    } catch {
      return 0;
    }
  }

  async chooseCategoryDeterministically(options = {}) {
    const categories = options.categories || ['ring', 'necklace', 'bracelet'];
    const minResults = options.minResults || 3;

    for (const category of categories) {
      await this.page.locator(`#${category}`).click();

      try {
        await this.productCards.first().waitFor({ timeout: 5000 });
      } catch {
      }

      const count = await this.getResultCount();
      if (count >= minResults) {
        return { categoryUsed: category, count };
      }
    }

    return {
      categoryUsed: categories[categories.length - 1],
      count: await this.getResultCount()
    };
  }

  async applySortHighToLow() {
    const sortResponsePromise = this.page.waitForResponse((response) =>
      response.request().method() === 'GET' &&
      response.url().includes('/api/v1/c2c/shop') &&
      response.status() === 200
    ).catch(() => null);

    await this.page.getByRole('button', { name: /Sort By/i }).click();
    await this.page.getByText('Price: High to Low').click();

    await sortResponsePromise;

    const noResultsState = this.page.getByText(/No exact matches found/i).first();
    const firstItemState = this.page.locator('.item-box').first();

    await Promise.race([
      firstItemState.waitFor({ timeout: 10000 }).catch(() => null),
      noResultsState.waitFor({ timeout: 10000 }).catch(() => null)
    ]);
  }

  async getVisibleUsdPrices(limit = 10) {
    const prices = await this.page
      .locator('.item-box span:has-text("USD")')
      .allTextContents();

    return prices.slice(0, limit).map((price) =>
      Number(price.replace('USD $', '').replace(/,/g, ''))
    );
  }

  async waitForProducts() {
    await this.productCards.first().waitFor();
  }

  async getProductCount() {
    return this.productCards.count();
  }

  getProduct(index) {
    return this.productCards.nth(index);
  }
}

module.exports = { CatalogPage };
