// Dependency-free post-build assertions over dist/. Exits 1 listing all failures.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
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

// Numbers are compared as whole tokens, not substrings: "33" must not pass because "1,330" is in evidence.
function numberTokens(text) {
  return [...new Set((text.match(/\d[\d.,]*%?\+?/g) || []).map((n) => n.replace(/[.,]+$/, '')))];
}
function missingNumbers(text, evidence) {
  const allowed = new Set(numberTokens(evidence));
  return numberTokens(text).filter((n) => !allowed.has(n));
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

// Task 11: bilingual résumé PDFs
for (const loc of ['en', 'pt']) {
  const pdf = `resume/otavio-silva-resume-${loc}.pdf`;
  const size = exists(pdf) ? statSync(join(DIST, pdf)).size : 0;
  assert(size > 10 * 1024, `${pdf} exists and is > 10 KB (got ${size} bytes)`);
  if (size) assert(read(pdf).startsWith('%PDF-'), `${pdf} is a PDF`);
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
  // Hero diagram: lines draw in and nodes light up, only when motion is allowed.
  assert(/@keyframes\s+draw\b[^}]*stroke-dashoffset/.test(allCss), 'hero edge draw-in keyframes animate stroke-dashoffset');
  assert(/@keyframes\s+light-5\b/.test(allCss), 'hero nodes light-up keyframes exist (6 nodes)');
  // Every rule that animates the hero must sit inside a no-preference media block.
  const motionRanges = [...allCss.matchAll(/@media[^{]*prefers-reduced-motion:\s*no-preference[^{]*\{/g)].map((m) => {
    let depth = 1;
    let i = m.index + m[0].length;
    for (; i < allCss.length && depth > 0; i++) depth += allCss[i] === '{' ? 1 : allCss[i] === '}' ? -1 : 0;
    return [m.index, i];
  });
  const animDecls = [...allCss.matchAll(/animation(?:-name)?:[^;}]*\b(draw|light-\d)\b/g)];
  const unguarded = animDecls.filter((m) => !motionRanges.some(([a, b]) => m.index > a && m.index < b));
  assert(animDecls.length >= 7 && unguarded.length === 0, 'hero animations (edge + 6 nodes) only under prefers-reduced-motion: no-preference');
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

// Task 8: home sections
for (const loc of ['en', 'pt']) {
  const html = read(`${loc}/index.html`);
  assert(html.includes('Product Engineer'), `${loc} home: "Product Engineer"`);
  assert(html.includes('Florianópolis'), `${loc} home: "Florianópolis"`);
  for (const id of ['work', 'philosophy', 'focus', 'contact']) {
    assert(html.includes(`id="${id}"`), `${loc} home: section #${id}`);
  }
  assert(
    hasLink(html, [`href="/${loc}/work/terral/"`, 'data-event="project_card_click"', 'data-project="terral"']),
    `${loc} home: Terral card → /${loc}/work/terral/ with data-event`,
  );
  assert(hasLink(html, ['href="mailto:tavioalves@gmail.com"']), `${loc} home: mailto link`);
  assert(html.includes('Blockdaemon') && html.includes('Mercado'), `${loc} home: Blockdaemon and Mercado Envios cards`);
}

// Task 10: analytics — loads only when PUBLIC_POSTHOG_KEY is set at build time
{
  const htmlFiles = allFiles().filter((f) => f.endsWith('.html'));
  const jsFiles = allFiles().filter((f) => f.endsWith('.js'));
  // Match the loader script, not the word (case studies may name PostHog in prose).
  const htmlMentions = htmlFiles.filter((f) => /PostHog\.astro_astro_type_script|posthog-js|i\.posthog\.com/i.test(readFileSync(f, 'utf8')));
  if (process.env.PUBLIC_POSTHOG_KEY) {
    const home = read('en/index.html');
    assert(htmlMentions.length === htmlFiles.length - 1, 'with key: every page (except / redirect) loads analytics');
    assert(/persistence:\s*["'`]memory["'`]/.test(jsFiles.map((f) => readFileSync(f, 'utf8')).join('\n') + home), 'with key: memory persistence');
  } else {
    assert(htmlMentions.length === 0, `without key: no HTML references posthog (found in ${htmlMentions.length})`);
    assert(!jsFiles.some((f) => /posthog/i.test(readFileSync(f, 'utf8'))), 'without key: no JS bundle contains posthog');
  }
}

// Task 12: SEO + a11y basics
{
  assert(exists('sitemap-index.xml'), 'sitemap-index.xml exists');
  assert(read('robots.txt').includes('https://oaugusto256.github.io/sitemap-index.xml'), 'robots.txt references sitemap');
  assert(exists('og/default.png'), 'og/default.png exists');
  const pages = allFiles()
    .filter((f) => f.endsWith('.html'))
    .map((f) => f.slice(DIST.length + 1))
    .filter((f) => f !== 'index.html'); // root is a redirect stub
  for (const page of pages) {
    const html = read(page);
    assert((html.match(/<h1[\s>]/g) || []).length === 1, `${page}: exactly one <h1>`);
    assert(html.includes('rel="canonical"'), `${page}: canonical`);
    assert(html.includes('property="og:title"'), `${page}: og:title`);
    assert(/property="og:image" content="https:\/\/oaugusto256\.github\.io\//.test(html), `${page}: absolute og:image`);
    const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
    assert(imgs.every((tag) => /\salt="/.test(tag)), `${page}: every <img> has alt`);
  }
}

// Task 9: Terral screenshots (desktop + mobile) on both case study pages
for (const loc of ['en', 'pt']) {
  const html = read(`${loc}/work/terral/index.html`);
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  assert(imgs.length >= 4, `${loc} terral: at least 4 images (cover + desktop detail + 2 mobile), found ${imgs.length}`);
  assert(imgs.some((t) => /mobile/i.test(t)), `${loc} terral: includes a mobile screenshot`);
  assert(!html.includes('screenshot pending'), `${loc} terral: placeholder cover removed`);
}

// Every number in page sources must be a whole token in an owner-approved evidence file.
const ROOT = join(DIST, '..');
function mdxProse(src) {
  return src
    .replace(/^cover:.*$/m, '') // asset path, not a claim
    .replace(/^import .*$/gm, '') // MDX imports
    .replace(/<[^>]+>/g, ' '); // JSX/HTML tags and their attributes (image widths etc.)
}
function tsStrings(src) {
  return [...src.matchAll(/(['"`])((?:\\.|(?!\1).)*)\1/g)].map((m) => m[2]).join(' ');
}
const EVIDENCE_MAP = [
  { label: 'terral', sources: ['src/content/work/terral/en.mdx', 'src/content/work/terral/pt.mdx'], evidence: 'docs/superpowers/evidence/terral.md' },
  { label: 'ui strings', sources: ['src/i18n/en.ts', 'src/i18n/pt.ts'], evidence: 'docs/superpowers/evidence/home.md' },
];
function checkNumbers(label, sources, evidenceFile) {
  const evPath = join(ROOT, evidenceFile);
  const present = sources.filter((s) => existsSync(join(ROOT, s)));
  if (!existsSync(evPath)) {
    assert(present.length === 0, `${label}: ${evidenceFile} missing but sources exist`);
    return;
  }
  assert(present.length === sources.length, `${label}: missing sources ${sources.filter((s) => !present.includes(s)).join(', ')}`);
  const evidence = readFileSync(evPath, 'utf8');
  for (const s of present) {
    const raw = readFileSync(join(ROOT, s), 'utf8');
    const text = s.endsWith('.mdx') ? mdxProse(raw) : s.endsWith('.ts') ? tsStrings(raw) : raw;
    const missing = missingNumbers(text, evidence);
    assert(missing.length === 0, `${label} (${s}): numbers not in ${evidenceFile}: ${missing.join(', ')}`);
  }
}
for (const { label, sources, evidence } of EVIDENCE_MAP) checkNumbers(label, sources, evidence);

// Site-wide: retired claims and channels must not appear on any page, in either locale.
{
  for (const f of allFiles().filter((f) => f.endsWith('.html'))) {
    const page = f.slice(DIST.length + 1);
    const html = readFileSync(f, 'utf8');
    for (const banned of ['82%', '13.4', '807', 'Senior Frontend Engineer', 'wa.me', 'gitlab.com', 'stackoverflow.com']) {
      assert(!html.includes(banned), `${page}: must not contain "${banned}"`);
    }
    for (const m of html.matchAll(/80%/g)) {
      const before = html.slice(Math.max(0, m.index - 12), m.index);
      assert(/more than\s*$|mais de\s*$/.test(before), `${page}: "80%" must follow "more than"/"mais de" (got "${before}80%")`);
    }
  }
}

if (failures.length) {
  console.error(`verify-dist: ${failures.length} failure(s)`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('verify-dist: all assertions passed');
