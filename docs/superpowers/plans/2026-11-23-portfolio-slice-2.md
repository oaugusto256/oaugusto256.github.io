# Portfolio Redesign — Slice 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On branch `slice-2`, add the Blockdaemon and Mercado Envios case studies, About, Contact and Work index pages (EN + PT), close the Slice 1 deferred minors that block cutover, then (owner-approved) switch production from the legacy `master` branch site to a GitHub Actions Pages deploy of the Astro build.

**Architecture:** Same static Astro site as S1. Case studies stay MDX in the `work` collection (one file per locale). About timeline is typed data per locale. New routes are `[locale]/work/index.astro`, `[locale]/about.astro`, `[locale]/contact.astro`, plus a bilingual `404.astro`. Production deploy is a new `deploy.yml` workflow (build → `upload-pages-artifact` → `deploy-pages`) that runs only on `master`.

**Tech Stack:** Astro 7 + TypeScript strict, `@astrojs/mdx`, `@astrojs/sitemap`, `astro:assets`, GitHub Actions (`actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`), Cloudflare Workers static assets (preview only).

**Spec:** `docs/superpowers/specs/2026-11-22-portfolio-redesign-design.md` (§5.1 S2, §5.2 cutover, §5.4 routes, §5.5 evidence rules, §7 owner inputs). S1 ledger with deferred minors: `.superpowers/sdd/2026-11-22-portfolio-slice-1/progress.md`.

## Global Constraints

- Work on `slice-2`; PRs into `redesign`. Never commit to, merge into or push to `master`, and never change GitHub Pages settings, until the owner approves cutover in Task 10.
- Every number on a page must appear in an owner-approved evidence file in `docs/superpowers/evidence/`. `scripts/verify-dist.mjs` enforces it.
- Blockdaemon bundle wording: "more than 80%" (PT "mais de 80%") only. Never "82%", "13.4", "807" or a bare "80%".
- Blockdaemon: no proprietary code, no internal architecture, no exact before/after bundle sizes. Mercado Envios: no company-wide outcomes; "millions of transactions" (old site JSON) is not evidence and must not appear.
- Fugro (June 2026 – now): résumé-level detail only, About page only.
- Contact channels only: email `tavioalves@gmail.com`, LinkedIn `https://www.linkedin.com/in/oaugusto256`, GitHub `https://github.com/oaugusto256`, résumé. No WhatsApp, GitLab, Stack Overflow.
- Role "Product Engineer"; location "Florianópolis, Brazil"; no availability status.
- Routes (spec §5.4): `/{lang}/work/`, `/{lang}/work/{slug}/`, `/{lang}/about/`, `/{lang}/contact/`. `/projects.html` → `/en/work/`. No Lab link (S3).
- Nav shows only built destinations: Work → `/{lang}/work/`, About → `/{lang}/about/`, Contact → `/{lang}/contact/`, Résumé, GitHub, LinkedIn, language switcher.
- Owner reviews all copy (EN + PT). Claude drafts both.
- Lighthouse floors: performance ≥ 0.90, accessibility ≥ 0.95, best-practices ≥ 0.95, seo ≥ 0.95. Content fully visible with JS disabled; `prefers-reduced-motion` respected.
- Test mechanism stays `npm run check && npm run lint && npm run build && npm run verify` (+ Lighthouse CI). No unit/e2e tests. Assertions first (RED), then implement (GREEN).
- Executor keeps a ledger at `.superpowers/sdd/2026-11-23-portfolio-slice-2/progress.md` (git-ignored), same format as S1.

## Owner gates (collected, so they can be asked together)

| Gate | Task |
|---|---|
| Answer Blockdaemon interview + approve evidence/blockdaemon.md + copy EN/PT | 4 |
| Answer Mercado Envios interview + approve evidence/mercado-envios.md + copy EN/PT | 5 |
| Approve evidence/about.md (incl. GeekHunter 500+ / 25%) + About copy EN/PT | 6 |
| Set repo variables `PUBLIC_POSTHOG_KEY` / `PUBLIC_POSTHOG_HOST` (or allow Claude to via `gh`) | 10 |
| Approve cutover: Pages source switch + merge `redesign` → `master` | 10 |

## Review Focus

1. **Bundle wording leaking on any page.** A reasonable person expects no page, in either locale, to say "82%", "13.4 MB", "807 KB" or a bare "80%". → Task 1 site-wide banned-string + "80%"-context assertion.
2. **Old and mistyped URLs after cutover.** `/projects.html` (linked from the old site and search results) must land on `/en/work/`; an unknown path must show a bilingual 404 with links to `/en/` and `/pt/`, on both GitHub Pages and the Worker preview. → Task 7 assertions + Task 10 curl checks.
3. **Language switcher on every new page** (work index, about, contact, both new case studies) lands on the same page in the other locale, not home. → Tasks 2, 3, 4, 5, 6 switcher assertions.
4. **Production build without analytics vars** (repo variables unset or misnamed): site deploys and works with no PostHog requests. → Task 8 CI no-key + key builds; Task 10 deploy uses `vars.*` that may be empty.
5. **Long PT strings at 360px on new pages** (case-study facts, About timeline, Work index cards): no horizontal scroll. → manual 360px check in Tasks 4–6 and Task 9 walk, recorded in the ledger.

---

### Task 1: Evidence check per source, whole-token match, site-wide banned strings

Closes S1 minor "number check is substring-based". Makes every later content task test itself.

**Files:**
- Modify: `scripts/verify-dist.mjs` (replace the two Terral/home number blocks with one generic block; add site-wide banned block; delete the vacuous `.reveal` assertion)

**Interfaces:**
- Produces (inside `verify-dist.mjs`):
  - `numberTokens(text: string): string[]` — unique matches of `/\d[\d.,]*%?\+?/g`, trailing `.`/`,` stripped.
  - `checkNumbers(label: string, sources: string[], evidenceFile: string): void` — every token in the sources must be in `numberTokens(evidence)` (set membership, not substring). MDX sources get the S1 preprocessing (drop `cover:` line, `import` lines, JSX/HTML tags).
  - `EVIDENCE_MAP` — array of `{ label, sources, evidence }`. Initial rows: `terral` → `src/content/work/terral/{en,pt}.mdx` → `evidence/terral.md`; `ui strings` → `src/i18n/{en,pt}.ts` → `evidence/home.md`. Tasks 4–6 append rows; a row whose sources don't exist yet is skipped only if its evidence file is also absent.

- [ ] **Step 1:** Add assertion: for every `dist/**/*.html`, text must not include `82%`, `13.4`, `807`, `Senior Frontend Engineer`, `wa.me`, `gitlab.com`, `stackoverflow.com`; and every occurrence of `80%` must be preceded within 12 chars by `more than` or `mais de`. Move the existing home-only banned list here.
- [ ] **Step 2:** Add a self-test: checking the text `"33 visitors"` against `evidence/terral.md` must report `33` as missing (`33` is a substring of `1,330` but not a whole token there — verified 2026-11-23). Assert the self-test reports exactly `['33']`. Run `npm run build && npm run verify` → FAIL (substring logic finds `33`).
- [ ] **Step 3:** Implement `numberTokens`, `checkNumbers`, `EVIDENCE_MAP`; replace the two old number blocks; delete the `.reveal` block. Remove the self-test after GREEN (keep a one-line comment on why tokens, not substrings).
- [ ] **Step 4:** Run `npm run check && npm run lint && npm run build && npm run verify` → `all assertions passed`. If Terral/home fail on whole-token match, the evidence file lacks that exact token: stop and ask the owner (never add numbers yourself).
- [ ] **Step 5:** Commit `test: check page numbers against evidence by whole token`.

### Task 2: Work index page + nav to real pages

**Files:**
- Create: `src/pages/[locale]/work/index.astro`
- Modify: `src/components/navigation/Header.astro` (Work → `localePath(locale, '/work/')`), `src/layouts/CaseStudyLayout.astro` (back link → work index), `src/i18n/en.ts` + `pt.ts` (new `workIndex` keys; `work.back` → "All work" / "Todos os projetos"), `scripts/verify-dist.mjs`

**Interfaces:**
- Consumes: `getWork(locale)`, `slugOf`, `ProjectCard` (props unchanged), `featured`.
- Produces: i18n keys `workIndex: { title: string; intro: string; metaTitle: string; metaDescription: string }`. Page lists every `work` entry for the locale in `order`, all as `emphasis: 'secondary'` cards in a single-column list, each linking to its case study. Entries come from the collection only (no i18n fallback cards on this page).

- [ ] **Step 1:** Assertions (both locales): `{loc}/work/index.html` exists; has one `<h1>`; has `project_card_click` link to `/{loc}/work/terral/`; switcher → `/{other}/work/`; header nav link `href="/{loc}/work/"`; terral case study back link `href="/{loc}/work/"`. Replace the S1 nav assertion `/{loc}/#work`. Run → FAIL.
- [ ] **Step 2:** Implement the page with `BaseLayout` (`alternate={localePath(other, '/work/')}`), dictionary keys, nav + back-link changes.
- [ ] **Step 3:** Run full suite → PASS. Check 360px (EN + PT) no h-scroll in `npm run dev`.
- [ ] **Step 4:** Add `/en/work/index.html` to `lighthouserc.json` URLs. Commit `feat: add work index page`.

### Task 3: Contact page

**Files:**
- Create: `src/pages/[locale]/contact.astro`
- Modify: `src/components/home/ContactBlock.astro` (accept `as: 'section' | 'page'`; page variant renders `<h1>` instead of `<h2>`), `Header.astro` (Contact → `/{lang}/contact/`), `src/i18n/en.ts` + `pt.ts` (`contactPage: { metaTitle; metaDescription }`), `scripts/verify-dist.mjs`

**Interfaces:**
- Consumes: `person`, `resumePath`, existing `home.contactTitle/contactBody/contactEmail`.
- Produces: `ContactBlock` prop `headingLevel?: 1 | 2` (default 2). Home keeps its `#contact` section.

- [ ] **Step 1:** Assertions (both locales): `{loc}/contact/index.html` exists with one `<h1>`, mailto link, LinkedIn, GitHub, `resume_download` link to the locale's PDF, each with `data-event`; switcher → `/{other}/contact/`; header nav Contact `href="/{loc}/contact/"` (replaces `/#contact` assertion). Run → FAIL.
- [ ] **Step 2:** Implement. Run suite → PASS. 360px check.
- [ ] **Step 3:** Commit `feat: add contact page`.

### Task 4: Blockdaemon case study (owner gate)

**Files:**
- Create: `docs/superpowers/evidence/blockdaemon.md`, `src/content/work/blockdaemon/en.mdx`, `src/content/work/blockdaemon/pt.mdx`, `src/assets/work/blockdaemon/cover.svg` (+ optional diagram SVG)
- Modify: `scripts/verify-dist.mjs` (`EVIDENCE_MAP` row, page assertions), `src/layouts/CaseStudyLayout.astro` + `src/components/home/ProjectCard.astro` (pass `widths`/`sizes` only when `image.format !== 'svg'`), `lighthouserc.json`

**Interfaces:**
- Consumes: `work` schema (unchanged), `checkNumbers` row format from Task 1.
- Produces: slug `blockdaemon`, `order: 2`. Frontmatter: `title: Blockdaemon`, `role` "Front-end Engineer, then Senior Front-end Engineer" (PT "Engenheiro Front-end, depois Engenheiro Front-end Sênior"), `period` "July 2021 – April 2026" (PT "julho de 2021 – abril de 2026"), `links: [{ label: 'app.blockdaemon.com', url: 'https://app.blockdaemon.com' }]`.

Content source: résumé Blockdaemon bullets (both roles) + old site JSON for product context (Stripe checkout, WalletConnect/MetaMask, Okta, Mantine, React Query; drop KYB vendor unless owner OKs). Sections, same as Terral: Problem & context · Role · Product & technical decisions · Approach (no internal architecture: describe the method — route-level code splitting, dynamic imports, prefetch; Mantine v6 → v8 with documentation; React 17 → 19) · Challenges & trade-offs · Results & evidence · Learnings. Cover: an SVG in the S1 visual language (charcoal, `--color-line-dark` strokes, accent) showing an entry bundle split into route chunks — no sizes, no numbers.

- [ ] **Step 1 (owner gate):** Ask the owner, in one message, and record answers in `evidence/blockdaemon.md`:
  1. What triggered the bundle work, and how was "more than 80%" measured (tool, which bundle)?
  2. Team size and your scope on each initiative (checkout/subscriptions, staking dashboards, form builder, Mantine upgrade, React 19, Portfolio product). Which three should the case study lead with?
  3. "Record time" for the Mantine upgrade: keep the phrase, give a duration, or drop it?
  4. OK to name Stripe, Okta, Contentful, WalletConnect, MetaMask, Sumsub?
  5. Any public screenshot you're comfortable showing, or SVG-only?
- [ ] **Step 2:** Draft `evidence/blockdaemon.md` in the `evidence/terral.md` format: Status line, Approved-numbers table (`#`, value, claim, source, approved ☐). Rows at minimum: `more than 80%` / `mais de 80%`, `17`, `19`, `6`, `8` (Mantine v6/v8), `2021`, `2024`, `2026`. Mark all unapproved.
- [ ] **Step 3:** Add verify assertions: both `{loc}/work/blockdaemon/index.html` exist; switcher → twin; `EVIDENCE_MAP` row `blockdaemon` → `src/content/work/blockdaemon/{en,pt}.mdx` → `evidence/blockdaemon.md`; page contains `more than 80%` (EN) / `mais de 80%` (PT); page contains no `<img` whose `src` ends in `.png`/`.jpg` unless the owner approved screenshots (Step 1 Q5). Run → FAIL.
- [ ] **Step 4:** Write cover SVG and EN + PT MDX. Run suite → PASS. 360px check EN + PT. Lighthouse local on `/en/work/blockdaemon/`.
- [ ] **Step 5 (owner gate):** Owner approves evidence rows (tick ☑, set Status "APPROVED by owner <date>") and copy. Apply edits.
- [ ] **Step 6:** Add `/pt/work/blockdaemon/index.html` to `lighthouserc.json`. Commit `feat: add blockdaemon case study` (evidence file in the same commit).

### Task 5: Mercado Envios case study (owner gate) + home cards from collection only

**Files:**
- Create: `docs/superpowers/evidence/mercado-envios.md`, `src/content/work/mercado-envios/{en,pt}.mdx`, `src/assets/work/mercado-envios/cover.svg`
- Modify: `scripts/verify-dist.mjs`, `src/components/home/SelectedWork.astro` (drop the i18n fallback branch), `src/i18n/en.ts` + `pt.ts` (delete `home.projects`, `home.caseSoon`). `evidence/home.md` stays as is (unused rows are harmless).

**Interfaces:**
- Produces: slug `mercado-envios`, `order: 3`, `title: Mercado Envios`, `role` "Front-end Engineer", `period` "September 2020 – July 2021" (PT "setembro de 2020 – julho de 2021"), `links: []`. `SelectedWork` throws at build time if a `featured` slug has no entry for the locale (fail loud, not a silent card).

Content source: résumé bullet (BFF services, RFCs, 450+ production releases, micro-frontends) + old JSON for product context (Mercury WMS UI for warehouse/logistics operators: inbound/outbound, inventory). Shorter than Blockdaemon is fine. No "millions", no company outcomes.

- [ ] **Step 1 (owner gate):** Ask, record in evidence: (1) OK to name "Mercury" WMS? (2) Which operator flows did you build UI for? (3) What did a BFF you designed do, in one sentence, without internals? (4) What was an RFC you wrote about (topic only)? (5) Team shape and your role in the 450+ releases (e.g. shared across the team?).
- [ ] **Step 2:** Draft `evidence/mercado-envios.md`: rows `450+` / `mais de 450`, `2020`, `2021`, all unapproved.
- [ ] **Step 3:** Assertions: both pages exist; switcher → twin; `EVIDENCE_MAP` row; home in both locales links all three featured slugs to `/{loc}/work/{slug}/` with `data-event="project_card_click"`; neither home contains the `caseSoon` strings ("Case study coming soon", PT equivalent); neither case study contains `million`/`milhões`. Run → FAIL.
- [ ] **Step 4:** Write cover SVG + MDX; remove fallback branch and keys. Suite → PASS (`astro check` confirms no dangling `t.home.projects`). 360px check.
- [ ] **Step 5 (owner gate):** Owner approves evidence + copy. Apply edits.
- [ ] **Step 6:** Commit `feat: add mercado envios case study`.

### Task 6: About page (owner gate)

**Files:**
- Create: `src/pages/[locale]/about.astro`, `src/data/experience.ts`, `src/components/about/Timeline.astro`, `docs/superpowers/evidence/about.md`
- Modify: `Header.astro` (add About between Work and Contact), `src/i18n/en.ts` + `pt.ts` (`about: { metaTitle; metaDescription; title; intro: string[]; nowTitle; timelineTitle; educationTitle; designSystemTitle; designSystemBody }`), `scripts/verify-dist.mjs`, `lighthouserc.json`

**Interfaces:**
- Produces in `src/data/experience.ts`:
  ```ts
  export interface Role {
    company: string;
    url?: string;
    title: Record<Locale, string>;
    period: Record<Locale, string>; // "June 2026 – present" / "junho de 2026 – atual"
    place: Record<Locale, string>;  // "Remote" / "Remoto", "Florianópolis" …
    summary: Record<Locale, string>;
    caseStudy?: 'blockdaemon' | 'mercado-envios';
  }
  export const experience: Role[];          // newest first
  export const education: { name: Record<Locale, string>; school: string; year: string }[];
  ```
- `Timeline.astro` props `{ locale: Locale }`; a role with `caseStudy` links to `/{loc}/work/{slug}/`.

Content: résumé is the source for every role (Fugro, Blockdaemon ×2, Mercado Livre, Dextra, Turtle (Freelance / Freelancer), GeekHunter, UFPA, Ezpeed) and education (Rocketseat 2026, UFPA 2018). Intro: 2–3 short paragraphs from résumé Summary (Product Engineer, Terral, AI-assisted workflows). Blockdaemon Design System gets its own short block (from old JSON: Mantine 8 based, new visual identity from an external agency, theming, tokens, dark/light, docs, used across Blockdaemon web products). GeekHunter: the 500+ / 25% numbers appear only if the owner approves those rows.

- [ ] **Step 1:** Draft `evidence/about.md`: one row per number used (all years in periods, `10+`, `500+`, `25%`, `6`, `8` if Mantine versions are named), source = résumé line, unapproved.
- [ ] **Step 2:** Assertions (both locales): `{loc}/about/index.html` exists, one `<h1>`, switcher → `/{other}/about/`, header nav `href="/{loc}/about/"`, contains `Fugro`, `GeekHunter`, `Design System`; links to `/{loc}/work/blockdaemon/` and `/{loc}/work/mercado-envios/`; `EVIDENCE_MAP` row `about` → `src/data/experience.ts` + the `about` block of `src/i18n/{en,pt}.ts` → `evidence/about.md` (for i18n, extract only the `about:` object's strings; home.md row keeps checking the rest). Run → FAIL.
- [ ] **Step 3:** Implement data, Timeline, page, nav. Suite → PASS. 360px EN + PT (long PT titles, periods).
- [ ] **Step 4 (owner gate):** Owner approves evidence rows and copy. Apply edits.
- [ ] **Step 5:** Add `/en/about/index.html` to `lighthouserc.json`. Commit `feat: add about page`.

### Task 7: 404 page and legacy URL redirect (cutover blockers)

Closes S1 minor "no 404 page; wrangler not_found_handling none".

**Files:**
- Create: `src/pages/404.astro`, `public/projects.html`
- Modify: `wrangler.jsonc` (`"not_found_handling": "404-page"`), `scripts/verify-dist.mjs`

**Interfaces:**
- `404.astro` is locale-neutral: `<html lang="en">`, EN text then PT text (PT block `lang="pt-BR"`), links to `/en/` and `/pt/`, `<meta name="robots" content="noindex">`, no canonical/hreflang (exclude `404.html` from the canonical/og assertions; keep the one-`<h1>` rule). Does not use `BaseLayout`'s alternates; reuses tokens/styles and the Footer is optional.
- `public/projects.html`: static `<meta http-equiv="refresh" content="0; url=/en/work/">`, `<link rel="canonical" href="https://oaugusto256.github.io/en/work/">`, a visible fallback link, `noindex`.

- [ ] **Step 1:** Assertions: `404.html` exists with links `href="/en/"` and `href="/pt/"`, one `<h1>`, `noindex`; `projects.html` contains `url=/en/work/`; sitemap does not list `404`. Run → FAIL.
- [ ] **Step 2:** Implement. Suite → PASS. `npx wrangler dev` (or `astro preview`): `curl -sI localhost:<port>/nope/` → 404 status with 404 page body; `/projects.html` → shows redirect.
- [ ] **Step 3:** Commit `feat: add 404 page and projects.html redirect`.

### Task 8: S1 deferred minors

Each is small; one commit per bullet group is fine, one task gate.

**Files:**
- Modify: `src/components/navigation/LanguageSwitcher.astro`, `src/layouts/BaseLayout.astro`, `src/layouts/CaseStudyLayout.astro`, `src/i18n/utils.ts`, `src/components/home/Hero.astro`, `package.json`, `.github/workflows/ci.yml`, `scripts/verify-dist.mjs`
- Delete: `src/assets/avatar.jpg`

Decisions:
- **Switcher (WCAG 2.5.3):** remove `aria-label`; visible `PT`/`EN` plus a visually-hidden `switchLabel` inside the link, so the accessible name starts with the visible text. The no-twin note stays visible text in the link.
- **hreflang:** use `pt-BR` everywhere (head alternates, switcher `hreflang`, matching the sitemap). Update the S1 assertions that expect `hreflang="pt"`.
- **og:** `og:locale:alternate` only when `alternate` is set. `BaseLayout` prop `ogType?: 'website' | 'article'` (default `website`); `CaseStudyLayout` passes `article`.
- **Reduced motion:** hide `.pulse` when motion is reduced (`@media (prefers-reduced-motion: reduce) { .pulse { display: none } }`), so it no longer sits on the "problem" label.
- **Dead code:** delete `swapLocale` and `avatar.jpg`; move `@astrojs/check` and `typescript` to `devDependencies`.
- **CI:** `on: push: branches: [master, redesign]` + `pull_request` (stops double runs on PR branches). Add a second build + verify step with `PUBLIC_POSTHOG_KEY=phc_ci_test` so the with-key analytics branch runs in CI.

- [ ] **Step 1:** Assertions: no `lang-switch` `<a>` has `aria-label`; every page with a twin has `hreflang="pt-BR"` alternate and no `hreflang="pt"`; `404.html` has no `og:locale:alternate`; case study pages have `og:type" content="article"`; built CSS hides `.pulse` under `prefers-reduced-motion: reduce`. Run → FAIL.
- [ ] **Step 2:** Implement all decisions above. Suite → PASS (both no-key and `PUBLIC_POSTHOG_KEY=phc_ci_test npm run build && npm run verify`).
- [ ] **Step 3:** Commit(s), e.g. `fix: language switcher label and pt-BR hreflang`, `chore: remove dead code, tidy deps and CI triggers`.

### Task 9: Slice review on preview

**Files:**
- Modify: `lighthouserc.json` (final URL list: `/en/`, `/pt/`, `/en/work/`, `/en/work/terral/`, `/pt/work/blockdaemon/`, `/en/work/mercado-envios/`, `/en/about/`, `/pt/contact/`)

- [ ] **Step 1:** Full local suite + `npx --yes @lhci/cli@0.16.x autorun` → all floors pass. Record scores in ledger.
- [ ] **Step 2:** Push `slice-2`, open PR `slice-2` → `redesign` (CI green). After owner merges, Cloudflare rebuilds the preview from `redesign`.
- [ ] **Step 3:** Preview walk (puppeteer or Chrome), 1280 and 390/360, EN + PT: every new URL 200 with and without trailing slash; `/nope/` → 404 page; `/projects.html` → `/en/work/`; keyboard walk on about/contact/work index; JS disabled content visible; no h-scroll at 360. PostHog live check: `project_card_click` from work index, `case_study_view{project:blockdaemon}`, `language_switch` on about.
- [ ] **Step 4:** Fresh reviewer (most capable model) on `redesign`'s S2 range. Fix Critical/Important; log minors. Owner final copy review on preview (spec §7 "Approve Blockdaemon, Mercado Envios, About copy").

### Task 10: Cutover (owner gate)

**Files:**
- Create: `.github/workflows/deploy.yml` (committed on `slice-2`/`redesign` before cutover; it only runs on `master`)
- Modify after cutover: `CLAUDE.md` (drop the "never touch master" rule; document `deploy.yml` and the Pages source), `README.md`

`deploy.yml` (exact):
```yaml
name: Deploy
on:
  push:
    branches: [master]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          PUBLIC_POSTHOG_KEY: ${{ vars.PUBLIC_POSTHOG_KEY }}
          PUBLIC_POSTHOG_HOST: ${{ vars.PUBLIC_POSTHOG_HOST }}
      - run: npm run verify
        env:
          PUBLIC_POSTHOG_KEY: ${{ vars.PUBLIC_POSTHOG_KEY }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 1:** Commit `deploy.yml` on `slice-2` (`ci: add github pages deploy workflow`); `actionlint` if available. It lands in `redesign` via the Task 9 PR or a follow-up PR.
- [ ] **Step 2 (owner gate):** Repo variables `PUBLIC_POSTHOG_KEY` / `PUBLIC_POSTHOG_HOST` set (owner, or Claude via `gh variable set` with explicit OK). Record current Pages config: `gh api repos/oaugusto256/oaugusto256.github.io/pages` → ledger (rollback reference).
- [ ] **Step 3 (owner gate — explicit "go" required):** Present the sequence and rollback below; wait for approval.
  1. Switch source: `gh api -X PUT repos/oaugusto256/oaugusto256.github.io/pages -f build_type=workflow`. The old deployment keeps serving until the first workflow deploy.
  2. Mark PR #2 (`redesign` → `master`) ready and merge it with a merge commit (owner clicks, or Claude with OK).
  3. Watch the `Deploy` run (`gh run watch`) → success.
  - **Rollback:** `git revert -m 1 <merge sha>` on `master` via PR, then `gh api -X PUT …/pages -f build_type=legacy -f 'source[branch]=master' -f 'source[path]=/'`.
- [ ] **Step 4:** Verify production with curl: `/` → redirect to `/en/`; 200 for `/en/`, `/pt/`, `/en/work/`, `/pt/work/`, all six case study URLs, `/en/about/`, `/pt/about/`, `/en/contact/`, `/pt/contact/`, both résumé PDFs, `/sitemap-index.xml`, `/robots.txt`; `/en/work/terral` (no slash) → 301/200 to slash; `/projects.html` → `/en/work/`; `/nope/` → 404 with the custom page. One PostHog `$pageview` from `oaugusto256.github.io`. Lighthouse once against production home.
- [ ] **Step 5:** Update `CLAUDE.md`/`README.md` and memory (`portfolio-redesign-progress`): cutover done, `master` now deploys via Actions, S3 ships directly. Commit `docs: record cutover` via PR into `master`.
