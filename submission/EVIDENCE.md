
# EVIDENCE.md

This document maps each key user action to the exact network evidence captured during validation.

## Environment
- OS: Windows 11
- Browser: Google Chrome
- Application URL: https://mp2-frontend-staging.jewelprotech.com/en/
- DevTools Used: Chrome DevTools -> Network (Fetch/XHR)

---

## Quick Overview

| Step | User Action | API Endpoint | Expected Status | Evidence |
|------|-------------|--------------|-----------------|----------|
| 1 | Search product | `GET /api/v1/c2c/shop` | 200 OK | `evidence/Search.txt` |
| 2 | Open product details | `GET /api/v1/c2c/product/{slug}` | 200 OK | `evidence/Product Details.txt` |
| 3A | Add to Cart - promotions check | `GET /api/v1/promotion/getActivePromotions` | 200 OK | `evidence/Promotions Offers.txt` |
| 3B | Add to Cart - cart update | `POST /api/v1/shopping-cart/update-fetch` | 200 OK | `evidence/Add To Cart.txt` |
| 4 | Send Confirmation and Pay | `POST https://api.stripe.com/v1/tokens` | 200 OK | `evidence/Strip Payment.txt` |

---

## Screenshot Evidence

- Network Fetch/XHR screenshots: `evidence/BUGS_1-1.png`, `evidence/BUGS_1-2.png`, `evidence/BUGS_1-3.png`
- Console capture screenshot: `evidence/BUGS_1-4.png`
- Payment-related request screenshot: `evidence/BUGS_1-5.png`

Sensitive values are redacted in captured evidence.

---

## End-to-End User Flow

1. User searches for a product.
2. User selects a product to open Product Detail Page (PDP).
3. User clicks Add to Cart, which triggers promotions check and cart update.
4. User proceeds to checkout and clicks Send Confirmation and Pay.
5. Stripe token API is called for secure payment tokenization.

## UI Action to API Mapping (Traceability)

- Search submit on homepage -> `GET /api/v1/c2c/shop` (`evidence/Search.txt`)
- Product card click on listing -> `GET /api/v1/c2c/product/{slug}` (`evidence/Product Details.txt`)
- Add to Cart action on PDP -> `GET /api/v1/promotion/getActivePromotions` (`evidence/Promotions Offers.txt`)
- Add to Cart confirmation flow -> `POST /api/v1/shopping-cart/update-fetch` (`evidence/Add To Cart.txt`)
- Send Confirmation and Pay -> `POST https://api.stripe.com/v1/tokens` (`evidence/Strip Payment.txt`)

---

## 1. Search

### UI Action
User searches for a product from the storefront search bar.

### Network Request
GET `/api/v1/c2c/shop?search=<keyword>&page=1&limit=40&lang=en`

### Status
200 OK

### Evidence File
`evidence/Search.txt`

### Notes
Response includes product list data (for example: id, name, slug, image, and price fields).

---

## 2. Product Details (After Product Selection)

### UI Action
User selects a product from listing to open Product Detail Page (PDP).

### Network Request
GET `/api/v1/c2c/product/{slug}?include=full_details&lang=en`

### Status
200 OK

### Evidence File
`evidence/Product Details.txt`

### Notes
Response includes full product detail payload used by PDP rendering.

---

## 3. Add to Cart Flow from Product Details

When user clicks **Add to Cart** on PDP, evidence is captured in two API calls:

### 3A. Promotions

- Network Request: GET `/api/v1/promotion/getActivePromotions?actorType=buyer&lang=en`
- Status: 200 OK
- Evidence File: `evidence/Promotions Offers.txt`

### 3B. Add to Cart

- Network Request: POST `/api/v1/shopping-cart/update-fetch`
- Status: 200 OK
- Evidence File: `evidence/Add To Cart.txt`

### Notes
These two calls represent the promotion lookup and cart update behavior triggered during add-to-cart flow.

---

## 4. Send Confirmation and Pay (Stripe)

### UI Action
User clicks **Send Confirmation and Pay** at checkout payment step.

### Network Request
POST `https://api.stripe.com/v1/tokens`

### Status
200 OK

### Evidence File
`evidence/Strip Payment.txt`

### Notes
Stripe token response confirms secure tokenization flow (token id and masked card details).

---

## UI Automation Reference

- Search and listing behavior: `automation/tests/ui/catalog-sort.spec.js`
- Product selection to PDP and add-to-cart/checkout flow: `automation/tests/ui/checkout-flow.spec.js`
- PDP business validations: `automation/tests/ui/pdp-business-rules.spec.js`

## Evidence Files Used

- `evidence/Search.txt`
- `evidence/Product Details.txt`
- `evidence/Promotions Offers.txt`
- `evidence/Add To Cart.txt`
- `evidence/Strip Payment.txt`
