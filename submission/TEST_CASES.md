
# TEST_CASES.md

This test suite reflects the core scenarios I used to validate storefront behavior, with clear mapping to existing automation.

## Scope
Focused test coverage for critical storefront flows and known risk areas.

Type values in this document are restricted to the required set: `Functional`, `Negative`, `Edge`, `UX`.

## Environment
- OS: Windows 11
- Browser: Google Chrome
- Base URL: https://mp2-frontend-staging.jewelprotech.com/en/

## Core Test Cases (Execution Focus)

| ID | Scenario | Preconditions | Steps | Expected Result | Priority | Type | Execution | Automation Mapping |
|----|----------|---------------|-------|-----------------|----------|------|-----------|--------------------|
| TC-01 | Search with valid keyword from homepage | User is on homepage | Enter a valid keyword and submit search. | User is redirected to listing page with relevant results. | P0 | Functional | Automated | `automation/tests/ui/catalog-sort.spec.js` |
| TC-02 | Sort products by Price: High to Low | Listing page has visible products | Open Sort By and select Price: High to Low. | Visible product prices are in descending order. | P0 | Functional | Automated | `automation/tests/ui/catalog-sort.spec.js` |
| TC-03 | Open valid product detail page from listing | Listing page has at least one valid in-stock product | Click a valid product card from listing. | Product page opens successfully for selected product. | P0 | Functional | Automated | `automation/tests/ui/checkout-flow.spec.js` |
| TC-04 | Add valid product to cart from PDP | User is on a valid PDP with Add to Cart available | Click Add to Cart. | Product is added to cart and confirmation feedback is shown. | P0 | Functional | Automated | `automation/tests/ui/checkout-flow.spec.js` |
| TC-05 | Complete checkout flow (safe payment fallback) | Product is in cart and checkout is accessible | Proceed through checkout; if payment is stable, attempt Stripe test payment, otherwise stop safely at payment step and validate payment UI availability. | User reaches order confirmation or a validated payment-step safe stop state. | P0 | Functional | Automated | `automation/tests/ui/checkout-flow.spec.js` |
| TC-06 | Validate PLP to PDP data consistency (name/price/tags) | Listing page and PDP are accessible | Capture PLP values, open PDP, compare values. | PDP details match selected PLP item data. | P1 | Functional | Automated | `automation/tests/ui/pdp-business-rules.spec.js` |
| TC-07 | Validate sold-out behavior on PDP | Product under test can be sold out | Open PDP for sold-out item and check CTA state. | Add to Cart is hidden when item is sold out. | P1 | Functional | Automated | `automation/tests/ui/pdp-business-rules.spec.js` |
| TC-08 | Validate discount calculation consistency | Discounted item is available | Capture discount indicator and compare with displayed prices. | Displayed discount percentage matches calculated value. | P1 | Edge | Automated | `automation/tests/ui/pdp-business-rules.spec.js` |
| TC-09 | Search with whitespace-only input | User is on homepage | Enter whitespace-only input and submit. | Search should be blocked after trim, with validation prompt. | P1 | Negative | Manual (Current Gap) | Not automated yet |
| TC-10 | Rapid multi-filter interaction | User is on listing page with filters visible | Apply multiple filters rapidly without waiting between actions. | Results should not flash false "No result found" during transitions. | P1 | Edge | Manual (Current Gap) | Not automated yet |
| TC-11 | Sort switch consistency (Most Discounted -> Most Relevant) | Listing page has enough products for sort comparison | Apply Most Discounted, then switch to Most Relevant. | Data ordering matches selected sort option after each switch. | P1 | UX | Manual (Current Gap) | Not automated yet |

## Automation Utilization Summary

- UI automated specs already in use:
  - `automation/tests/ui/catalog-sort.spec.js`
  - `automation/tests/ui/checkout-flow.spec.js`
  - `automation/tests/ui/pdp-business-rules.spec.js`
- API automated specs available for backend validation:
  - `automation/tests/api/shop-contract.spec.js`
  - `automation/tests/api/product-invalid-slug.spec.js`
  - `automation/tests/api/ui-api-correlation.spec.js`

## Notes

- Known production/staging defects are tracked in `submission/BUGS.md`.
- Exploratory observations and risk rationale are tracked in `submission/EXPLORATORY_NOTES.md`.
- Evidence for key user flows and API calls is tracked in `submission/EVIDENCE.md`.
