# Practical Technical Assessment

## 1) Timebox & Submission

- **Timebox:** Maximum 3 hours. Stop when time is up and document what you'd do next.
- **Submission:** Public or shared-access Git repo link
- **Language/Tools:** Your choice (JS/TS preferred, Python/Java acceptable)
- **UI automation:** Playwright preferred (Cypress/Selenium acceptable)
- **Runs locally:** Automation must run locally with clear commands in the README.

## 2) Environment

Use STAGING for all work.

- **STAGING base URL:** https://mp2-frontend-staging.jewelprotech.com/en/
- **Target browser:** Chromium required (cross-browser optional if time permits)

## 3) Accounts & Test Data Rules

- You may register your own test user in staging.
- Do not use real personal data (names/addresses/cards). Use placeholder-safe values.
- Avoid modifying the profile/address unless required by the journey.
- **Cart hygiene:** If your tests touch cart data, your automation must ensure a clean starting state (empty cart) or include a safe cleanup step and document it.
- **No secrets in submission:** Do not include credentials, full tokens, or sensitive values in code, logs, screenshots, or traces. Use environment variables and redact where needed.

## 4) Safety Rules

- This is a confidential environment.
- **No destructive/intrusive testing:** no brute force, crawling/scraping, scanners, or high-load testing.
- No real payments. No real cards.
- Checkout uses Stripe test mode in staging. Use Stripe test cards only.
- If you find a severe issue, document it clearly, but do not exploit it.

## 5) Scope: Journeys (2 total)

You will cover two UI journeys total:

### Journey 1 (Mandatory): Product Discovery (E2E)

Must include:

- Search for items
- Apply filter and/or sort
- Open product detail page (PDP)
- Validate at least one key UI behaviour (e.g., images, variants/options, price update, availability UI)

### Journey 2 (Choose 1): Add to Cart + Checkout (Stripe test mode only)

Must include:

- Add product to cart
- Proceed through checkout
- Attempt Stripe test payment using Stripe test card numbers
- If the test payment cannot be completed safely, stop at the payment step and validate:
  - payment-related UI handling, and
  - payment-related network calls (redacted) as evidence

**Important:** Both Journey 1 and your chosen Journey 2 must be represented in your UI automation (not only manual notes).

## 6) Determinism Requirement (Dynamic Catalogue)

The catalogue is dynamic, but your tests must be repeatable.

Your UI tests must implement a deterministic selection strategy, such as:

- Use a search term that yields results and enforce min results ≥ N (you choose N and document it)
- If results are empty, automatically try at least one fallback term and log which term was used
- Apply a stable sort (e.g., price low → high) before selecting an item
- Choose the first deterministic item (e.g., first visible result after sort/filter)
- Assert stable properties (avoid hardcoding product names)

If your deterministic approach fails due to environmental limitations, document:

- What failed
- What fallback did you attempt?
- What you would do next.

## 7) Required Deliverables (Lean, in submission/ )

Create a folder named `submission/` containing:

### A) TEST_STRATEGY.md (max 1 page)

Include:

- Scope + assumptions
- Top 3 risks (business/technical) and how you'd cover them
- Determinism strategy (selection rule, fallbacks, cleanup, stable assertions)
- Define "smoke" vs "regression" (1–2 bullets each)

### B) TEST_CASES.md (minimum 10 test cases)

Include at least 10 test cases with:

- Preconditions
- Steps
- Expected result
- Priority (P0/P1/P2)
- Type (Functional / Negative / Edge / UX)

### C) EXPLORATORY_NOTES.md (minimum 3 charters)

For each charter:

- Goal
- What you tried (include at least one: slow, empty, invalid, permission-like check)
- Findings / risks / follow-ups

### D) BUGS.md (minimum 2)

Provide 2 bugs OR findings (bug, UX issue, testability gap, observability gap). Each must include:

- Title + severity + priority
- Environment (browser/OS/URL)
- Steps to reproduce
- Expected vs actual
- Evidence (screenshot/log snippet)
- Impact/risk and recommendation (1–2 lines)

Do not invent bugs. If the product is solid, write findings as testability/observability gaps with clear impact.

### E) EVIDENCE.md (DevTools proof)

Include screenshots showing:

- Network → Fetch/XHR for at least one key request from your flow
  - show expected status code (200/201/204/304 etc.)
  - show relevant payload/preview
  - redact sensitive tokens
- Console screenshot (note third-party warnings; focus on unhandled errors impacting flow)
- 4–6 bullets explaining how you mapped UI action → API call
- If Journey 2 includes checkout: include one payment-related request screenshot (redacted)

### F) README.md (How to Run)

Must include:

- Prereqs + install
- How to run UI tests
- How to run API tests
- Environment variables required (if any) + .env.example if used
- Notes on determinism/cleanup
- Where reports/artifacts are generated

### G) RUN_RESULTS.md

Include:

- Exact commands run
- Confirmation you ran tests at least once (twice is a bonus)
- Any flakiness observed
- Location of reports/artifacts
- Any data changes made (and how to revert), if applicable

## 8) Automation Requirements

Create an `automation/` folder with UI + API tests.

### 8.1 UI Automation (minimum 3 tests)

**Requirements:**

- Prefer stable locators (data-testid if present; avoid brittle CSS/layout selectors)
- No fixed sleeps unless strongly justified (prefer event/locator waits)
- Clear, outcome-based assertions
- Tests are order-independent and repeatable
- Capture artifacts on failure (screenshot and/or trace/video if supported)
- Your UI suite must collectively cover:
  - Journey 1 (Product Discovery)
  - Journey 2 (Add to Cart + Checkout up to a safe stopping point if needed)

### 8.2 API Automation (minimum 3 tests)

Must include:

- 1 negative test (unauthorized / invalid params / invalid quantity / etc.)
- 1 contract check (required fields + type checks, include at least one nested structure if present)
- 1 test correlated to a UI behavior
- Discover the endpoint in DevTools Network during a UI flow and validate it via API test

### API Authentication (No Manual Token Copy/Paste)

Authenticate API tests using one of:

- Reuse the authenticated browser session from UI login (cookies / storage state), or
- Programmatic login in API setup (if a login endpoint is discoverable)

Manual token copy/paste is not required and not expected.

If API auth is not feasible in this environment, document why and still provide:

- at least 1 unauthorized negative test, plus
- 2 meaningful tests against accessible endpoints.

## 9) Reporting Requirement

Automation must generate at least one:

- JUnit XML, or
- HTML report (Playwright report is fine)

On failures, include artifacts (screenshot/trace/video if supported).

## 10) Stop Condition (Important)

If you run out of time:

- Ensure README.md + RUN_RESULTS.md are complete
- List what you would do next (extra tests, refactors, CI, coverage, risks)

## 11) Evaluation (100 points)

- **Strategy + risk ownership:** 20
- **Manual cases + exploratory quality:** 20
- **UI automation quality (stability/assertions/structure):** 30
- **API automation depth (negative/contract/UI correlation):** 20
- **DevTools evidence clarity:** 10

### Auto-fail

- Missing required files in submission/
- UI tests < 3 or API tests < 3
- Missing negative API test or missing UI↔API correlation test
- Automation not runnable from README
