# Portfolio Redesign — Design

**Date:** 2026-11-22
**Source spec:** `~/Downloads/portfolio-redesign-specs.md` (v1.0, 2026-11-16). This doc records the decisions made against it; where they differ, this doc wins.

## 1. Intent

Replace the HTML5 UP template site ("Senior Frontend Engineer", two pages) at `https://oaugusto256.github.io/` with a bilingual (EN/PT) **Product Engineer** portfolio. Editorial, minimal, evidence-first. The site itself should be evidence of product + engineering craft. Recruiters are served first; engineering managers and peers get depth further down each page.

## 2. Goals / non-goals / anti-goals

**Goals:** clear Product Engineer identity · three credible case studies (Terral.surf lead) · full EN and PT parity · strong perf/a11y/SEO · maintainable static site.

**Non-goals (v1):** blog/CMS, auth, backend, chatbot, 3D, terminal/OS simulations, availability badge, theme toggle.

**Anti-goals (failure even if it works):**
- Any metric, responsibility, or achievement that the owner cannot stand behind.
- Visual effects that delay or hide content; scroll hijacking; skill bars.
- Downtime or broken public URL during migration.

## 3. Current state (audit)

- Static HTML/CSS/jQuery, no build. HTML5 UP template.
- GitHub Pages: legacy build, source `master` `/`, no custom domain, HTTPS enforced.
- `projects.html` loads `assets/data/professional-projects.json` + GitHub repos API.
- Reusable: favicons/webmanifest (`assets/icons/`), project copy in `professional-projects.json`, social URLs.
- Not reused: template CSS/SCSS, Font Awesome, jQuery, layout.
- Pages serves the repo root, so anything committed to `master` is public.

## 4. Approaches considered

| Approach | Trade-off | Verdict |
|---|---|---|
| **Astro + TS, static output, built-in i18n routing** | Needs build + Actions deploy; minimal JS shipped; content collections fit case studies | **Chosen** |
| Keep hand-written static HTML | No tooling, but EN/PT duplication, no typed content, hard SEO/hreflang upkeep | Rejected |
| Client-side translation (JS swaps strings) | Breaks direct localized URLs and SEO | Rejected |
| Next.js static export | Extra runtime/complexity with no requirement needing it | Rejected |

## 5. Decisions

### 5.1 Delivery: slices

- **S1:** foundation (Astro, tokens, layouts, nav, i18n, CI, preview deploy, redirects) + Home + Terral.surf case study, EN and PT. Includes design exploration and résumé update (EN title/summary + PT version).
- **S2:** Blockdaemon case study, Mercado Envios case study, About (includes Fugro, GeekHunter, Blockdaemon Design System, earlier roles), Contact page, Work index.
- **S3:** Lab (absorbs former GitHub-repos list), experimental interactions.

**Cutover to production happens at end of S2** (owner decision). S1 lives only on the preview URL, so the live site never loses content or shows dead-end cards. S3 ships to production directly after cutover.
Pages not yet built are not linked from nav (no placeholder pages). *My call:* Lab nav item appears in S3.

### 5.2 Branching and preview

- Work on `redesign` branch. `master` (live site) untouched until cutover.
- Preview: Cloudflare Pages connected to the repo, branch deploys for `redesign`. Owner connects the account.
- Cutover: merge to `master`, switch Pages source from "branch" to "GitHub Actions" workflow, verify URLs.

### 5.3 Stack

- Astro (latest stable) + TypeScript strict, `output: 'static'`.
- Styling: Astro scoped `<style>` + global `styles/tokens.css`, `global.css`, `typography.css`. No Tailwind.
- React only via islands where interaction needs it (none required in S1).
- Icons: Lucide (inline SVG). Fonts: self-hosted (choice made in design exploration).
- Content: Astro content collections, MDX.
- CI (GitHub Actions): `astro check` (typecheck), ESLint, `astro build`, Lighthouse CI against built output. **No Playwright or unit tests in v1** (owner decision: keep tiny).

### 5.4 Routing and i18n

- Astro i18n: `locales: ['en','pt']`, `defaultLocale: 'en'`, `prefixDefaultLocale: true`.
- Routes: `/en/`, `/pt/`, `/{lang}/work/`, `/{lang}/work/{slug}/`, `/{lang}/about/`, `/{lang}/lab/`, `/{lang}/contact/`.
- `/` → static redirect to `/en/` (meta refresh + canonical; no language sniffing).
- `/projects.html` → `/en/work/` (exists by cutover).
- `hreflang` en, pt, `x-default`→en on every page. Correct `<html lang>` (`en`, `pt-BR`).
- Language switcher links to the same page in the other locale; if no twin exists, to that locale's home with a visible note.
- UI strings: `src/i18n/en.ts`, `src/i18n/pt.ts` (typed, PT must satisfy EN's keys).
- Case studies: `src/content/work/{slug}/en.mdx`, `pt.mdx`, shared typed frontmatter (title, summary, role, period, stack, links, cover, order).

### 5.5 Content and evidence rules

- Owner reviews all copy. Claude drafts EN + PT.
- Positioning: "Product Engineer". Headline/copy from spec §2.3 as starting point.
- **Terral.surf:** metrics pulled read-only from its existing PostHog project; shown to owner before use. Screenshots/diagrams: to be captured from terral.surf and produced (architecture diagram as SVG).
- **Blockdaemon:** no confidentiality restrictions per owner. Bundle work stated as "cut JS entry bundle by more than 80%" + method; exact before/after not published (inconsistent in résumé, no measurement on hand). No proprietary code or internal architecture.
- **Mercado Envios (Mercado Livre), Sep 2020 – Jul 2021:** internal warehouse tooling; BFF services, RFCs, 450+ releases across micro-frontends (from résumé). No company-wide outcomes.
- **Fugro (Jun 2026 – now):** current role on About, résumé-level detail only.
- **GeekHunter, Blockdaemon Design System:** About. Old GitHub repos: Lab (S3).
- Contact: email, LinkedIn, GitHub, résumé. Drop WhatsApp, GitLab, Stack Overflow from site.
- Résumé: EN title/summary updated to Product Engineer; bundle line aligned to ">80%"; PT version created. Phone stays on résumé (owner decision). PT pages link the PT PDF.
- Location: Florianópolis, Brazil. No availability status.

### 5.6 Analytics

- New PostHog project for the portfolio. Cookieless/memory persistence, no consent banner, no personal data.
- Events: project card click, case study view, language switch, résumé download, contact/GitHub/LinkedIn click, (S3) lab interaction.
- Project key is public by design; stored in config, not secret.

### 5.7 Design

- No existing mockups. Claude produces 2–3 homepage concepts (browser mockups) within spec §5 direction; owner picks one. Open visual calls resolved there: warm off-white vs neutral mono, accent (muted green vs deep blue), hero typographic vs photo, typeface pair.
- Light editorial base, selected charcoal surfaces, 4px spacing scale, max width ~1200–1320px, `prefers-reduced-motion` respected.

**Chosen: Concept C — "System map"** (owner, 2026-11-22). Charcoal hero band with an animated system diagram (problem → users → decision → build → ship → measure); light neutral body below; deep blue accent; typographic hero (no photo).

| Token | Hex | Contrast |
|---|---|---|
| `--color-bg` | `#EDEEEA` | — |
| `--color-text` | `#17181A` | 15.2:1 on bg |
| `--color-muted` | `#55585E` | 6.1:1 on bg |
| `--color-border` | `#CFD1CC` | decorative |
| `--color-accent` | `#2447A8` | 7.1:1 on bg |
| `--color-surface-dark` | `#202226` | — |
| `--color-on-dark` | `#E9EAE6` | 13.2:1 on surface |
| `--color-muted-dark` | `#A2A6AD` | 6.5:1 on surface |
| `--color-accent-dark` | `#8FA9F0` | 6.9:1 on surface |
| `--color-line-dark` | `#4A4E56` | decorative (diagram strokes) |

- Type: **Geist** (sans; 400, 500, 600) + **Geist Mono** (400, 500), both SIL OFL, self-hosted woff2, Latin + Latin-1 subsets.
- Scale: fluid, ~1.25 ratio; h1 `clamp(2.25rem, 5vw, 4.25rem)`, weight 500, tracking −0.035em; body 1.0625rem/1.6.
- Max width 1240px; radius 6px (buttons), 10px (media).
- Motion: one moment only — a dot travelling the diagram path; disabled under `prefers-reduced-motion`.

## 6. Quality targets

Lighthouse ≥ 90 perf, ≥ 95 a11y/best-practices/SEO on Home and Terral (mobile + desktop); exceptions documented. Semantic HTML, keyboard nav, visible focus, alt text, sitemap, robots, OG tags, canonical URLs.

## 7. Owner inputs needed

| Input | Needed by |
|---|---|
| Résumé Google Doc exported as `.docx` | S1 content |
| Pick homepage concept | S1, before page build |
| Cloudflare account to connect preview | S1 foundation |
| Approve Terral metrics + copy (EN/PT) | End of S1 |
| Approve Blockdaemon, Mercado Envios, About copy (EN/PT) | End of S2 |
| Approve cutover (Pages source switch) | End of S2 |

## 8. Left to the builder

Component breakdown, font choice within the approved concept, Lighthouse CI config, ESLint config, image pipeline (`astro:assets`), exact redirect mechanics, folder layout within §5.4.
