class ProductPage {
  constructor(page) {
    this.page = page;
  }

  parseUsdPrice(text) {
    return Number((text || '').replace(/[^0-9.]/g, ''));
  }

  async isCurrentProductPage() {
    return /product/.test(this.page.url());
  }

  async getTitle() {
    return this.page.locator('h1.title').first().textContent();
  }

  async getPriceText() {
    return this.page.locator('.price-main span').first().textContent();
  }

  async getPriceValue() {
    return this.parseUsdPrice(await this.getPriceText());
  }

  async getOriginalPriceValue() {
    const text = await this.page.locator('.price-strike span').first().textContent();
    return this.parseUsdPrice(text);
  }

  async isSoldOut() {
    return (await this.page.locator('text=/currently sold out/i').count()) > 0;
  }

  getAddToCartButton() {
    return this.page.getByRole('button', { name: 'Add to cart' }).first();
  }

  async addToCart() {
    await this.page.getByRole('button', { name: /add to cart/i }).click();
  }

  async getTagValues() {
    const locator = this.page.locator('.chips span');
    const count = await locator.count();
    const tags = [];

    for (let i = 0; i < count; i++) {
      const tag = await locator.nth(i).textContent();
      tags.push(tag.trim());
    }

    return tags;
  }
}

module.exports = { ProductPage };
