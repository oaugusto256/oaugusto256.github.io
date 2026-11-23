# Mercado Envios — evidence

**Status:** DRAFT — awaiting owner approval (rows ☐ until ticked).
**Collected:** 2026-11-23 by Claude from the owner's résumé (Google Doc "otavio-resume", Mercado Livre Brasil section), the old site's `assets/data/professional-projects.json` (on `master`, product context only) and the owner's interview answers below.

Rule: every number on the Mercado Envios case study must appear in the "Approved numbers" table below. `scripts/verify-dist.mjs` enforces it. No company-wide outcomes. "Millions of transactions" (old JSON) is not evidence and must not appear.

## Approved numbers

| # | Value | Claim | Source | Approved |
|---|---|---|---|---|
| 1 | 450+ (PT: mais de 450) | contributed to production releases across micro-frontend applications | Résumé: "contributing to 450+ production releases across high-availability micro-frontend applications" | ☐ |
| 2 | 2020, 2021 | tenure September 2020 – July 2021 | Résumé: Mercado Livre Brasil, September 2020 – July 2021 | ☐ |
| 3 | three + one + one (written in words) | team of three engineers, a tech lead and a manager | Owner interview Q5 (2026-11-23) | ☐ |

## Facts (non-numeric)

- Résumé: designed and implemented BFF services and documented data flows via RFCs, contributing to 450+ production releases across high-availability micro-frontend applications.
- Old JSON (context only): UI for Mercury, Mercado Libre's own warehouse management system (WMS) for fulfillment centers, cross-docking hubs and last-mile logistics across Latin America; interfaces for logistics operators (inbound/outbound, inventory). Stack: React, TypeScript, internal design system.
- Owner: built the page for sorting landing packages in the WMS, used across LATAM; helped create the BFF behind it; the RFC documented the same flow.

## Owner answers (2026-11-23)

1. Naming "Mercury" WMS: yes.
2. Operator flows: built the "sort the landing packages" page of the WMS, for LATAM.
3. BFF: helped create the BFF for that landing-packages page.
4. RFC topic: the same (landing packages).
5. Team: 3 engineers, 1 tech lead, 1 manager.
