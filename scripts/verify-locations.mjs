/**
 * verify-locations.mjs — proves the Locations system against the prerendered
 * HTML in .next/server/app. Run `next build` first, then:
 *
 *   node scripts/verify-locations.mjs
 *
 * What it asserts, in the order the acceptance checklist asks for it:
 *
 *   1. every location has a home, an about-us, a contact-us and all eight
 *      product pages, and nothing else claims to be a location;
 *   2. a location product page is the master product page — byte for byte —
 *      once its location links are unwound and its four location sections are
 *      lifted out. That is the identical-UI requirement stated as a test: same
 *      markup means same layout, same images, same classes, same animation
 *      hooks, because they are literally the same bytes;
 *   3. the same for home / about-us / contact-us, which carry no location copy
 *      at all and so must match the master exactly;
 *   4. each location's product sections carry that location's own words and no
 *      other location's;
 *   5. the footer Locations column is on every page, master pages included;
 *   6. the phrase "market area" appears nowhere in any rendered page.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCATIONS, PRODUCTS } from '../data/locations.js';
import { LOCATION_CONTENT } from '../data/location-content.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, '.next', 'server', 'app');

let failures = 0;
let checks = 0;

function check(ok, label, detail) {
  checks += 1;
  if (!ok) {
    failures += 1;
    console.log('  FAIL  ' + label + (detail ? '\n          ' + detail : ''));
  }
  return ok;
}

function html(route) {
  const file = join(OUT, (route === '/' ? 'index' : route.replace(/^\//, '')) + '.html');
  return existsSync(file) ? readFileSync(file, 'utf8') : null;
}

/* Next serialises the whole tree again into the flight payload; comparing it
   would just echo whatever the markup comparison already covers. */
const stripFlight = (h) => h.replace(/<script>self\.__next_f[\s\S]*?<\/script>/g, '');
const bodyOf = (h) => stripFlight(h).slice(stripFlight(h).indexOf('<body'));

/**
 * Remove the location sections and hand back both halves. Each role is its own
 * full-width section so the backgrounds can alternate, so there are four to
 * lift out; they are marked with data-location-section for exactly this.
 */
function splitRoleSections(body) {
  let rest = body;
  const sections = [];
  for (;;) {
    const marker = rest.indexOf('data-location-section=""');
    if (marker === -1) break;
    const open = rest.lastIndexOf('<section', marker);
    const close = rest.indexOf('</section>', marker) + '</section>'.length;
    sections.push(rest.slice(open, close));
    rest = rest.slice(0, open) + rest.slice(close);
  }
  return { rest, sections: sections.length ? sections.join('') : null };
}

/**
 * Lift the Locations footer column out. Its links point at location homes on
 * every page — they are not template links and must not be unwound with them.
 */
function splitLocationsColumn(body) {
  const open = body.indexOf('<div class="ftl-col"><h4>Locations</h4>');
  if (open === -1) return { rest: body, column: null };
  const close = body.indexOf('</ul></div>', open) + '</ul></div>'.length;
  return { rest: body.slice(0, open) + body.slice(close), column: body.slice(open, close) };
}

/** Turn a location's links back into the master links they were rewritten from. */
function unwindLinks(body, slug) {
  let out = body;
  for (const product of PRODUCTS) {
    out = out.split('href="/' + slug + '/products/' + product.slug + '"').join('href="' + product.master + '"');
  }
  out = out.split('href="/' + slug + '/about-us"').join('href="/about-us"');
  out = out.split('href="/' + slug + '/contact-us"').join('href="/contact-us"');
  out = out.replace(new RegExp('href="/' + slug + '(#[^"]*)"', 'g'), 'href="/$1"');
  out = out.split('href="/' + slug + '"').join('href="/"');
  return out;
}

console.log('Locations verification\n');

/* ---- 1. the routes exist ---------------------------------------------- */

console.log('routes');
/* Eleven: the doc's ten tabs plus India, which is the master and has no tab. */
check(LOCATIONS.length === 11, 'exactly 11 locations', 'found ' + LOCATIONS.length);
for (const location of LOCATIONS) {
  const pages = [
    '/' + location.slug,
    '/' + location.slug + '/about-us',
    '/' + location.slug + '/contact-us',
    ...PRODUCTS.map((p) => '/' + location.slug + '/products/' + p.slug),
  ];
  const missing = pages.filter((r) => !html(r));
  check(missing.length === 0, location.slug + ' has all 11 pages', missing.join(', '));
}
console.log('  ' + LOCATIONS.length + ' locations x (home + about + contact + ' + PRODUCTS.length + ' products)');

/* ---- 2 & 3. identical markup ------------------------------------------- */

console.log('\nmarkup identical to master');
for (const location of LOCATIONS) {
  const flat = [
    ['/' + location.slug, '/'],
    ['/' + location.slug + '/about-us', '/about-us'],
    ['/' + location.slug + '/contact-us', '/contact-us'],
    ...PRODUCTS.map((p) => ['/' + location.slug + '/products/' + p.slug, p.master]),
  ];
  let same = 0;
  for (const [locationRoute, masterRoute] of flat) {
    const locationHtml = html(locationRoute);
    const masterHtml = html(masterRoute);
    if (!locationHtml || !masterHtml) continue;

    const locationSplit = splitLocationsColumn(splitRoleSections(bodyOf(locationHtml)).rest);
    const masterSplit = splitLocationsColumn(bodyOf(masterHtml));
    const unwound = unwindLinks(locationSplit.rest, location.slug);

    if (check(unwound === masterSplit.rest, locationRoute + ' matches ' + masterRoute)) same += 1;

    /* Same column everywhere, bar the marker on the location you are viewing. */
    const expectedColumn = masterSplit.column.replace(
      '<a href="/' + location.slug + '"',
      '<a aria-current="page" href="/' + location.slug + '"'
    );
    check(
      locationSplit.column === expectedColumn,
      locationRoute + ' footer Locations column matches the master column'
    );
  }
  console.log('  ' + location.slug.padEnd(12) + same + '/' + flat.length + ' pages byte-identical to master');
}

/* ---- 4. the right words in the right place ----------------------------- */

console.log('\ncontent mapping');
for (const location of LOCATIONS) {
  const supplied = LOCATION_CONTENT[location.slug];
  let withSections = 0;
  let correct = 0;
  for (const product of PRODUCTS) {
    const page = html('/' + location.slug + '/products/' + product.slug);
    if (!page) continue;
    const { sections } = splitRoleSections(bodyOf(page));
    if (!sections) continue;
    withSections += 1;

    const own = supplied && supplied[product.slug];
    const ownFirst = own && own.manufacturer && own.manufacturer[0];
    const hasOwn = Boolean(ownFirst) && sections.includes(escapeHtml(ownFirst));
    /* Nobody else's copy may appear on this page. */
    const foreign = LOCATIONS.filter((l) => l.slug !== location.slug).find((other) => {
      const theirs = LOCATION_CONTENT[other.slug] && LOCATION_CONTENT[other.slug][product.slug];
      const first = theirs && theirs.manufacturer && theirs.manufacturer[0];
      return first && sections.includes(escapeHtml(first));
    });
    if (check(hasOwn && !foreign, location.slug + '/' + product.slug + ' carries its own copy',
      foreign ? 'found ' + foreign.slug + ' copy' : 'own copy missing')) correct += 1;

    check(
      sections.includes(product.name + ' Manufacturer in ' + location.name),
      location.slug + '/' + product.slug + ' has the four role headings'
    );
  }
  const expected = supplied ? PRODUCTS.length : 0;
  console.log(
    '  ' + location.slug.padEnd(12) +
    withSections + '/' + PRODUCTS.length + ' product pages carry location sections' +
    (withSections === 0 ? '   (no copy in the content doc)' : '   ' + correct + ' verified')
  );
  check(withSections === expected, location.slug + ' section coverage matches the doc',
    'expected ' + expected + ', rendered ' + withSections);
}

/* ---- 5 & 6. footer, and the retired term ------------------------------- */

console.log('\nfooter + terminology');
const everyRoute = [
  '/', '/about-us', '/contact-us',
  ...PRODUCTS.map((p) => p.master), '/educational-cards', '/flash-cards',
  ...LOCATIONS.flatMap((l) => [
    '/' + l.slug, '/' + l.slug + '/about-us', '/' + l.slug + '/contact-us',
    ...PRODUCTS.map((p) => '/' + l.slug + '/products/' + p.slug),
  ]),
];
let footers = 0;
let marketArea = 0;
for (const route of everyRoute) {
  const page = html(route);
  if (!page) continue;
  if (page.includes('<h4>Locations</h4>')) footers += 1;
  else check(false, route + ' has the Locations footer column');
  if (/market\s*area/i.test(page)) {
    marketArea += 1;
    check(false, route + ' still says "market area"');
  }
}
console.log('  Locations column on ' + footers + '/' + everyRoute.length + ' pages');
console.log('  pages mentioning "market area": ' + marketArea);

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

console.log('\n' + (failures === 0
  ? 'PASS — ' + checks + ' checks'
  : 'FAIL — ' + failures + ' of ' + checks + ' checks failed'));
process.exit(failures === 0 ? 0 : 1);
