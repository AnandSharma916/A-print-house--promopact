/**
 * emit-master-routes.mjs — rewrites the master (India) routes as thin wrappers
 * around the shared templates.
 *
 * The markup that used to live in each app/**\/page.jsx now lives in
 * components/templates and is rendered by both the master route and the
 * matching /[location] route. A master route keeps only what is genuinely its
 * own: its metadata. It passes no location, and the templates fall back to the
 * master hrefs and render no location sections, so the India site keeps
 * emitting exactly the markup it emitted before.
 *
 * Run: node scripts/emit-master-routes.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const META = join(ROOT, 'components', 'templates', '.metadata');

const pascal = (slug) =>
  slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('');

const ROUTES = [
  { dir: '', meta: 'home', component: 'HomePage', template: 'HomeTemplate', from: '@/components/templates/HomeTemplate' },
  { dir: 'about-us', meta: 'about-us', component: 'AboutUsPage', template: 'AboutTemplate', from: '@/components/templates/AboutTemplate' },
  { dir: 'contact-us', meta: 'contact-us', component: 'ContactUsPage', template: 'ContactTemplate', from: '@/components/templates/ContactTemplate' },
  ...[
    'premium-playing-cards',
    'promotional-playing-cards',
    'advertisement-playing-cards',
    'card-games',
    'corporate-playing-cards',
    'souvenir-playing-cards',
    'branded-playing-cards',
    'poker-cards',
    'educational-cards',
    'flash-cards',
  ].map((slug) => ({
    dir: slug,
    meta: slug,
    component: pascal(slug) + 'Page',
    template: pascal(slug) + 'Template',
    from: '@/components/templates/products/' + pascal(slug) + 'Template',
  })),
];

for (const route of ROUTES) {
  const masterRoute = '/' + route.dir;

  const file =
    '/* The India master route. Its markup lives in ' + route.template + ', shared\n' +
    '   with every /[location] route, and its metadata in data/master-metadata.js,\n' +
    '   shared with lib/seo.js. Passing no location is what makes this the master:\n' +
    '   the template falls back to the unprefixed hrefs and renders no location\n' +
    '   sections. */\n' +
    'import ' + route.template + " from '" + route.from + "';\n" +
    "import { MASTER_METADATA } from '@/data/master-metadata';\n" +
    '\n' +
    'export const metadata = MASTER_METADATA[' + JSON.stringify(masterRoute) + '];\n' +
    '\n' +
    'export default function ' + route.component + '() {\n' +
    '  return <' + route.template + ' />;\n' +
    '}\n';

  writeFileSync(join(ROOT, 'app', route.dir, 'page.jsx'), file, 'utf8');
  console.log('  ' + (route.dir || '(home)').padEnd(30) + ' -> ' + route.template);
}

console.log('rewrote ' + ROUTES.length + ' master routes as template wrappers');
