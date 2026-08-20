/**
 * verify-fidelity.mjs — compares each rendered Next route against the legacy
 * HTML it was converted from.
 *
 * Checks the two things a markup port most easily loses: visible text, and the
 * set of CSS classes the stylesheet and the animation engines hook into. Run
 * the dev server first, then: node scripts/verify-fidelity.mjs
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE_URL || 'http://localhost:3000';

const routeFor = (f) => (f === 'index.html' ? '/' : '/' + f.replace(/\.html$/, ''));

/* Strip everything that is not rendered prose. */
function visibleText(html) {
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [, html])[1];
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    /* React escapes apostrophes as &#x27;, so decode hex as well as decimal. */
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function classSet(html) {
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [, html])[1]
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ');
  const out = new Set();
  for (const m of body.matchAll(/\sclass=["']([^"']+)["']/gi)) {
    m[1].split(/\s+/).filter(Boolean).forEach((c) => out.add(c));
  }
  return out;
}

/**
 * Image sources, normalised to the path they resolve to from the site root.
 *
 * The legacy pages all sat at the root, so their relative "img/x.avif" and a
 * converted "/img/x.avif" name the same file. On a nested route they would
 * not — so the Next side is additionally required to be root-absolute below.
 */
function imgSet(html) {
  const out = new Set();
  for (const m of html.matchAll(/<img[^>]*\ssrc=["']([^"']+)["']/gi)) {
    out.add('/' + m[1].replace(/^\.?\/+/, ''));
  }
  return out;
}

/* An asset path that is not root-absolute 404s on every nested route. */
function relativeAssets(html) {
  const bad = new Set();
  for (const m of html.matchAll(/\s(?:src|poster)=["']([^"']+)["']/gi)) {
    const v = m[1];
    if (/^(https?:)?\/\//i.test(v) || /^(\/|data:|blob:)/i.test(v)) continue;
    bad.add(v);
  }
  return [...bad];
}

/* Compare word multisets so reordering shows up but whitespace does not. */
function missingWords(fromText, inText) {
  const counts = new Map();
  for (const w of inText.split(' ')) counts.set(w, (counts.get(w) || 0) + 1);
  const missing = [];
  for (const w of fromText.split(' ')) {
    const n = counts.get(w) || 0;
    if (n === 0) missing.push(w);
    else counts.set(w, n - 1);
  }
  return missing;
}

const files = readdirSync(join(ROOT, 'legacy')).filter((f) => f.endsWith('.html')).sort();
let failures = 0;

for (const file of files) {
  const route = routeFor(file);
  const legacy = readFileSync(join(ROOT, 'legacy', file), 'utf8');

  const res = await fetch(BASE + route);
  if (!res.ok) {
    console.log(`FAIL ${route} — HTTP ${res.status}`);
    failures++;
    continue;
  }
  const next = await res.text();

  const missingText = missingWords(visibleText(legacy), visibleText(next));
  const legacyClasses = classSet(legacy);
  const nextClasses = classSet(next);
  const missingClasses = [...legacyClasses].filter((c) => !nextClasses.has(c));
  const legacyImgs = imgSet(legacy);
  const nextImgs = imgSet(next);
  const missingImgs = [...legacyImgs].filter((s) => !nextImgs.has(s));

  const relative = relativeAssets(next);
  /* Every referenced asset must actually exist under public/. */
  const absent = [...nextImgs].filter(
    (p) => !existsSync(join(ROOT, 'public', decodeURIComponent(p)))
  );

  const ok =
    !missingText.length && !missingClasses.length && !missingImgs.length &&
    !relative.length && !absent.length;
  if (!ok) failures++;

  console.log(
    `${ok ? 'ok  ' : 'FAIL'} ${route.padEnd(30)} ` +
      `text -${missingText.length}  classes -${missingClasses.length}  ` +
      `imgs -${missingImgs.length}  relative ${relative.length}  absent ${absent.length}`
  );
  if (missingText.length) console.log(`       text: ${missingText.slice(0, 25).join(' ')}`);
  if (missingClasses.length) console.log(`       classes: ${missingClasses.slice(0, 25).join(' ')}`);
  if (missingImgs.length) console.log(`       imgs: ${missingImgs.slice(0, 10).join(' ')}`);
  if (relative.length) console.log(`       relative: ${relative.slice(0, 10).join(' ')}`);
  if (absent.length) console.log(`       absent from public/: ${absent.slice(0, 10).join(' ')}`);
}

console.log(failures ? `\n${failures} route(s) differ` : '\nAll routes match the legacy markup');
process.exit(failures ? 1 : 0);
