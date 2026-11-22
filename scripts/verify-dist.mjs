// Dependency-free post-build assertions over dist/. Exits 1 listing all failures.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const failures = [];

function read(path) {
  const full = join(DIST, path);
  return existsSync(full) ? readFileSync(full, 'utf8') : '';
}
function exists(path) {
  return existsSync(join(DIST, path));
}
function assert(cond, msg) {
  if (!cond) failures.push(msg);
}

// Task 1: scaffold
assert(exists('en/index.html'), 'dist/en/index.html exists');
assert(read('en/index.html').includes('<html'), 'dist/en/index.html is an HTML document');

// Task 3: i18n routing + BaseLayout
{
  const en = read('en/index.html');
  const pt = read('pt/index.html');
  assert(en.includes('<html lang="en"'), 'en/index.html has <html lang="en">');
  assert(pt.includes('<html lang="pt-BR"'), 'pt/index.html has <html lang="pt-BR">');
  for (const [name, html] of [['en', en], ['pt', pt]]) {
    for (const h of ['en', 'pt', 'x-default']) {
      assert(html.includes(`hreflang="${h}"`), `${name}/index.html has hreflang="${h}"`);
    }
    assert(html.includes('rel="canonical"'), `${name}/index.html has canonical link`);
  }
  assert(read('index.html').includes('url=/en/'), 'index.html redirects to /en/');
}

// Task 4: header, language switcher, footer
function hasLink(html, attrs) {
  // true if some <a ...> tag contains every given attribute string
  return [...html.matchAll(/<a\b[^>]*>/g)].some(([tag]) => attrs.every((a) => tag.includes(a)));
}
{
  const pages = { en: read('en/index.html'), pt: read('pt/index.html') };
  assert(hasLink(pages.en, ['href="/pt/"', 'hreflang="pt"']), 'en home: language switcher → /pt/ with hreflang="pt"');
  assert(hasLink(pages.pt, ['href="/en/"', 'hreflang="en"']), 'pt home: language switcher → /en/ with hreflang="en"');
  for (const [loc, html] of Object.entries(pages)) {
    assert(hasLink(html, [`href="/${loc}/#work"`]), `${loc} home: nav link /${loc}/#work`);
    assert(hasLink(html, [`href="/${loc}/#contact"`]), `${loc} home: nav link /${loc}/#contact`);
    assert(hasLink(html, ['href="https://github.com/oaugusto256"']), `${loc} home: GitHub link`);
    assert(hasLink(html, ['href="https://www.linkedin.com/in/oaugusto256"']), `${loc} home: LinkedIn link`);
    assert(
      hasLink(html, [`href="/resume/otavio-silva-resume-${loc}.pdf"`, 'data-event="resume_download"']),
      `${loc} home: résumé link /resume/otavio-silva-resume-${loc}.pdf with data-event`,
    );
    assert(html.includes('aria-expanded="false"') && html.includes('aria-controls='), `${loc} home: mobile nav toggle button`);
    assert(html.includes('<footer'), `${loc} home: footer`);
  }
  assert(!pages.en.includes('resume-pt.pdf'), 'en home: no PT résumé link');
  assert(!pages.pt.includes('resume-en.pdf'), 'pt home: no EN résumé link');
}

// Task 6: tokens, fonts, global styles
function allFiles(dir = DIST, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) allFiles(full, out);
    else out.push(full);
  }
  return out;
}
{
  const css = allFiles()
    .filter((f) => f.endsWith('.css'))
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n');
  const html = read('en/index.html');
  const allCss = css + [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  assert(allCss.includes('prefers-reduced-motion'), 'built CSS handles prefers-reduced-motion');
  assert(allCss.includes('--color-accent'), 'built CSS defines design tokens');
  // .reveal may only be hidden (opacity:0 / visibility:hidden) under html.js
  const revealRules = [...allCss.matchAll(/([^{}]*\.reveal[^{}]*)\{([^}]*)\}/g)];
  const badReveal = revealRules.filter(([, sel, body]) => /opacity:\s*0|visibility:\s*hidden/.test(body) && !/\.js/.test(sel));
  assert(badReveal.length === 0, 'no rule hides .reveal outside html.js');
  assert(exists('fonts/geist-latin-wght-normal.woff2'), 'Geist woff2 self-hosted');
  assert(exists('fonts/geist-mono-latin-wght-normal.woff2'), 'Geist Mono woff2 self-hosted');
  assert(/<link[^>]+rel="preload"[^>]+geist-latin-wght-normal\.woff2/.test(html), 'primary font preloaded');
}

// Task 7: work collection + case study layout
{
  const en = read('en/work/terral/index.html');
  const pt = read('pt/work/terral/index.html');
  assert(exists('en/work/terral/index.html'), 'en/work/terral/index.html exists');
  assert(exists('pt/work/terral/index.html'), 'pt/work/terral/index.html exists');
  assert(hasLink(en, ['href="/pt/work/terral/"', 'hreflang="pt"']), 'en terral: language switcher → /pt/work/terral/');
  assert(hasLink(pt, ['href="/en/work/terral/"', 'hreflang="en"']), 'pt terral: language switcher → /en/work/terral/');
  assert(en.includes('<html lang="en"') && pt.includes('<html lang="pt-BR"'), 'terral pages have correct html lang');
  assert(/<link rel="alternate" hreflang="pt" href="https:\/\/oaugusto256\.github\.io\/pt\/work\/terral\/"/.test(en), 'en terral: hreflang pt alternate');
}

if (failures.length) {
  console.error(`verify-dist: ${failures.length} failure(s)`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('verify-dist: all assertions passed');
