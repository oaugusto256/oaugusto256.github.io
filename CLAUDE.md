# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static portfolio site. No build step, no bundler, no package manager. Deploy = push to `master` (GitHub Pages auto-serves).

## Development

Open `index.html` directly in browser, or use any static server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

No lint, no test runner, no CI.

## Architecture

**Two pages:**
- `index.html` — landing page with bio, contact, and social links
- `projects.html` — project showcase, loads data dynamically

**Styling:**
- `assets/css/main.css` — compiled from SCSS (do not edit directly; edit `assets/sass/`)
- `assets/css/custom.css` — all custom overrides live here; prefer editing this over the SCSS

**Projects page data flow:**
- `assets/js/projects.js` — single script; two loaders run on page load
  - `loadProfessional()` — fetches `assets/data/professional-projects.json` and renders `.professional-grid`
  - `loadRepos()` — hits GitHub API (`/users/oaugusto256/repos`), filters via `EXCLUDED` array, scores by stars/recency/activity, fetches `package.json` per repo to derive tech tags via `TECH_MAP`

**Professional projects:** edit `assets/data/professional-projects.json`. Schema: `title`, `description`, `tags[]`, and either `url` or `note`.

**Icons:** Font Awesome 5 brand/solid icons loaded from local webfonts (`assets/webfonts/fa-brands-400.*`). Use `icon brands fa-<name>` or `icon solid fa-<name>` classes.

**Adding a social icon:** add `<li>` to the `ul.icons` in `index.html` following the existing pattern.
