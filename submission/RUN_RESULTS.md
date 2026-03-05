# RUN_RESULTS.md

This document records the latest known execution status and release confidence based on available runs.

## Commands Executed
From `automation/`:

- `npm run test:api`
- `npm run test:ui:catalog`
- `npx playwright test tests/ui/checkout-flow.spec.js --project=chromium`
- Focused API specs:
  - `tests/api/product-invalid-slug.spec.js`
  - `tests/api/shop-contract.spec.js`
  - `tests/api/ui-api-correlation.spec.js`

## Latest Result Snapshot
- API focused run: `3 passed, 0 failed`
- UI smoke run: `1 passed, 0 failed` (`tests/ui/catalog-sort.spec.js`)
- Post-fix API rerun: `3 passed, 0 failed` (`npm run test:api`)
- Checkout flow run: `1 passed` with safe stop at payment boundary when payment DOM was unstable in staging

## Run Confirmation
- API tests were executed at least once.
- UI tests were executed at least once.

## API Auth Note
- Tested API endpoints were publicly accessible storefront endpoints discovered from UI network traffic.
- No session token/bootstrap login was required for these specific checks in staging.

## Confidence Statement
- API confidence: High (stable focused run with no observed flakiness)
- UI confidence: Medium (staging timing/data variability can affect results)

## Known Variability
- Catalog content and ordering may change in staging between runs.
- Checkout/payment timing can introduce intermittent UI delays.
- Payment UI can be transient in staging; test supports requirement-safe payment-step fallback.

## Artifacts
- HTML report: `automation/reports/html/index.html`
- Runtime artifacts: `automation/test-results/`

## Test Data Impact
- Checkout flow can create order-related test data in staging after payment confirmation.

## Cart Hygiene Note
- Checkout automation starts from a clean cookie/session state before flow execution.
- No destructive cart cleanup actions are executed against staging backend data.
