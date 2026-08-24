/**
 * Location resolution + link rewriting.
 *
 * Every page template in components/templates is shared by the master (India
 * root) routes and the /[location] routes. The templates call `path()` on each
 * internal href, so one copy of the markup serves both: with `location` null
 * the hrefs come out exactly as the master site has always emitted them, and
 * with a location they are rewritten into that location's subtree.
 */
import { LOCATIONS, PRODUCTS, MASTER_ONLY_PRODUCTS } from '@/data/locations';
import { LOCATION_CONTENT } from '@/data/location-content';

const BY_SLUG = new Map(LOCATIONS.map((l) => [l.slug, l]));
const PRODUCT_BY_SLUG = new Map(PRODUCTS.map((p) => [p.slug, p]));
const PRODUCT_BY_MASTER = new Map(PRODUCTS.map((p) => [p.master, p]));

export function getLocation(slug) {
  return BY_SLUG.get(slug) ?? null;
}

export function getProduct(slug) {
  return PRODUCT_BY_SLUG.get(slug) ?? null;
}

export function isLocationSlug(slug) {
  return BY_SLUG.has(slug);
}

/** Root of a location's subtree: '/nepal', or '/' for the master site. */
export function locationRoot(location) {
  return location ? `/${location.slug}` : '/';
}

/**
 * Rewrite one internal href for the location currently being rendered.
 *
 * Left alone: anchors, mailto:, tel:, protocol-relative and absolute URLs, and
 * the two products that exist only on the master site — a location has no page
 * for those, so linking at the master route is the only non-404 target.
 */
export function path(href, location) {
  if (!location) return href;
  if (typeof href !== 'string' || !href.startsWith('/')) return href;

  const root = `/${location.slug}`;
  const [pathname, hash = ''] = splitHash(href);

  if (pathname === '/' || pathname === '') return `${root}${hash || ''}`;
  if (MASTER_ONLY_PRODUCTS.includes(pathname)) return href;

  const product = PRODUCT_BY_MASTER.get(pathname);
  if (product) return `${root}/products/${product.slug}${hash}`;

  return `${root}${pathname}${hash}`;
}

function splitHash(href) {
  const i = href.indexOf('#');
  return i === -1 ? [href, ''] : [href.slice(0, i), href.slice(i)];
}

/** Canonical URL for a product page. */
export function productPath(productSlug, location) {
  const product = PRODUCT_BY_SLUG.get(productSlug);
  if (!product) return null;
  return location ? `/${location.slug}/products/${product.slug}` : product.master;
}

/**
 * The four location-specific sections for one product, or null when the doc
 * covers neither this location nor this product. Callers render nothing in
 * that case — no section is ever filled with another location's words.
 */
export function roleContent(locationSlug, productSlug) {
  const forLocation = LOCATION_CONTENT[locationSlug];
  if (!forLocation) return null;
  const forProduct = forLocation[productSlug];
  if (!forProduct) return null;
  const any = ['manufacturer', 'supplier', 'exporter', 'wholesaler'].some(
    (r) => Array.isArray(forProduct[r]) && forProduct[r].length > 0
  );
  return any ? forProduct : null;
}

export { LOCATIONS, PRODUCTS, MASTER_ONLY_PRODUCTS };
