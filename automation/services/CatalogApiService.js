const { TEST_CONFIG } = require('../config/test-config');

class CatalogApiService {
  constructor(request) {
    this.request = request;
    this.baseUrl = TEST_CONFIG.urls.apiBase;
  }

  getShopEndpointPath() {
    return `${this.baseUrl}/shop`;
  }
}

module.exports = { CatalogApiService };
