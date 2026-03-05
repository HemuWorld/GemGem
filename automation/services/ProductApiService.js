const { TEST_CONFIG } = require('../config/test-config');

class ProductApiService {
  constructor(request) {
    this.request = request;
    this.baseUrl = TEST_CONFIG.urls.apiBase;
  }

  getProductUrl(slug) {
    return `${this.baseUrl}/product/${slug}?include=full_details&lang=en`;
  }

  createInvalidSlug(slug) {
    const match = slug?.match(/(\d+)$/);

    if (!match) {
      return `${slug}-invalid`;
    }

    const incremented = Number(match[1]) + 1;
    return slug.replace(/\d+$/, String(incremented));
  }

  async fetchBySlug(slug) {
    return this.request.get(this.getProductUrl(slug));
  }
}

module.exports = { ProductApiService };
