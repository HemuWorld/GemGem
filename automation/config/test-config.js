require('dotenv').config();

const FRONTEND_BASE_URL = process.env.BASE_URL || 'https://mp2-frontend-staging.jewelprotech.com/en/';
const API_BASE_URL = process.env.API_BASE_URL || 'https://mp2-api-staging.jewelprotech.com/api/v1/c2c';

const TEST_CONFIG = {
  urls: {
    frontendBase: FRONTEND_BASE_URL,
    apiBase: API_BASE_URL
  },
  determinism: {
    minResults: 3,
    searchUiSettleMs: 1200,
    searchTerms: [
      'rings',
      'necklace',
      'bracelets'
    ]
  }
};

module.exports = { TEST_CONFIG };
