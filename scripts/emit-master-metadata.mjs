/**
 * emit-master-metadata.mjs — lifts the metadata objects out of the master page
 * files into data/master-metadata.js, verbatim.
 *
 * They are copied rather than retyped so the master routes keep emitting the
 * exact head they always emitted, keywords and all. That file is then the one
 * place the master metadata lives: the master routes re-export it, and
 * lib/seo.js derives every location's metadata from it.
 *
 * Reads the objects captured by scripts/build-templates.mjs.
 * Run: node scripts/emit-master-metadata.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const META = join(ROOT, 'components', 'templates', '.metadata');

const ROUTES = [
  ['/', 'home'],
  ['/about-us', 'about-us'],
  ['/contact-us', 'contact-us'],
  ['/premium-playing-cards', 'premium-playing-cards'],
  ['/promotional-playing-cards', 'promotional-playing-cards'],
  ['/advertisement-playing-cards', 'advertisement-playing-cards'],
  ['/card-games', 'card-games'],
  ['/corporate-playing-cards', 'corporate-playing-cards'],
  ['/souvenir-playing-cards', 'souvenir-playing-cards'],
  ['/branded-playing-cards', 'branded-playing-cards'],
  ['/poker-cards', 'poker-cards'],
  ['/educational-cards', 'educational-cards'],
  ['/flash-cards', 'flash-cards'],
];

let body = '';
for (const [route, file] of ROUTES) {
  const raw = readFileSync(join(META, file + '.txt'), 'utf8').trim();
  /* Keep the object literal exactly as the page declared it. */
  const object = raw.replace(/^export const metadata = /, '').replace(/;$/, '');
  const indented = object
    .split('\n')
    .map((line, i) => (i === 0 ? line : '  ' + line))
    .join('\n');
  body += '  ' + JSON.stringify(route) + ': ' + indented + ',\n';
}

const file =
  `/**
 * The master (India) pages' own metadata, exactly as each page declared it.
 *
 * Two consumers, one copy:
 *   - the master routes in app/ re-export their entry unchanged, so the India
 *     site's <head> is untouched by the Locations work;
 *   - lib/seo.js derives every location's title and description from it.
 *
 * Generated once by scripts/emit-master-metadata.mjs from the page files; it
 * is ordinary data now, so edit it here.
 */

export const MASTER_METADATA = {
` +
  body +
  `};
`;

writeFileSync(join(ROOT, 'data', 'master-metadata.js'), file, 'utf8');
console.log('wrote data/master-metadata.js with ' + ROUTES.length + ' entries');
