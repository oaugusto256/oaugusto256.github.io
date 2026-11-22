// Dependency-free post-build assertions over dist/. Exits 1 listing all failures.
import { readFileSync, existsSync } from 'node:fs';
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

if (failures.length) {
  console.error(`verify-dist: ${failures.length} failure(s)`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('verify-dist: all assertions passed');
