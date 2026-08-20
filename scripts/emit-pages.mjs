/**
 * emit-pages.mjs — turns .conversion/manifest.json into App Router routes.
 *
 * Run after scripts/html-to-jsx.mjs. Together the two scripts are the record of
 * how legacy/*.html became app/**; the emitted files are the source of truth
 * once written, so re-running this overwrites hand edits on purpose.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(ROOT, '.conversion', 'manifest.json'), 'utf8'));

/* index.html and contact-us.html ran script.js; everything else ran
   assets/animations.js. See lib/vendors.js. */
const HOME_ENGINE = new Set(['/', '/contact-us']);

/* Page-specific client behaviour that used to live in an inline <script>. */
const EXTRA_COMPONENTS = {
  '/contact-us': { name: 'EnquiryMailto', from: '@/components/EnquiryMailto' },
  '/about-us': { name: 'AboutExtras', from: '@/components/AboutExtras' },
};

const jsString = (s) => JSON.stringify(s);

/*
 * Why every page is wrapped in a single <div className="page-root">:
 *
 * The legacy engines rewrite the DOM React rendered — SplitType shreds headings
 * into per-word <div>s, GSAP reparents nodes, Three.js appends a canvas. When
 * React later unmounts the page for a client-side navigation it tries to remove
 * children that are no longer where it left them and throws
 * "removeChild: The node to be removed is not a child of this node", which
 * takes the whole route down.
 *
 * With one wrapper element React removes that single node from <body> and never
 * walks the mutated subtree, so navigation survives. No rule in style.css or
 * animations.css targets a direct child of body, so the extra element is inert.
 */

for (const page of manifest) {
  const { route, head, jsx, usesLink, usesHideOnError } = page;
  const dir = route === '/' ? join(ROOT, 'app') : join(ROOT, 'app', route.slice(1));
  mkdirSync(dir, { recursive: true });

  const variant = HOME_ENGINE.has(route) ? 'home' : 'product';
  const extra = EXTRA_COMPONENTS[route];

  /* Per-page CSS overrides that were <style> blocks in <head>. */
  let cssImport = '';
  if (head.headStyles.length) {
    const cssName = (route === '/' ? 'home' : route.slice(1)) + '.css';
    writeFileSync(
      join(dir, cssName),
      `/* Page-level overrides, lifted verbatim from the <head><style> blocks\n` +
        `   of legacy/${page.file}. Imported by this route only. */\n\n` +
        head.headStyles.join('\n\n'),
      'utf8'
    );
    cssImport = `import './${cssName}';\n`;
  }

  const imports = [
    usesLink ? "import Link from 'next/link';" : null,
    "import LegacyEngine from '@/components/LegacyEngine';",
    usesHideOnError ? "import HideOnError from '@/components/HideOnError';" : null,
    extra ? `import ${extra.name} from '${extra.from}';` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const metadata = [
    `  title: ${jsString(head.title)},`,
    head.description ? `  description: ${jsString(head.description)},` : null,
    head.keywords ? `  keywords: ${jsString(head.keywords)},` : null,
    `  alternates: { canonical: ${jsString(route)} },`,
  ]
    .filter(Boolean)
    .join('\n');

  const componentName =
    route === '/'
      ? 'HomePage'
      : route
          .slice(1)
          .split('-')
          .map((w) => w[0].toUpperCase() + w.slice(1))
          .join('') + 'Page';

  const source = `${imports}
${cssImport}
export const metadata = {
${metadata}
};

export default function ${componentName}() {
  return (
    <div className="page-root">
      <LegacyEngine variant="${variant}" />
${extra ? `      <${extra.name} />\n` : ''}${jsx}    </div>
  );
}
`;

  writeFileSync(join(dir, 'page.jsx'), source, 'utf8');
  console.log(`wrote app${route === '/' ? '' : route}/page.jsx`);
}
