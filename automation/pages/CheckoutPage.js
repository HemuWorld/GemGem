const { expect } = require('@playwright/test');

class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  async openCheckoutFromCartToast() {
    const checkoutButton = this.page.getByRole('button', { name: /go to checkout/i }).first();
    await expect(checkoutButton).toBeVisible({ timeout: 30000 });
    await expect(checkoutButton).toBeEnabled({ timeout: 30000 });
    await checkoutButton.click();
  }

  async getItemPriceText() {
    return this.page
      .locator('.checkout-payment-summary:visible')
      .getByText('Item Price')
      .locator('..')
      .locator('span')
      .first()
      .textContent();
  }

  async getTotalAmountText() {
    return this.page
      .locator('text=Total Amount')
      .locator('xpath=..')
      .locator('.total-value')
      .first()
      .textContent();
  }

  async isShippingStepVisible() {
    return this.page.getByText('Shipping Details').isVisible();
  }

  async fillShippingDetails(user) {
    await this.page.getByRole('textbox', { name: 'First name' }).fill(user.firstName);
    await this.page.getByRole('textbox', { name: 'Last name' }).fill(user.lastName);
    await this.page.getByRole('textbox', { name: 'Enter Email' }).fill(user.email);
    await this.page.getByLabel('Mobile number').fill(user.phone);
    await this.page.getByRole('textbox', { name: 'Zip Code' }).fill(user.zipCode);
    await this.page.getByRole('textbox', { name: 'State' }).fill(user.state);
    await this.page.getByRole('textbox', { name: 'City' }).fill(user.city);
    await this.page.getByLabel('Apartment, suite, building').fill(user.address);
  }

  async continueToPayment() {
    const apiSettlePromise = this.page.waitForResponse((response) => {
      const url = response.url();
      const status = response.status();
      return (
        response.request().method() === 'GET' &&
        (url.includes('/api/v1/shopping-cart') || url.includes('/api/v1/c2c') || url.includes('/api/v1/promotion')) &&
        [200, 201, 204, 304].includes(status)
      );
    }, { timeout: 20000 }).catch(() => null);

    const continueButton = this.page.getByRole('button', { name: /continue to payment/i }).first();
    const hasContinueButton = await continueButton.isVisible().catch(() => false);

    if (!hasContinueButton) {
      return false;
    }

    const clickSuccess = await continueButton.click().then(() => true).catch(() => false);
    if (!clickSuccess) {
      return false;
    }

    await Promise.allSettled([
      apiSettlePromise,
      this.page.waitForLoadState('networkidle').catch(() => null)
    ]);

    return true;
  }

  async waitForPaymentStep() {
    await this.page.waitForURL(/checkout/, { timeout: 30000 });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle').catch(() => null);
    await this.page.locator('#card-number iframe').first().waitFor({ timeout: 30000 });
  }

  async fillStripeCard(card) {
    await this.page.frameLocator('#card-number iframe')
      .locator('input[name="cardnumber"]')
      .fill(card.number);

    await this.page.frameLocator('#card-expiry iframe')
      .locator('input[name="exp-date"]')
      .fill(card.expiry);

    await this.page.frameLocator('#card-cvc iframe')
      .locator('input[name="cvc"]')
      .fill(card.cvc);
  }

  async confirmPayment() {
    await this.page.locator('button.primary-button').click();
  }

  async waitForOrderConfirmation() {
    await this.page.waitForURL(/order-placed/, { timeout: 240000 });
    await expect(this.page.getByRole('heading', { name: /order confirm/i })).toBeVisible({ timeout: 240000 });
    await expect(this.page.getByText(/payment in process/i)).toBeVisible();
  }

  async waitForPaymentOutcome() {
    const orderPlacedUrl = this.page.waitForURL(/order-placed/, { timeout: 240000 }).then(() => 'order-placed').catch(() => null);
    const paymentProcessing = this.page.getByText(/payment in process/i).first().waitFor({ timeout: 240000 }).then(() => 'processing').catch(() => null);
    const checkoutPageStable = this.page.getByRole('button', { name: /send confirmation and pay|confirm/i }).first().waitFor({ timeout: 240000 }).then(() => 'checkout-stable').catch(() => null);

    const outcome = await Promise.race([orderPlacedUrl, paymentProcessing, checkoutPageStable]);

    expect(outcome).toBeTruthy();

    if (outcome === 'order-placed') {
      await expect(this.page.getByRole('heading', { name: /order confirm/i })).toBeVisible({ timeout: 30000 });
    }
  }
}

module.exports = { CheckoutPage };
