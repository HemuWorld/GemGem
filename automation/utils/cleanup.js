async function ensureCleanCart(page) {
  await page.goto('/');
}

module.exports = {
  ensureCleanCart
};
