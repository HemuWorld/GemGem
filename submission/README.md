# README.md

This submission demonstrates ownership of test strategy, execution, and defect communication for the staging storefront release.

## Submission Guide
- Strategy: `submission/TEST_STRATEGY.md`
- Test coverage: `submission/TEST_CASES.md`
- Exploratory findings: `submission/EXPLORATORY_NOTES.md`
- Confirmed defects: `submission/BUGS.md`
- Network proof and UI-API traceability: `submission/EVIDENCE.md`
- Execution output summary: `submission/RUN_RESULTS.md`

## Prerequisites
- Node.js 18+ and npm
- Chromium installed (Playwright)
- Access to staging environment

## Setup
Run from `automation/`:

`npm install`

## Execute Tests
Run from `automation/`:

- UI full suite: `npm run test:ui`
- UI catalog smoke: `npm run test:ui:catalog`
- API full suite: `npm run test:api`

## Environment Variables
Create `.env` in `automation/` using `automation/.env.example` as the template.

Required:
- `BASE_URL`

Optional overrides:
- `API_BASE_URL`
- Checkout data fields (`CHECKOUT_*`)
- Stripe test card fields (`STRIPE_CARD_*`)

If optional values are not set, safe defaults in code are used.

## Deterministic Controls
- Product discovery uses deterministic search fallback.
- Minimum result threshold is enforced before product selection.
- Checkout flow starts with clean cookies for stable session behavior.
- Cart hygiene: cookie/session reset is used as a safe cleanup baseline before checkout flow; no destructive server-side cart cleanup is performed.

## Reports and Artifacts
- HTML report: `automation/reports/html/index.html`
- Runtime artifacts: `automation/test-results/`
- Traces, screenshots, and videos are enabled via Playwright configuration.

## Automation Architecture
- Page Objects: `automation/pages/`
- API services: `automation/services/`
- UI tests: `automation/tests/ui/`
- API tests: `automation/tests/api/`
