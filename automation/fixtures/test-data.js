require('dotenv').config();

function getCheckoutUser() {
  return {
    firstName: process.env.CHECKOUT_FIRST_NAME || 'QA',
    lastName: process.env.CHECKOUT_LAST_NAME || 'Tester',
    email: process.env.CHECKOUT_EMAIL || 'qa.tester+gemgem@example.com',
    phone: process.env.CHECKOUT_PHONE || '5550101234',
    zipCode: process.env.CHECKOUT_ZIP || '10001',
    state: process.env.CHECKOUT_STATE || 'Test State',
    city: process.env.CHECKOUT_CITY || 'Test City',
    address: process.env.CHECKOUT_ADDRESS || '123 Test Street, Suite 1'
  };
}

function getStripeCard() {
  return {
    number: process.env.STRIPE_CARD_NUMBER || '4242424242424242',
    expiry: process.env.STRIPE_CARD_EXPIRY || '10 / 35',
    cvc: process.env.STRIPE_CARD_CVC || '123'
  };
}

module.exports = {
  getCheckoutUser,
  getStripeCard
};
