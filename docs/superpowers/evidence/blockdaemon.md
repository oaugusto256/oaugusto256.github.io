# Blockdaemon — evidence

**Status:** DRAFT — awaiting owner approval (rows ☐ until ticked).
**Collected:** 2026-11-23 by Claude from the owner's résumé (Google Doc "otavio-resume", Blockdaemon sections), the old site's `assets/data/professional-projects.json` (on `master`), the owner's interview answers below, and two screenshots captured by Claude from app.blockdaemon.com in the owner's own workspace (owner request, 2026-11-23).

Rule: every number on the Blockdaemon case study must appear in the "Approved numbers" table below. `scripts/verify-dist.mjs` enforces it. Bundle wording: "more than 80%" (PT "mais de 80%") only — never the exact before/after sizes.

## Approved numbers

| # | Value | Claim | Source | Approved |
|---|---|---|---|---|
| 1 | more than 80% (PT: mais de 80%) | cut the JavaScript entry bundle | Résumé (Senior): "cut the JavaScript entry bundle by more than 80% through route-level code splitting, dynamic imports, and prefetch strategies" | ☐ |
| 2 | 6, 8 | design system upgrade from Mantine v6 to v8 | Résumé (Senior): "design system upgrade from Mantine v6 to v8"; old JSON "built on Mantine 8" | ☐ |
| 3 | two months → under one month (written in words) | Mantine upgrade estimated at about two months, delivered in under a month, before AI coding tools were part of the workflow | Owner interview Q3 (2026-11-23) | ☐ |
| 4 | 17, 19 | React 17 to 19 migration | Résumé (Senior): "frontend modernization from React 17 to 19" | ☐ |
| 5 | three + three (written in words) | team of about three front-end and three back-end engineers | Owner interview Q2 | ☐ |
| 6 | 2021, 2026 | tenure July 2021 – April 2026 | Résumé: Front-end Engineer July 2021 – March 2024; Senior Front-end Engineer March 2024 – April 2026 | ☐ |
| 7 | 2024 | promotion to Senior Front-end Engineer (March 2024) | Résumé | ☐ |

Numbers visible inside the screenshots (plan prices, quotas, dates in the owner's workspace) are Blockdaemon's public UI, not claims in the copy.

## Facts (non-numeric)

**Product.** app.blockdaemon.com: institutional interface to manage, monitor and deploy blockchain infrastructure — node operations, staking, API management. Includes Stripe checkout, wallet integrations (WalletConnect, MetaMask), KYB via Sumsub, feature toggles, admin dashboard. Stack: React, TypeScript, Okta, React Query, Mantine. (old JSON)

**Front-end Engineer, July 2021 – March 2024.** (résumé)
- Led end-to-end creation of checkout and subscription flows (nodes and API Suite): plan management, invoicing, admin overrides.
- Built staking protocol dashboards (graphs, filters, modals) over real-time data.
- Designed a dynamic form builder for staking API access from JSON schemas.
- Revamped onboarding via Okta; integrated Contentful for content-driven pages.
- Playwright and Cypress integration tests for mission-critical journeys.

**Senior Front-end Engineer, March 2024 – April 2026.** (résumé)
- Architected UI for new core products; modernized legacy front-end.
- Technical interviews; mentored junior and mid-level engineers.
- Web performance initiative on a large React SPA: entry bundle cut by more than 80% (route-level code splitting, dynamic imports, prefetch).
- Led the design system upgrade from Mantine v6 to v8 with minimal breaking changes, plus standardized documentation (components, usage patterns, live examples).
- React 17 → 19 modernization.
- Led a new Portfolio product (wallet integration, on-chain asset verification, earnings visibility).

**Design system.** Built on Mantine 8 with a new visual identity from an external design agency; theming, component overrides, design tokens, dark/light themes, documentation (Storybook); used across Blockdaemon web products. (old JSON)

**Screenshots.** `src/assets/work/blockdaemon/checkout.jpg` (API Suite → Configure Your Subscription; the case-study cover, owner request 2026-11-23) and `api-keys.jpg` (API Suite → Authentication; key value masked by the app). Captured 2026-11-23 from the owner's workspace, cursor cropped out. The bundle diagram (`bundle-split.svg`) sits in the Approach section.

## Owner answers (2026-11-23)

1. Trigger and measurement: noticed the main-thread JavaScript wasn't optimized while debugging; measured with Lighthouse and Chrome's built-in DevTools.
2. Team: around 3 front-end and 3 back-end engineers. Lead with checkout/subscriptions and the Mantine v6 → v8 design system.
3. Mantine upgrade: mention it was before AI tooling; expected around 2 months, done in under 1 month.
4. Naming Stripe, Okta, Contentful, WalletConnect, MetaMask, Sumsub: yes.
5. Screenshots: Claude captures the API keys and subscription checkout pages from app.blockdaemon.com.
