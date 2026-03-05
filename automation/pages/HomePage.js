const { TEST_CONFIG } = require('../config/test-config');

class HomePage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator('#search-input-desktop').first();
    this.searchInputFallback = page.getByRole('textbox', { name: /type to search/i }).first();
    this.searchOpenButton = page.getByRole('button', { name: /^search$/i }).first();
    this.homeUrl = TEST_CONFIG.urls.frontendBase;
  }

  async open() {
    await this.page.goto(this.homeUrl);
  }

  async openAllCategories() {
    await this.page.getByText('All Categories').click();
    await this.page.getByRole('link', { name: 'View All', exact: true }).click();
  }

  async searchByTerm(term) {
    await this.page.evaluate(() => window.scrollTo(0, 0));

    // Wait for search controls to be interactable instead of using fixed delay.
    await Promise.race([
      this.searchInput.waitFor({ state: 'visible', timeout: 6000 }).catch(() => null),
      this.searchOpenButton.waitFor({ state: 'visible', timeout: 6000 }).catch(() => null),
      this.searchInputFallback.waitFor({ state: 'visible', timeout: 6000 }).catch(() => null)
    ]);

    let input = this.searchInput;
    const primaryVisible = await this.searchInput.isVisible().catch(() => false);

    if (!primaryVisible) {
      const searchButtonVisible = await this.searchOpenButton.isVisible().catch(() => false);
      if (searchButtonVisible) {
        await this.searchOpenButton.click();
      }

      const fallbackVisible = await this.searchInputFallback.isVisible().catch(() => false);
      if (fallbackVisible) {
        input = this.searchInputFallback;
      }
    }

    await input.waitFor({ timeout: 10000 });
    await input.click();
    await input.fill(term);
    await input.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  isOnHomepage() {
    const currentUrl = this.page.url();
    return currentUrl === this.homeUrl || currentUrl.endsWith('/en') || currentUrl.endsWith('/en/');
  }

  async searchDeterministically(options = {}) {
    const terms = options.terms || TEST_CONFIG.determinism.searchTerms;
    const minResults = options.minResults || TEST_CONFIG.determinism.minResults;

    if (!options.getResultCount || typeof options.getResultCount !== 'function') {
      throw new Error('searchDeterministically requires getResultCount callback.');
    }

    let homeRedirectRecoveries = 0;
    let attempts = 0;

    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      await this.searchByTerm(term);
      attempts += 1;

      if (this.isOnHomepage()) {
        await this.searchByTerm(term);
        attempts += 1;
        homeRedirectRecoveries += 1;
      }

      const count = await options.getResultCount();
      if (count >= minResults) {
        return {
          termUsed: term,
          count,
          usedFallback: i > 0,
          attempts,
          homeRedirectRecoveries
        };
      }

      if (i < terms.length - 1) {
        await this.open();
      }
    }

    const lastTerm = terms[terms.length - 1];
    return {
      termUsed: lastTerm,
      count: await options.getResultCount(),
      usedFallback: true,
      attempts,
      homeRedirectRecoveries
    };
  }
}

module.exports = { HomePage };
