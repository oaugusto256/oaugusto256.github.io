# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal portfolio, being rebuilt as a bilingual (EN/PT) Astro static site on branch `redesign`.

**Branch rule:** `master` is the live site (GitHub Pages, legacy "deploy from branch", serves the repo root). Until cutover (end of slice 2), never commit to, merge into, or push to `master`, and never change GitHub Pages settings. All redesign work happens on `redesign`; previews deploy from it via Cloudflare Pages.

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
