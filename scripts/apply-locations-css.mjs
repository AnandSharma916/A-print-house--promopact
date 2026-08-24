/**
 * apply-locations-css.mjs — the two stylesheet edits the Locations system needs.
 *
 * 1. The footer link area is a three-column grid declared once per page
 *    stylesheet (plus style.css). The Locations quick-link column makes it
 *    four, so every copy of the desktop `.ft-links-cols` rule goes from
 *    repeat(3, 1fr) to repeat(4, 1fr). The 1024px and 700px rules already
 *    collapse to 1fr 1fr / 1fr and are left untouched, so tablet and phone
 *    footers are unchanged.
 *
 * 2. The four location product sections need vertical rhythm. Those rules go
 *    into styles/inner-page-fixes.css, which every product page already
 *    imports, scoped under .page-root like everything else in that file.
 *
 * Both edits are location-agnostic: the same CSS ships to the master site and
 * to all ten locations. Nothing here is conditional on a location.
 *
 * Idempotent — running it twice changes nothing. Run: node scripts/apply-locations-css.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP = join(ROOT, 'app');

function cssFiles(dir, found = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) cssFiles(full, found);
    else if (entry.endsWith('.css')) found.push(full);
  }
  return found;
}

/* ---- 1. four-column footer -------------------------------------------- */

let touched = 0;
for (const file of cssFiles(APP)) {
  const before = readFileSync(file, 'utf8');
  const after = before.replace(/\.ft-links-cols\s*\{[^}]*\}/g, (block) =>
    block.replace('repeat(3, 1fr)', 'repeat(4, 1fr)')
  );
  if (after !== before) {
    writeFileSync(file, after, 'utf8');
    touched += 1;
    console.log('  4-col footer  ' + relative(ROOT, file));
  }
}
console.log('footer grid updated in ' + touched + ' stylesheet(s)');

/* ---- 2. location product section rhythm -------------------------------- */

const MARKER = '.page-root .loc-roles';
const RULES = `

/* ════════════════════════════════════════════════════════════════
   LOCATION PRODUCT SECTIONS

   The Manufacturer / Supplier / Exporter / Wholesaler blocks that a
   location product page renders under its introduction section. Type,
   colour and measure all come from the page's own design system
   (.headline-md, .body-md, --on-surface-variant); the only thing these
   rules contribute is the two-up grid and the paragraph rhythm, which
   no existing class supplies.

   Shared by every location — there is no per-location styling. */
.page-root .loc-roles {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 48px 64px;
}

.page-root .loc-role__title {
    margin: 0 0 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--gold-faint);
}

.page-root .loc-role p {
    color: var(--on-surface-variant);
    margin: 0 0 16px;
}

.page-root .loc-role p:last-child {
    margin-bottom: 0;
}

@media (max-width: 900px) {
    .page-root .loc-roles {
        grid-template-columns: minmax(0, 1fr);
        gap: 40px;
    }
}
`;

const fixes = join(APP, 'styles', 'inner-page-fixes.css');
const current = readFileSync(fixes, 'utf8');
if (current.includes(MARKER)) {
  console.log('loc-roles rules already present in inner-page-fixes.css');
} else {
  writeFileSync(fixes, current.replace(/\s*$/, '') + '\n' + RULES, 'utf8');
  console.log('loc-roles rules appended to app/styles/inner-page-fixes.css');
}
