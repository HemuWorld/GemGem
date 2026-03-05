
# BUGS.md

This document contains defects I reproduced and validated on the staging environment.

## Bug 1 - Product Page Loader Stuck When Product API Returns Error

Severity: Major
Priority: High
Status: Open

### Environment
- OS: Windows 11
- Browser: Google Chrome
- Application URL: https://mp2-frontend-staging.jewelprotech.com/en/

### Steps to Reproduce
1. Open the homepage.
2. Navigate to All Categories -> Ring.
3. Select a product that displays a default/missing product image.
4. Wait for the product details page to load.

### Expected Result
- Product detail page loads successfully.
- Loader is dismissed after API response (success or failure).
- If API fails, user sees a clear fallback/error state.

### Actual Result
- Loader remains visible indefinitely.
- Toast appears: "No query results."
- Product details are partially visible behind the loader.
- Navigating back still keeps the loader overlay active.

### Evidence
- Screenshots: `evidence/BUGS_1-1.png` to `evidence/BUGS_1-6.png`
- Product view capture: `evidence/Product View.txt`
- API response logs (HTTP 400/404): `evidence/Product.txt`

The response logs show unhandled backend error details returned to the client.

### Impact / Risk
- Blocks product evaluation and disrupts purchase journey.
- Increases abandonment risk on PDP.
- Exposes backend exception details to end users.

### Recommendation
- Ensure frontend always clears loader in both success and error branches.
- Return sanitized backend errors (no exception internals in client responses).
- Add fallback UI for missing product data/image cases.

---

## Bug 2 - Product Count Mismatch Between Homepage Category and Category Listing Page

Severity: Medium
Priority: Medium
Status: Open

### Environment
- OS: Windows 11
- Browser: Google Chrome
- Application URL: https://mp2-frontend-staging.jewelprotech.com/en/

### Steps to Reproduce
1. Open the homepage.
2. Scroll to Explore by Categories.
3. Observe the product count displayed on a category card (for example, Ring - 483 items).
4. Click on the Ring category.
5. Observe the total result count displayed on the category listing page.

### Expected Result
The category count on the homepage card should match the count shown on the category listing page.

### Actual Result
- Homepage shows: Ring - 483 items
- Category listing page shows: 978 Result Available

Counts are inconsistent between pages.

### Evidence
- Screenshots: `evidence/BUGS_1-7.png` and `evidence/BUGS_1-8.png`
- Homepage category card shows: 483 items
- Category listing page shows: 978 results available

### Impact / Risk
- Reduces trust in catalog accuracy.
- Suggests inconsistent count logic, stale cache, or mismatched data source.

### Recommendation
- Align homepage and listing counts to the same backend query and filter rules.
- Validate cache invalidation strategy for category aggregates.
