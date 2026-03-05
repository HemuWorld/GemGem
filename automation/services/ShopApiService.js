const { TEST_CONFIG } = require('../config/test-config');

class ShopApiService {
  constructor(request) {
    this.request = request;
    this.baseUrl = TEST_CONFIG.urls.apiBase;
  }

  getShopUrl(category = 'ring') {
    return `${this.baseUrl}/shop?category[0]=${category}&page=1&limit=40&lang=en`;
  }

  async fetchProducts(category = 'ring') {
    const response = await this.request.get(this.getShopUrl(category));
    const body = await response.json();
    return { response, body };
  }
}

module.exports = { ShopApiService };
