const { defineConfig } = require('@playwright/test');
const { TEST_CONFIG } = require('./config/test-config');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  outputDir: 'test-results',
  timeout: 45_000,
  expect: {
    timeout: 10_000
  },
  reporter: [[
    'html',
    {
      outputFolder: 'reports/html',
      open: 'never',
      attachmentsBaseURL: 'data/'
    }
  ]],
  use: {
    baseURL: TEST_CONFIG.urls.frontendBase,
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'on',
    viewport: { width: 1366, height: 768 }
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium'
      }
    }
  ]
});
