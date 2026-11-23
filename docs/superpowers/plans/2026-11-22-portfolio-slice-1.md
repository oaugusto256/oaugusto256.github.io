# Portfolio Redesign — Slice 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On branch `redesign`, build the Astro foundation, bilingual Home, and Terral.surf case study, deployed to a Cloudflare Pages preview. No production change.

**Architecture:** Static Astro site, `/en/` + `/pt/` prefixed routes via Astro i18n, case studies as MDX content collections (one file per locale), typed UI string dictionaries. Zero client JS except a tiny nav toggle and the optional PostHog loader.

**Tech Stack:** Astro (latest stable) + TypeScript strict, `@astrojs/mdx`, `@astrojs/sitemap`, ESLint (`eslint-plugin-astro`, `typescript-eslint`), Lucide icons as inline SVG, `posthog-js`, `@lhci/cli` in CI.

**Spec:** `docs/superpowers/specs/2026-11-22-portfolio-redesign-design.md` (source spec: `~/Downloads/portfolio-redesign-specs.md`)

## Global Constraints

- Never commit to or merge into `master` in this slice. Never change GitHub Pages settings.
- No fabricated metrics, responsibilities, or claims. Every number on a page must appear in an owner-approved evidence file.
- Site URL: `https://oaugusto256.github.io`. Locales: `en` (html lang `en`), `pt` (html lang `pt-BR`). `defaultLocale: 'en'`, `prefixDefaultLocale: true`.
- `/` redirects to `/en/` statically; no language sniffing.
- Role title: "Product Engineer". Location: "Florianópolis, Brazil". No availability status.
- Contact channels only: email `tavioalves@gmail.com`, LinkedIn `https://www.linkedin.com/in/oaugusto256`, GitHub `https://github.com/oaugusto256`, résumé.
- Blockdaemon bundle claim wording: "more than 80%" — never "82%" or "13.4 MB → 807 KB".
- No Tailwind, no React in S1. Testing limited to: `astro check`, ESLint, build, `scripts/verify-dist.mjs`, Lighthouse CI.
- Lighthouse floors: performance ≥ 0.90, accessibility ≥ 0.95, best-practices ≥ 0.95, seo ≥ 0.95.
- Respect `prefers-reduced-motion`; content must be fully visible with JS disabled.
- Nav shows only built destinations. In S1: Work → `/{lang}/#work`, Contact → `/{lang}/#contact`.

## Review Focus

1. Direct load / refresh of a nested localized URL (`/pt/work/terral/`, with and without trailing slash) on the preview host must serve the page, not 404. → Task 3 + Task 9 verify checks.
2. Language switcher on a case study must land on the same case study in the other locale, not on home. → Task 4 check.
3. JS disabled or blocked: all content visible, mobile nav still reachable. → Task 5 check.
4. PostHog key absent (local, preview): no script request, no console errors. → Task 10 check.
5. Long PT strings at 360px viewport: no horizontal scroll. → Task 8 manual check at 360px recorded in PR notes.

The test mechanism is `scripts/verify-dist.mjs`: a dependency-free Node script that reads `dist/` after build and asserts facts. Each task adds its assertions first (they fail), then implements.

---

### Task 1: Scaffold Astro, remove old site, verify script

**Files:**
- Delete: `index.html`, `projects.html`, `assets/` (except icons), `LICENSE.txt`, `.DS_Store`
- Move: `assets/icons/*` → `public/icons/`
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `eslint.config.js`, `.gitignore`, `src/pages/en/index.astro` (temporary "hello"), `scripts/verify-dist.mjs`
- Modify: `README.md`, `CLAUDE.md` (new dev commands, architecture)

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `check` (`astro check`), `lint` (`eslint .`), `verify` (`node scripts/verify-dist.mjs`). `verify-dist.mjs` exports nothing; it exposes helpers inside the file: `read(path: string): string` (relative to `dist/`), `exists(path: string): boolean`, `assert(cond: boolean, msg: string): void`; exits 1 listing all failures.

- [ ] **Step 1:** Create `scripts/verify-dist.mjs` with one assertion: `exists('en/index.html')`. Run `node scripts/verify-dist.mjs` → FAIL (no dist).
- [ ] **Step 2:** Scaffold Astro (`npm create astro@latest -- --template minimal --typescript strict --no-git --install`) into repo root, then delete old site files and move icons. `astro.config.mjs`: `site: 'https://oaugusto256.github.io'`, `trailingSlash: 'ignore'`, `build: { format: 'directory' }`.
- [ ] **Step 3:** Add ESLint flat config with `eslint-plugin-astro` + `typescript-eslint` recommended.
- [ ] **Step 4:** Run `npm run check && npm run lint && npm run build && npm run verify` → all PASS.
- [ ] **Step 5:** Update `CLAUDE.md`/`README.md` (Astro, commands, `redesign` branch rule, Pages still serves `master`). Commit `chore: scaffold astro and remove template site`.

### Task 2: CI workflow + preview hosting

**Files:**
- Create: `.github/workflows/ci.yml`, `lighthouserc.json`

**Interfaces:**
- Consumes: npm scripts from Task 1.

- [ ] **Step 1:** `ci.yml` on `push` and `pull_request` (all branches): Node LTS, `npm ci`, `check`, `lint`, `build`, `verify`, then `npx @lhci/cli autorun`.
- [ ] **Step 2:** `lighthouserc.json`: `staticDistDir: "dist"`, URLs `/en/index.html` (later Task 9 adds `/en/work/terral/index.html`), assertions per Global Constraints floors, `upload.target: "temporary-public-storage"`.
- [ ] **Step 3:** Push `redesign`; confirm the workflow run is green with `gh run list --branch redesign --limit 1`.
- [ ] **Step 4 (owner):** Connect repo in Cloudflare Pages: production branch `redesign`, build `npm run build`, output `dist`, env `NODE_VERSION` = LTS. Record the preview URL in the PR description.
- [ ] **Step 5:** Commit `ci: add check, lint, build, verify and lighthouse`.

### Task 3: i18n routing, dictionaries, BaseLayout

**Files:**
- Modify: `astro.config.mjs` (i18n, `redirects: { '/': '/en/' }`)
- Create: `src/i18n/types.ts`, `src/i18n/en.ts`, `src/i18n/pt.ts`, `src/i18n/utils.ts`, `src/layouts/BaseLayout.astro`, `src/pages/pt/index.astro`
- Test: `scripts/verify-dist.mjs`

**Interfaces:**
- Produces:
  - `type Locale = 'en' | 'pt'`; `const locales: readonly Locale[]`
  - `en` dictionary is the shape source: `type Dict = typeof en`; `pt` declared `export const pt = { … } satisfies Dict` (missing key = type error).
  - `useT(locale: Locale): Dict`
  - `htmlLang(locale: Locale): 'en' | 'pt-BR'`
  - `localePath(locale: Locale, path: string): string` → `'/pt/work/terral/'` style, always trailing slash
  - `swapLocale(pathname: string, target: Locale): string` (replaces first segment)
  - `BaseLayout` props: `{ locale: Locale; title: string; description: string; alternate?: string; ogImage?: string }`. Renders `<html lang>`, title, description, canonical, OG/Twitter tags, `hreflang` for en, pt, `x-default`→en. If `alternate` is undefined, omit the other-locale hreflang.

- [ ] **Step 1:** Add assertions: `en/index.html` contains `<html lang="en"`; `pt/index.html` contains `<html lang="pt-BR"`; both contain `hreflang="en"`, `hreflang="pt"`, `hreflang="x-default"`; `index.html` contains `url=/en/`. Run build + verify → FAIL.
- [ ] **Step 2:** Implement the i18n config, utils, dictionaries (start with `meta.title`, `meta.description` keys), and BaseLayout; both home pages use it.
- [ ] **Step 3:** Run `npm run check && npm run build && npm run verify` → PASS.
- [ ] **Step 4:** Commit `feat: add i18n routing and base layout`.

### Task 4: Header, nav, language switcher, footer

**Files:**
- Create: `src/components/navigation/Header.astro`, `src/components/navigation/LanguageSwitcher.astro`, `src/components/navigation/MobileNav.astro`, `src/components/layout/Footer.astro`, `src/components/ui/Icon.astro`
- Modify: `src/layouts/BaseLayout.astro`, `src/i18n/{en,pt}.ts` (`nav.*`, `footer.*` keys)

**Interfaces:**
- Consumes: `localePath`, `useT`, `BaseLayout.alternate`.
- Produces: `LanguageSwitcher` props `{ locale: Locale; alternate?: string }`: links to `alternate` if set, else `localePath(other, '/')` with visible text from `nav.notTranslated`. Link has `hreflang`, `lang`, and `aria-label` from dict; carries `data-event="language_switch"` and `data-to="<locale>"`. `Icon` props `{ name: 'github' | 'linkedin' | 'mail' | 'file-text' | 'arrow-up-right' | 'menu' | 'x'; label?: string }` (Lucide SVG paths inlined; `aria-hidden` when no label).

- [ ] **Step 1:** Add assertions: `en/index.html` has an `<a` with `href="/pt/"` and `hreflang="pt"`; header has links `#work`, `#contact`, GitHub and LinkedIn URLs, résumé link `/resume/otavio-silva-resume-en.pdf`; `pt/index.html` résumé link is `-pt.pdf`. Run → FAIL.
- [ ] **Step 2:** Implement components. Mobile nav: `<button aria-expanded aria-controls>` toggled by a ≤15-line inline script; without JS, nav links render as a visible inline list (`.no-js` default; script adds `.js` to `<html>`).
- [ ] **Step 3:** Run build + verify → PASS. Keyboard-check in `npm run dev`: Tab reaches every nav item with visible focus; Esc closes mobile menu.
- [ ] **Step 4:** Commit `feat: add header, language switcher and footer`.

### Task 5: Design exploration (owner gate)

**Files:**
- Create (scratch, not committed): 3 homepage concept HTML mockups
- Modify: `docs/superpowers/specs/2026-11-22-portfolio-redesign-design.md` §5.7 (record chosen concept + token values)

- [ ] **Step 1:** Build 3 concepts of the Home hero + Selected Work card + one pillar block, using real copy from spec §2.3. Vary: background (warm off-white vs neutral mono), accent (muted green vs deep blue), hero (typographic composition vs photo), typeface pair (open-license sans + mono). Each works at 360px and 1280px.
- [ ] **Step 2 (owner):** Owner picks one (or mixes). Record: colors (bg, text, muted, border, accent, charcoal surface) as hex with WCAG AA contrast verified, font families + weights, type scale, max width.
- [ ] **Step 3:** Commit `docs: record chosen visual direction`.

### Task 6: Design tokens, fonts, global styles

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/typography.css`, `public/fonts/*.woff2`
- Modify: `src/layouts/BaseLayout.astro` (import styles, preload primary font)

**Interfaces:**
- Consumes: values recorded in Task 5.
- Produces: CSS custom properties `--color-bg`, `--color-text`, `--color-muted`, `--color-border`, `--color-accent`, `--color-surface-dark`, `--color-on-dark`; `--space-1`…`--space-24` (4px steps: `--space-n = n*4px`); `--font-sans`, `--font-mono`; `--step--1`…`--step-6` (fluid type); `--max-width`; `--radius`; `--ease-out`, `--dur-fast`, `--dur-base`. Utility classes: `.container`, `.mono`, `.visually-hidden`, `.reveal` (animates only under `html.js` and `prefers-reduced-motion: no-preference`).

- [ ] **Step 1:** Add assertion: built CSS contains `prefers-reduced-motion` and no rule hides `.reveal` outside `.js`. Run → FAIL.
- [ ] **Step 2:** Implement tokens and global styles; self-host fonts (woff2, `font-display: swap`, subset Latin + Latin-1 for PT accents).
- [ ] **Step 3:** Run build + verify → PASS. Commit `feat: add design tokens and global styles`.

### Task 7: Work content collection + CaseStudyLayout

**Files:**
- Create: `src/content.config.ts`, `src/layouts/CaseStudyLayout.astro`, `src/pages/[locale]/work/[slug].astro`, `src/content/work/terral/en.mdx`, `src/content/work/terral/pt.mdx` (stub body, real frontmatter)
- Remove: Task 3's static `src/pages/{en,pt}/index.astro` move to `src/pages/[locale]/index.astro` with `getStaticPaths` over `locales`.

**Interfaces:**
- Produces: collection `work`, glob loader `src/content/work/*/*.mdx`; entry id `"<slug>/<locale>"`. Schema:
  `{ title: string; summary: string; role: string; period: string; stack: string[]; links: { label: string; url: string }[]; cover: image(); coverAlt: string; order: number; locale: 'en' | 'pt' }`
- Helper in `src/content/work.ts`: `getWork(locale: Locale): Promise<WorkEntry[]>` sorted by `order`; `slugOf(entry): string`; `hasTwin(slug: string, locale: Locale): Promise<boolean>`.
- Case study page passes `alternate = localePath(other, '/work/' + slug + '/')` only when `hasTwin` is true.
- `CaseStudyLayout` sections in order (spec §6.7): overview header (title, summary, role, period, stack, links), then MDX body with `##` headings: Problem & context · Role · Product & technical decisions · Architecture & implementation · Challenges & trade-offs · Results & evidence · Learnings · Links.

- [ ] **Step 1:** Add assertions: `en/work/terral/index.html` and `pt/work/terral/index.html` exist; EN page links to `/pt/work/terral/`; PT page links to `/en/work/terral/`. Run → FAIL.
- [ ] **Step 2:** Implement collection, helpers, layout, route.
- [ ] **Step 3:** Run check + build + verify → PASS. Commit `feat: add work collection and case study layout`.

### Task 8: Home page sections

**Files:**
- Create: `src/components/home/Hero.astro`, `SelectedWork.astro`, `ProjectCard.astro`, `Pillars.astro`, `CurrentFocus.astro`, `ContactBlock.astro`
- Modify: `src/pages/[locale]/index.astro`, `src/i18n/{en,pt}.ts` (`home.*` keys), `src/content/featured.ts`

**Interfaces:**
- Consumes: `getWork`, tokens, `Icon`.
- Produces: `featured.ts` exports `featured: { slug: 'terral' | 'blockdaemon' | 'mercado-envios'; emphasis: 'primary' | 'secondary' }[]` in that order. `ProjectCard` props `{ title; summary; role; tags: string[]; href?: string; image?: ImageMetadata; imageAlt?: string; emphasis }`; when `href` is undefined it renders no link (Blockdaemon / Mercado Envios in S1). Card link carries `data-event="project_card_click"` `data-project="<slug>"`.
- Section ids: `#work`, `#philosophy`, `#focus`, `#contact`.

- [ ] **Step 1:** Add assertions: `en/index.html` contains "Product Engineer", "Florianópolis", ids `work`, `philosophy`, `focus`, `contact`, link `/en/work/terral/`, `mailto:tavioalves@gmail.com`; does not contain "82%", "Senior Frontend Engineer", "wa.me". Same structure for PT with `/pt/work/terral/`. Run → FAIL.
- [ ] **Step 2:** Implement sections with chosen design. Copy: hero headline/supporting copy from spec §2.3 (EN and PT verbatim as draft); pillars from spec §2.4; focus list from spec §6.2D; Blockdaemon/Mercado Envios card summaries from `assets/data/professional-projects.json` (git history) rewritten to résumé-level facts. Hero CTAs: "Explore selected work" → `#work`, "View résumé" → locale PDF.
- [ ] **Step 3:** Run check + build + verify → PASS. Check 360px and 1280px in dev: no horizontal scroll in EN and PT.
- [ ] **Step 4:** Commit `feat: build bilingual home page`.

### Task 9: Terral evidence and case study (owner gate)

**Files:**
- Create: `docs/superpowers/evidence/terral.md`, `src/assets/work/terral/*` (screenshots, `architecture.svg`)
- Modify: `src/content/work/terral/{en,pt}.mdx`, `lighthouserc.json` (add Terral URL)

- [ ] **Step 1 (owner input):** Owner names the Terral PostHog project and describes backend/forecast engine/deploy setup (frontend stack already known: React 18, TS, Vite, MapLibre GL JS, TanStack Query, Zustand, Tailwind v4, Docker, GitHub Actions).
- [ ] **Step 2:** Query PostHog read-only (last 90 days: unique visitors, sessions, top beaches selected, returning-user share). Count supported beaches and forecast horizon from terral.surf. Write all findings with source + date to `evidence/terral.md`.
- [ ] **Step 3:** Capture screenshots (desktop 1440, mobile 390) of forecast view, beach selection, map; export AVIF/WebP via `astro:assets`. Draw architecture + forecast data-flow SVG from owner's description.
- [ ] **Step 4 (owner):** Owner approves `evidence/terral.md` and diagram.
- [ ] **Step 5:** Write EN case study using only approved evidence; translate to PT. Owner reviews both.
- [ ] **Step 6:** Add assertion: every number in `terral/en.mdx` appears in `evidence/terral.md` (verify script extracts `\d[\d.,]*%?` tokens). Run build + verify → PASS; Lighthouse passes for Terral URL in CI.
- [ ] **Step 7:** Commit `feat: add terral case study`.

### Task 10: Analytics

**Files:**
- Create: `src/components/analytics/PostHog.astro`
- Modify: `src/layouts/BaseLayout.astro`, `src/pages/[locale]/work/[slug].astro`

**Interfaces:**
- Consumes: `data-event` attributes from Tasks 4, 8; env `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST`.
- Produces: events `$pageview`, `project_card_click {project}`, `case_study_view {project, locale}`, `language_switch {from, to}`, `resume_download {locale}`, `contact_click {channel: 'email'|'linkedin'|'github'}`. Init: `persistence: 'memory'`, `autocapture: false`, `disable_session_recording: true`, `ip: false`. One delegated click listener reads `data-event` + `data-*`.

- [ ] **Step 1:** Add assertion: when built without `PUBLIC_POSTHOG_KEY`, no HTML file references `posthog`. Run → FAIL only if component leaks; implement guard.
- [ ] **Step 2 (owner):** Owner creates new PostHog project "portfolio" (or approves Claude creating it via MCP); key set in Cloudflare Pages env only.
- [ ] **Step 3:** Implement. On preview, confirm each event in PostHog live events; record in PR notes.
- [ ] **Step 4:** Commit `feat: add privacy-first analytics`.

### Task 11: Résumé (owner gate)

**Files:**
- Create: `public/resume/otavio-silva-resume-en.pdf`, `public/resume/otavio-silva-resume-pt.pdf`

- [ ] **Step 1 (owner):** Export the Google Doc as `.docx` to `~/Downloads/docs/`.
- [ ] **Step 2:** Draft changes: title/summary → Product Engineer positioning; bundle line → "more than 80%" + method. Draft full PT translation. Deliver as a text diff for owner to apply in Google Docs.
- [ ] **Step 3 (owner):** Apply, export both PDFs.
- [ ] **Step 4:** Add PDFs; add assertion both exist and size > 10 KB. Run verify → PASS. Commit `feat: add bilingual resume`.

### Task 12: SEO, a11y pass, slice review

**Files:**
- Modify: `astro.config.mjs` (`@astrojs/sitemap` with `i18n: { defaultLocale: 'en', locales: { en: 'en', pt: 'pt-BR' } }`)
- Create: `public/robots.txt`, `public/og/default.png` (1200×630, from chosen design)

- [ ] **Step 1:** Add assertions: `sitemap-index.xml` exists; `robots.txt` references it; every page has one `<h1>`, `<link rel="canonical">`, `og:title`, `og:image`; every `<img>` has `alt`. Run → FAIL.
- [ ] **Step 2:** Implement.
- [ ] **Step 3:** Run full CI locally (`check`, `lint`, `build`, `verify`, `npx @lhci/cli autorun`) → all PASS. Manual: keyboard-only walk of Home + Terral EN/PT; reduced-motion on; JS disabled; direct load of `/pt/work/terral` (no slash) on preview URL.
- [ ] **Step 4:** Commit `feat: add sitemap, robots and og image`. Open draft PR `redesign` → `master` titled "Portfolio redesign (S1 preview — do not merge)" with preview URL and checklist. Owner reviews S1 on preview.

---

**Order and parallelism:** 1 → 2 → 3 → 4. Task 5 (design) can start right after Task 1, in parallel with 2–4. Task 6 needs 5. Tasks 7, 8 need 6. Tasks 9 and 11 (owner-gated content) can start anytime; their page work needs 7. Task 10 needs 4 and 8. Task 12 last.
