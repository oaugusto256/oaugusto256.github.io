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

if (failures.length) {
  console.error(`verify-dist: ${failures.length} failure(s)`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('verify-dist: all assertions passed');
