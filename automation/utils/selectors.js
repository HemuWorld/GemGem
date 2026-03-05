module.exports = {
  common: {
    searchInput: [
      'input[type="search"]',
      'input[name*="search" i]',
      'input[placeholder*="search" i]',
      'input[aria-label*="search" i]'
    ],
    productCard: [
      '[data-testid*="product" i]',
      '[class*="product-card" i]',
      '[class*="product-item" i]',
      'article:has(a[href*="/products" i])',
      'li:has(a[href*="/products" i])'
    ],
    productLink: [
      'a[href*="/products/" i]',
      'a[href*="/product/" i]',
      '[data-testid*="product" i] a[href]'
    ],
    sortSelect: [
      'select[name*="sort" i]',
      'select[id*="sort" i]',
      '[data-testid*="sort" i] select',
      '[data-testid*="sort" i]'
    ],
    filterControl: [
      'button:has-text("Filter")',
      'button:has-text("Filters")',
      '[data-testid*="filter" i]'
    ],
    priceElement: [
      '[data-testid*="price" i]',
      '[class*="price" i]',
      'text=/₹|\$|€|£/'
    ],
    thumbnailImage: [
      '[data-testid*="thumbnail" i]',
      '[class*="thumbnail" i] img',
      'button img'
    ],
    mainImage: [
      '[data-testid*="gallery" i] img',
      '[class*="product" i] img',
      'main img'
    ],
    variantOption: [
      '[data-testid*="variant" i] button',
      '[data-testid*="option" i] button',
      'button[role="radio"]',
      'label:has(input[type="radio"])'
    ]
  }
};
