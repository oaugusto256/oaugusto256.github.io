# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal portfolio: a bilingual (EN/PT) Astro static site, live at https://oaugusto256.github.io/.

**Deploy:** `master` is production. Every push to `master` runs `.github/workflows/deploy.yml` (build → verify → `upload-pages-artifact` → `deploy-pages`); GitHub Pages source is "GitHub Actions" (switched from legacy branch deploy at cutover, 2026-11-23). Repo variables `PUBLIC_POSTHOG_KEY` / `PUBLIC_POSTHOG_HOST` feed the build; unset means no analytics. Work on a branch and open a PR into `master`; CI and a Cloudflare Worker branch preview run on the PR. Rollback: revert on `master` via PR (or set Pages back to legacy `master` `/`).

Design spec: `docs/superpowers/specs/2026-11-22-portfolio-redesign-design.md`. Plans: `docs/superpowers/plans/`.

## Development

```bash
npm install
npm run dev      # dev server
npm run check    # astro check (typecheck)
npm run lint     # eslint
npm run build    # static build to dist/
npm run verify   # scripts/verify-dist.mjs — asserts facts about dist/ (the test suite)
```

No unit or e2e tests in v1. `verify-dist.mjs` is the test mechanism: add assertions first (watch them fail), then implement.

## Architecture

- Astro + TypeScript strict, `output: 'static'`, `build.format: 'directory'`.
- Locales `en`, `pt` under `/en/` and `/pt/` (prefixed default locale). `/` redirects to `/en/`.
- `public/` — static files served as-is (favicons in `public/icons/`, résumé PDFs in `public/resume/`).
- `src/pages/` — routes. `src/layouts/`, `src/components/`, `src/i18n/` (typed UI strings), `src/content/` (case studies, MDX).

## Content rules

- Never invent metrics or claims. Every number on a page must appear in an owner-approved file in `docs/superpowers/evidence/`.
- Blockdaemon bundle claim wording: "more than 80%" only.
