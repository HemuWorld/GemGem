const { defineConfig, devices } = require('@playwright/test');
const { TEST_CONFIG } = require('./config/test-config');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  timeout: 45_000,
  expect: {
    timeout: 10_000
  },
  reporter: [['html', { outputFolder: 'reports/html', open: 'never' }]],
  use: {
    baseURL: TEST_CONFIG.urls.frontendBase,
    headless: false,
    launchOptions: {
      args: ['--start-maximized']
    },
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    viewport: null
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
