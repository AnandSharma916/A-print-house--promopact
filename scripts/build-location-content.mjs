/**
 * build-location-content.mjs — generates data/location-content.js straight from
 * a plain-text export of the client's location doc.
 *
 * The doc is the source of truth and this script is the only thing that writes
 * the copy, so no paragraph can be reworded on its way into the site. (An
 * earlier hand-assisted pass did reword 21 of them — "the clients" for
 * "clients", "Card Games manufacturers" for "card game manufacturers" — which
 * is exactly what this replaces.)
 *
 * Refresh the export (it needs no login), then run:
 *
 *   curl -sL "https://docs.google.com/document/d/1zxtGwZvixqm1L_xyNRdd9VYvmAofyCH0QMFUGmdpVBg/export?format=txt" -o data/location-doc.txt
 *   node scripts/build-location-content.mjs
 *
 * Doc shape: one tab per location; the tab name appears twice (tab label, then
 * page heading), then blocks of "<Product> <Role> in <Location>" followed by
 * that block's paragraphs. Paragraph counts vary by block on purpose — some
 * have three, some one — so nothing here pads or truncates.
 *
 * Run with --check to compare the existing data file against the doc instead
 * of rewriting it; it exits non-zero if any paragraph differs.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOC = process.argv.find((a) => a.endsWith('.txt')) || join(ROOT, 'data', 'location-doc.txt');
const CHECK_ONLY = process.argv.includes('--check');

/* Tab label -> slug. Every tab in the doc gets generated; whether a location is
   actually served is decided separately, in data/locations.js. */
const SLUG_FOR_TAB = {
  Nepal: 'nepal',
  'Delhi NCR': 'delhi-ncr',
  Hyderabad: 'hyderabad',
  Bangalore: 'bangalore',
  Mumbai: 'mumbai',
  Kolkata: 'kolkata',
  Chennai: 'chennai',
  Pune: 'pune',
  Ahmedabad: 'ahmedabad',
  Noida: 'noida',
};

/* Product heading in the doc -> the site's product slug. */
const SLUG_FOR_PRODUCT = {
  'Premium Playing Cards': 'premium-playing-cards',
  'Promotional Playing Cards': 'promotional-playing-cards',
  'Advertisement Playing Cards': 'advertisement-playing-cards',
  'Card Games': 'card-games',
  'Corporate Playing Cards': 'corporate-playing-cards',
  'Souvenir Playing Cards': 'souvenir-playing-cards',
  'Branded Playing Cards': 'branded-playing-cards',
  'Poker Cards': 'poker-cards',
};

const ROLE_KEY = {
  Manufacturer: 'manufacturer',
  Supplier: 'supplier',
  Exporter: 'exporter',
  Wholesaler: 'wholesaler',
};

if (!existsSync(DOC)) {
  console.error(
    'Missing ' + DOC + '\n' +
      'Export the doc first:\n' +
      '  curl -sL "https://docs.google.com/document/d/1zxtGwZvixqm1L_xyNRdd9VYvmAofyCH0QMFUGmdpVBg/export?format=txt" -o data/location-doc.txt'
  );
  process.exit(1);
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const HEADING = new RegExp(
  '^(' + Object.keys(SLUG_FOR_PRODUCT).map(esc).join('|') + ')\\s+(' +
    Object.keys(ROLE_KEY).join('|') + ')\\s+in\\s+(.+)$'
);

const lines = readFileSync(DOC, 'utf8')
  .replace(/^﻿/, '')
  .replace(/\r\n/g, '\n')
  .split('\n')
  .map((l) => l.trim());

const content = {};
let slug = null;
let block = null;
let headings = 0;

for (const line of lines) {
  if (!line) continue;

  if (SLUG_FOR_TAB[line]) {
    slug = SLUG_FOR_TAB[line];
    content[slug] = content[slug] || {};
    block = null;
    continue;
  }
  if (!slug) continue;

  const m = line.match(HEADING);
  if (m) {
    const product = SLUG_FOR_PRODUCT[m[1]];
    const role = ROLE_KEY[m[2]];
    content[slug][product] = content[slug][product] || {};
    content[slug][product][role] = [];
    block = content[slug][product][role];
    headings += 1;
    continue;
  }
  if (block) block.push(line);
}

/* Guard rails: the doc has always been ten tabs x eight products x four roles.
   If that stops being true, stop rather than emit a half-populated file. */
const tabs = Object.keys(content);
const expectedHeadings = tabs.length * Object.keys(SLUG_FOR_PRODUCT).length * 4;
if (headings !== expectedHeadings) {
  console.error(
    'Parsed ' + headings + ' headings but ' + tabs.length + ' tabs implies ' + expectedHeadings +
      '. The doc structure changed — check it before trusting this output.'
  );
  process.exit(1);
}
for (const tab of tabs) {
  for (const product of Object.values(SLUG_FOR_PRODUCT)) {
    for (const role of Object.values(ROLE_KEY)) {
      const paras = content[tab][product] && content[tab][product][role];
      if (!paras || !paras.length) {
        console.error('Empty block: ' + tab + ' / ' + product + ' / ' + role);
        process.exit(1);
      }
    }
  }
}

/* ---- emit or check ----------------------------------------------------- */

const q = (s) => JSON.stringify(s);
let body = '';
for (const [location, byProduct] of Object.entries(content)) {
  body += '  ' + q(location) + ': {\n';
  for (const [product, byRole] of Object.entries(byProduct)) {
    body += '    ' + q(product) + ': {\n';
    for (const [role, paras] of Object.entries(byRole)) {
      body += '      ' + role + ': [\n';
      for (const p of paras) body += '        ' + q(p) + ',\n';
      body += '      ],\n';
    }
    body += '    },\n';
  }
  body += '  },\n';
}

const header = `/**
 * Location-specific product copy, generated by scripts/build-location-content.mjs
 * straight from the client's location doc. Do not hand-edit — re-export the doc
 * and re-run the script, so the words on the site are always the doc's words.
 *
 * Shape:  LOCATION_CONTENT[locationSlug][productSlug][role] -> string[]
 * Roles:  manufacturer | supplier | exporter | wholesaler
 *
 * Every tab in the doc is generated here. Which locations the site actually
 * serves is a separate decision, in data/locations.js. The doc has no India
 * tab, so India has no entry and its product pages render no location sections.
 */

export const LOCATION_CONTENT = {
`;

const file = header + body + '};\n';
const target = join(ROOT, 'data', 'location-content.js');

if (CHECK_ONLY) {
  const current = existsSync(target) ? readFileSync(target, 'utf8') : '';
  if (current === file) {
    console.log('data/location-content.js matches the doc exactly');
    process.exit(0);
  }
  console.error('data/location-content.js differs from the doc — re-run without --check');
  process.exit(1);
}

writeFileSync(target, file, 'utf8');

console.log('wrote data/location-content.js from ' + DOC);
console.log('  tabs: ' + tabs.length + ' -> ' + tabs.join(', '));
let total = 0;
for (const tab of tabs) {
  let paras = 0;
  for (const byRole of Object.values(content[tab])) {
    for (const list of Object.values(byRole)) paras += list.length;
  }
  total += paras;
  console.log('  ' + tab.padEnd(12) + Object.keys(content[tab]).length + ' products, ' + paras + ' paragraphs');
}
console.log('  ' + headings + ' blocks, ' + total + ' paragraphs total');
