/**
 * build-templates.mjs — turns the master (India) page files into the shared
 * page templates that both the master routes and the /[location] routes render.
 *
 * The templates are the master markup, unchanged, with three seams cut into it:
 *
 *   1. every internal href goes through path(href, location), so one copy of
 *      the markup serves '/poker-cards' and '/nepal/products/poker-cards';
 *   2. a <FooterLocations /> column is added inside .ft-links-cols;
 *   3. product pages get <LocationProductSections /> after their introduction
 *      section — the four doc-supplied blocks, and the only visible difference
 *      between one location and another.
 *
 * Nothing else is touched: no class name, no image, no attribute, no ordering.
 * With location = null a template emits what the master page emitted before
 * this script ran, which scripts/verify-templates.mjs asserts.
 *
 * Input  : .templates-src/**\/page.jsx  (pristine copies of the master pages)
 * Output : components/templates/**
 *
 * Run: node scripts/build-templates.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, '.templates-src');
const OUT = join(ROOT, 'components', 'templates');

/* Product routes a location reproduces. Order follows data/locations.js. */
const LOCATION_PRODUCTS = [
  'premium-playing-cards',
  'promotional-playing-cards',
  'advertisement-playing-cards',
  'card-games',
  'corporate-playing-cards',
  'souvenir-playing-cards',
  'branded-playing-cards',
  'poker-cards',
];

/* Master-only product routes: no location page, so they only gain the footer. */
const MASTER_ONLY = ['educational-cards', 'flash-cards'];

const pascal = (slug) =>
  slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('');

const PAGES = [
  { route: '/', dir: '', name: 'HomeTemplate', out: 'HomeTemplate.jsx', product: null },
  { route: '/about-us', dir: 'about-us', name: 'AboutTemplate', out: 'AboutTemplate.jsx', product: null },
  { route: '/contact-us', dir: 'contact-us', name: 'ContactTemplate', out: 'ContactTemplate.jsx', product: null },
  ...LOCATION_PRODUCTS.map((slug) => ({
    route: '/' + slug,
    dir: slug,
    name: pascal(slug) + 'Template',
    out: 'products/' + pascal(slug) + 'Template.jsx',
    product: slug,
  })),
  ...MASTER_ONLY.map((slug) => ({
    route: '/' + slug,
    dir: slug,
    name: pascal(slug) + 'Template',
    out: 'products/' + pascal(slug) + 'Template.jsx',
    product: null,
    masterOnly: true,
  })),
];

/* ---------------------------------------------------------------- helpers */

/** Index of the closing tag that matches the element opened at openIdx. */
function endOfElement(src, openIdx, tag) {
  const re = new RegExp('<' + tag + '\\b|</' + tag + '>', 'g');
  re.lastIndex = openIdx;
  let depth = 0;
  let m;
  while ((m = re.exec(src))) {
    if (m[0][1] === '/') {
      depth -= 1;
      if (depth === 0) return m.index;
    } else {
      depth += 1;
    }
  }
  throw new Error('unbalanced <' + tag + '> from index ' + openIdx);
}

/** Leading whitespace of the line containing idx. */
function indentAt(src, idx) {
  const lineStart = src.lastIndexOf('\n', idx) + 1;
  return src.slice(lineStart, idx).match(/^\s*/)[0];
}

/* ------------------------------------------------------------- transforms */

function stripMetadata(src) {
  const m = src.match(/\nexport const metadata = \{[\s\S]*?\n\};\n/);
  if (!m) return { src, metadata: null };
  return { src: src.replace(m[0], '\n'), metadata: m[0].trim() };
}

/* './poker-cards.css' -> '@/app/poker-cards/poker-cards.css' so the template
   pulls in exactly the stylesheet its master route always pulled in. */
function rewriteCssImports(src, dir) {
  return src.replace(/^import '(\.[^']+\.css)';$/gm, (line, rel) => {
    const resolved = rel.startsWith('./')
      ? '@/app/' + (dir ? dir + '/' : '') + rel.slice(2)
      : '@/app/' + rel.replace(/^\.\.\//, '');
    return "import '" + resolved + "';";
  });
}

/** href={"/x"} -> href={path("/x", location)}. Anchors and externals untouched. */
function rewriteHrefs(src) {
  let count = 0;
  const out = src.replace(/href=\{"(\/[^"]*)"\}/g, (_, href) => {
    count += 1;
    return 'href={path(' + JSON.stringify(href) + ', location)}';
  });
  return { src: out, count };
}

function injectFooterLocations(src, withLocation) {
  const openIdx = src.indexOf('<div className={"ft-links-cols"}>');
  if (openIdx === -1) throw new Error('no .ft-links-cols in page');
  const closeIdx = endOfElement(src, openIdx, 'div');
  const outerIndent = indentAt(src, openIdx);
  const indent = outerIndent + '  ';
  const tag = withLocation ? '<FooterLocations location={location} />' : '<FooterLocations />';
  const closeLineStart = src.lastIndexOf('\n', closeIdx) + 1;
  return src.slice(0, closeLineStart) + indent + tag + '\n' + src.slice(closeLineStart);
}

function injectRoleSections(src, productSlug) {
  const commentIdx = src.search(/\{\/\* Introduction Section[^*]*\*\/\}/);
  if (commentIdx === -1) throw new Error('no introduction section comment');
  const openIdx = src.indexOf('<section', commentIdx);
  const closeIdx = endOfElement(src, openIdx, 'section');
  const after = src.indexOf('\n', closeIdx) + 1;
  const indent = indentAt(src, openIdx);
  const tag =
    indent + '<LocationProductSections location={location} product={' +
    JSON.stringify(productSlug) + '} />\n';
  return src.slice(0, after) + tag + src.slice(after);
}

function renameComponent(src, name, withLocation) {
  const m = src.match(/export default function (\w+)\(\) \{/);
  if (!m) throw new Error('no default export function');
  const params = withLocation ? '{ location = null }' : '';
  return src.replace(m[0], 'export default function ' + name + '(' + params + ') {');
}

function addImports(src, lines) {
  if (!lines.length) return src;
  const lastImport = src.lastIndexOf('\nimport ');
  const end = src.indexOf('\n', lastImport + 1);
  return src.slice(0, end + 1) + lines.join('\n') + '\n' + src.slice(end + 1);
}

/* ------------------------------------------------------------------- main */

if (!existsSync(SRC)) {
  console.error('Missing ' + SRC + ' — run scripts/snapshot-master.mjs first.');
  process.exit(1);
}

mkdirSync(join(OUT, 'products'), { recursive: true });
mkdirSync(join(OUT, '.metadata'), { recursive: true });

const report = [];

for (const page of PAGES) {
  const file = join(SRC, page.dir, 'page.jsx');
  let src = readFileSync(file, 'utf8');

  const stripped = stripMetadata(src);
  src = stripped.src;

  src = rewriteCssImports(src, page.dir);

  const imports = [];
  let hrefCount = 0;

  if (page.masterOnly) {
    src = renameComponent(src, page.name, false);
    src = injectFooterLocations(src, false);
    imports.push("import FooterLocations from '@/components/FooterLocations';");
  } else {
    const rewritten = rewriteHrefs(src);
    src = rewritten.src;
    hrefCount = rewritten.count;
    src = renameComponent(src, page.name, true);
    src = injectFooterLocations(src, true);
    imports.push("import { path } from '@/lib/locations';");
    imports.push("import FooterLocations from '@/components/FooterLocations';");
    if (page.product) {
      src = injectRoleSections(src, page.product);
      imports.push("import LocationProductSections from '@/components/LocationProductSections';");
    }
  }

  src = addImports(src, imports);

  const banner =
    '/**\n' +
    ' * ' + page.name + ' — the master ' + page.route + ' markup, shared by the master\n' +
    ' * route and every /[location] route.\n' +
    ' *\n' +
    ' * Generated by scripts/build-templates.mjs from\n' +
    ' * .templates-src/' + (page.dir || '') + '/page.jsx — edit that file, then re-run the\n' +
    ' * script. Hand edits here are overwritten.\n' +
    ' */\n';

  writeFileSync(join(OUT, page.out), banner + src, 'utf8');

  if (stripped.metadata) {
    writeFileSync(join(OUT, '.metadata', (page.dir || 'home') + '.txt'), stripped.metadata, 'utf8');
  }

  report.push({ template: page.out, hrefs: hrefCount, roles: Boolean(page.product) });
}

console.log('wrote ' + report.length + ' templates into components/templates');
for (const r of report) {
  console.log(
    '  ' + r.template.padEnd(46) +
    ' hrefs=' + String(r.hrefs).padStart(3) +
    '  roleSections=' + r.roles
  );
}
