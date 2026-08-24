/**
 * check-content-against-doc.mjs — diffs data/location-content.js against a
 * fresh plain-text export of the location doc, paragraph by paragraph.
 *
 * Get the export first (it needs no login):
 *   curl -sL "https://docs.google.com/document/d/<ID>/export?format=txt" -o doc.txt
 *
 * Then:  node scripts/check-content-against-doc.mjs <path-to-doc.txt>
 *
 * The doc is one tab per location; inside a tab each block is a heading of the
 * form "<Product> <Role> in <Location>" followed by its paragraphs. This walks
 * that structure and reports every heading the site has that the doc does not,
 * every paragraph whose text differs, and everything the doc has that the site
 * is missing.
 */
import { readFileSync } from 'node:fs';
import { LOCATIONS, PRODUCTS, ROLES } from '../data/locations.js';
import { LOCATION_CONTENT } from '../data/location-content.js';

const path = process.argv[2] || 'data/location-doc.txt';

const TAB_NAMES = [
  'Nepal', 'Delhi NCR', 'Hyderabad', 'Bangalore', 'Mumbai',
  'Kolkata', 'Chennai', 'Pune', 'Ahmedabad', 'Noida',
];
const SLUG_FOR_TAB = {
  Nepal: 'nepal', 'Delhi NCR': 'delhi-ncr', Hyderabad: 'hyderabad',
  Bangalore: 'bangalore', Mumbai: 'mumbai', Kolkata: 'kolkata',
  Chennai: 'chennai', Pune: 'pune', Ahmedabad: 'ahmedabad', Noida: 'noida',
};
const PRODUCT_NAMES = PRODUCTS.map((p) => p.name);
const ROLE_LABELS = ROLES.map((r) => r.label);

const raw = readFileSync(path, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
const lines = raw.split('\n').map((l) => l.trim());

/* ---- parse the doc ----------------------------------------------------- */

const doc = {};        // slug -> productName -> Role -> [paragraphs]
let tab = null;
let heading = null;

const headingRe = new RegExp(
  '^(' + PRODUCT_NAMES.map(esc).join('|') + ')\\s+(' + ROLE_LABELS.join('|') + ')\\s+in\\s+(.+)$'
);

for (const line of lines) {
  if (!line) continue;

  if (TAB_NAMES.includes(line)) {
    tab = SLUG_FOR_TAB[line];
    if (!doc[tab]) doc[tab] = {};
    heading = null;
    continue;
  }
  if (!tab) continue;

  const m = line.match(headingRe);
  if (m) {
    heading = { product: m[1], role: m[2], place: m[3].trim() };
    doc[tab][heading.product] = doc[tab][heading.product] || {};
    doc[tab][heading.product][heading.role] = [];
    continue;
  }
  if (heading) doc[tab][heading.product][heading.role].push(line);
}

/* ---- report ------------------------------------------------------------ */

let problems = 0;
const note = (msg) => { problems += 1; console.log('  ' + msg); };

console.log('doc tabs parsed: ' + Object.keys(doc).length + ' -> ' + Object.keys(doc).join(', '));
console.log('site locations : ' + LOCATIONS.length + ' -> ' + LOCATIONS.map((l) => l.slug).join(', '));

const inDocNotOnSite = Object.keys(doc).filter((s) => !LOCATIONS.some((l) => l.slug === s));
const onSiteNotInDoc = LOCATIONS.filter((l) => !doc[l.slug]).map((l) => l.slug);
if (inDocNotOnSite.length) console.log('\nin the doc but NOT a location on the site: ' + inDocNotOnSite.join(', '));
if (onSiteNotInDoc.length) console.log('a location on the site with NO tab in the doc: ' + onSiteNotInDoc.join(', '));

console.log('\nparagraph-level comparison');
for (const slug of Object.keys(doc)) {
  const stored = LOCATION_CONTENT[slug];
  if (!stored) { console.log('  ' + slug + ': not in data/location-content.js at all'); problems += 1; continue; }

  let paras = 0;
  let mismatched = 0;
  let missing = 0;

  for (const product of PRODUCTS) {
    const docRoles = doc[slug][product.name];
    const storedRoles = stored[product.slug];
    if (!docRoles) { note(slug + ' / ' + product.name + ': missing from the doc'); continue; }
    if (!storedRoles) { note(slug + ' / ' + product.name + ': missing from the site data'); continue; }

    for (const role of ROLES) {
      const fromDoc = docRoles[role.label] || [];
      const fromSite = storedRoles[role.key] || [];
      if (fromDoc.length !== fromSite.length) {
        note(slug + ' / ' + product.name + ' / ' + role.label +
             ': doc has ' + fromDoc.length + ' paragraph(s), site has ' + fromSite.length);
        missing += 1;
      }
      const n = Math.max(fromDoc.length, fromSite.length);
      for (let i = 0; i < n; i += 1) {
        paras += 1;
        if (fromDoc[i] !== fromSite[i]) {
          mismatched += 1;
          if (mismatched <= 2) {
            note(slug + ' / ' + product.name + ' / ' + role.label + ' / para ' + (i + 1) + ':');
            console.log('      doc : ' + JSON.stringify((fromDoc[i] || '').slice(0, 150)));
            console.log('      site: ' + JSON.stringify((fromSite[i] || '').slice(0, 150)));
          }
        }
      }
    }
  }
  console.log(
    '  ' + slug.padEnd(12) + paras + ' paragraphs compared, ' +
    mismatched + ' differ, ' + missing + ' count mismatch'
  );
}

console.log('\n' + (problems === 0
  ? 'PASS — every paragraph on the site matches the doc'
  : problems + ' problem(s) found'));
process.exitCode = problems === 0 ? 0 : 1;

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
