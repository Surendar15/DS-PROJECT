# Live Session Feature Extraction & Mapping Methodology

## Overview
This document outlines the scientific methodology for capturing real-time user browsing behavior on the React e-commerce website and translating live interaction metrics into the 17 raw features expected by the trained Scikit-learn Random Forest model pipeline (`ml/models/full_pipeline.pkl`).

---

## 1. Direct Behavioral Features (Observed Web Interactions)

The following 6 features are captured directly from real-time client-side page navigation and time accumulation:

| Feature Name | Route Classification | Metric Source | Calculation Method |
| :--- | :--- | :--- | :--- |
| **`Administrative`** | `/cart`, `/checkout`, `/account` | `SessionContext.adminViews` | Incremented on navigation to admin routes |
| **`Administrative_Duration`** | `/cart`, `/checkout`, `/account` | `SessionContext.adminDuration` | Active elapsed seconds accumulated via 1s interval |
| **`Informational`** | `/about`, `/faq`, `/shipping`, `/contact` | `SessionContext.infoViews` | Incremented on navigation to info routes |
| **`Informational_Duration`** | `/about`, `/faq`, `/shipping`, `/contact` | `SessionContext.infoDuration` | Active elapsed seconds accumulated via 1s interval |
| **`ProductRelated`** | `/`, `/products`, `/product/:id` | `SessionContext.productViews` | Incremented on product grid & detail views |
| **`ProductRelated_Duration`** | `/`, `/products`, `/product/:id` | `SessionContext.productDuration` | Active elapsed seconds accumulated via 1s interval |

---

## 2. Derived Application Proxies (Behavioral Models)

Because live single-page web applications lack full historical Google Analytics tracking logs, the following 3 features are computed via transparent application-level proxy formulas:

### A. `PageValues` (Application-Level Proxy Formula)
- **Dataset Meaning**: Google Analytics metric measuring average value of web pages visited prior to transaction completion.
- **Application Proxy Formula**:
  $$\text{PageValues} = \left( \frac{\text{Cart Subtotal}}{\text{Total Pages Viewed}} \right) + (\text{Cart Item Count} \times 5.0) + (\text{Checkout Intent} \times 10.0)$$
- **Justification**: Higher cart values and active checkout intent naturally elevate page value, aligning with empirical EDA findings ($r = +0.4926$).

### B. `BounceRates` (Single-Page Session Approximation)
- **Application Formula**:
  $$\text{BounceRates} = \begin{cases} 0.20 & \text{if } \text{Total Pages} \le 1 \\ \min\left(1.0, \frac{0.02}{\text{Total Pages}}\right) & \text{if } \text{Total Pages} > 1 \end{cases}$$
- **Justification**: Single-page visits reflect high bounce likelihood ($0.20$), whereas deep browsing sessions quickly drop toward zero.

### C. `ExitRates` (Session Exit Tendency)
- **Application Formula**:
  $$\text{ExitRates} = \min\left(1.0, \frac{\text{Exit Actions}}{\text{Total Pages Viewed}}\right)$$
- **Justification**: Measures relative proportion of session drop-offs or tab closes.

---

## 3. Environment & Temporal Features

The following 4 features are derived from system and browser environment context:

- **`Month`**: Derived dynamically from `new Date().getMonth()`, mapped to valid dataset month string categories (`Feb`, `Mar`, `May`, `June`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`).
- **`Weekend`**: Derived from `new Date().getDay()` (`true` for Saturday/Sunday, `false` otherwise).
- **`OperatingSystems`**: Derived from `navigator.userAgent` string:
  - `2`: Windows OS
  - `1`: Mac / iOS
  - `3`: Android
  - `4`: Linux / Other
- **`Browser`**: Derived from `navigator.userAgent` string:
  - `2`: Chrome / Chromium
  - `1`: Safari
  - `3`: Firefox
  - `4`: Edge

---

## 4. Controlled Demo Fallbacks & Limitations

The following 3 features use controlled research defaults for demo purposes:

- **`Region`**: Configured default `1` (Standard demo geographic region).
- **`TrafficType`**: Mapped dynamically based on acquisition context (`2` for internal search query sessions, `1` for direct traffic).
- **`SpecialDay`**: Controlled default `0.0` (standard non-holiday business day).
- **`VisitorType`**: Mapped to `'New_Visitor'` for initial browser sessions and `'Returning_Visitor'` when session markers exist in localStorage.

---

## 5. Summary of Assumptions & Limitations
1. Live website measurements use application-level proxy formulas for `PageValues`, `BounceRates`, and `ExitRates` because Google Analytics server logs are unavailable in a standalone React application.
2. `Region` and `SpecialDay` rely on controlled demo fallbacks to avoid requesting intrusive location permissions or assuming regional calendar holidays.
