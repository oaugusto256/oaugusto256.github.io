# Terral.surf — evidence

**Status:** DRAFT — awaiting owner approval. Nothing here goes into page copy until the owner approves it.
**Collected:** 2026-11-22 by Claude, read-only, from the `terral-app` repository (local clone, `main` @ `10a6a0d`, last commit 2026-11-17) and the public site https://terral.surf.

Rule: every number on the Terral case study must appear in the "Approved numbers" table below. `scripts/verify-dist.mjs` enforces it.

## Approved numbers

| # | Value | Claim | Source | Approved |
|---|---|---|---|---|
| 1 | 42 | beaches and peaks ranked on every forecast hour | `packages/core/src/data/beaches.ts`: 56 entries − 10 parent beaches (split into peaks) − 4 hidden (`HIDDEN_BEACH_IDS`); same filter as `useRankedBeaches` | ☐ |
| 2 | 72 | hours of forecast (time slider, per-beach charts, best-window finder) | `README.md` "What it does today" | ☐ |
| 3 | 0–100 | score range per beach, with a visible breakdown of each factor | `README.md`; `docs/architecture.md` ("Every factor returned by `scoreBeach` is shown in the UI") | ☐ |
| 4 | 3 | top beach + time windows surfaced by the best-window finder | `README.md` | ☐ |
| 5 | 05:30–18:30 | daylight hours scanned by the best-window finder | `README.md` | ☐ |
| 6 | 2 | languages (EN, PT-BR) | `README.md`, `docs/i18n.md` | ☐ |
| 7 | 3 | workspaces in the monorepo (`apps/web`, `apps/api`, `packages/core`) | `README.md` | ☐ |
| 8 | 306 | commits on `main` | `git rev-list --count HEAD` @ `10a6a0d` | ☐ |
| 9 | 16 | product phases shipped before launch hardening (Phase 17) | `README.md`, `PLAN.md` | ☐ |
| 10 | 1.32.0 | current web app version (Release Please) | `apps/web/package.json` | ☐ |
| 11 | 6 | cron schedulers in the API | `docs/architecture/diagrams.md` (L2) | ☐ |

Usage analytics (visitors, sessions, top beaches, returning share): **not collected yet.** Terral's PostHog is US Cloud project 403079 (`docs/superpowers/specs/2026-11-16-onboarding-v2-design.md`); the PostHog MCP in this session is connected to a different EU organization and cannot reach it. Section stays empty until access is granted and the owner approves the figures.

## Facts (non-numeric)

**Problem.** Florianópolis surfers decide every morning which beach to surf by cross-referencing Surfguru, Windy and local knowledge. Terral productizes that judgment: "Given today's swell direction, wind direction, and tide — where should I go?" (`README.md`)

**Product.**
- Ranks every beach against current or forecast conditions and explains the score (e.g. "✓ SE swell at 12s, ✓ Terral 15 km/h"). (`README.md`)
- Classifies wind per beach orientation as terral (offshore), maral (onshore) or cruzado (cross). (`README.md`)
- 3D map (MapLibre GL + MapTiler terrain) with color-coded pins and map lenses (overall, wind, swell). (`README.md`)
- Time slider, per-beach forecast charts, best-window finder, tide chart, live METAR wind from SBFL airport. (`README.md`)
- Personalization: skill level, preferred break types, home neighborhood, favorites. (`README.md`)
- Installable PWA; web push alerts; weekly digest email; offline forecast cache (IndexedDB, 6 h). (`docs/architecture/diagrams.md`, `docs/architecture.md`)
- Live in beta at terral.surf. (`README.md`)

**Architecture.**
- pnpm monorepo. `@terral/core`: framework-agnostic, pure scoring engine (`scoreBeach`), generated beach data, geo math, shared types; consumed by both apps so app ranking and server-side push scoring share one source of truth. (`README.md`, `CLAUDE.md`)
- Beach data authored as CSV (`docs/surf-engine/beaches.csv`) and generated into TypeScript. (`README.md`)
- `apps/web`: React 19, Vite, TypeScript strict, TanStack Query (server state), Zustand (client state), Tailwind CSS v4, Vitest + React Testing Library. (`README.md`)
- `apps/api`: Hono on Node 20, better-sqlite3, node-cron, web-push, satori (OG images), react-email + Resend. (`CLAUDE.md`)
- One forecast endpoint (`GET /api/forecast`) returns wave hours, island weather and per-beach wind; responses zod-parsed at the boundary. (`docs/architecture.md`, `docs/data-sources.md`)
- Wave data: Stormglass primary (rate-guarded daily quota, cached), Open-Meteo Marine automatic fallback; wind/weather from Open-Meteo Forecast; NOAA WW3 spectral data; offline tide prediction bundled (no network/key). Paid keys never reach the client. (`README.md`, `docs/architecture/diagrams.md`, `CLAUDE.md`)
- Hourly archive of forecast hours in SQLite so past hours stay scorable. (`docs/data-sources.md`)

**Delivery.**
- Docker Compose on a VPS (web: nginx + static bundle; api: Node), reverse proxy with TLS. (`README.md`, `docs/architecture/diagrams.md`)
- GitHub Actions: test, typecheck, lint, bundle guard → images to GHCR → SSH deploy (`docker compose pull && up`); Release Please versioning. (`docs/architecture/diagrams.md`)
- Observability: Sentry (errors), PostHog (product analytics). (`docs/architecture/diagrams.md`)

**Process.** Spec → plan → agent-executed implementation, with specs/plans in `docs/superpowers/` and repo-level agent rules (`CLAUDE.md`). (`CLAUDE.md`)

## Open questions for the owner

1. Role wording: "Independent product — product, design and engineering". Accurate? Anyone else involved?
2. Start date: repo history begins 2026-10-14. Did work start earlier (e.g. another repo)?
3. OK to mention Stormglass, Open-Meteo, NOAA, MapTiler by name?
4. Want any of the commit/phase/version numbers (rows 8–10) on the page, or leave them out?
5. The live onboarding says "50+ praias"; the beach model has 56 entries, 42 of them ranked (parents split into peaks, 4 hidden). Which number should the case study use?
