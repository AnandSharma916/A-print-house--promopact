/**
 * sitemap.xml — generated dynamically via the Next.js Metadata API.
 *
 * Covers every route on the site:
 *   1. Static pages (home, about, contact)
 *   2. Master product pages (10 products)
 *   3. Location landing pages (11 locations)
 *   4. Location × product pages (11 locations × 8 products = 88 pages)
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { LOCATIONS, PRODUCTS, MASTER_ONLY_PRODUCTS } from '@/data/locations';

export default function sitemap() {
  const baseUrl = 'https://www.aiphplayingcards.in';
  const now = new Date().toISOString();

  /** Helper to build a sitemap entry. */
  const entry = (path, changeFrequency = 'monthly', priority = 0.7) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  const urls = [];

  /* ── 1. Static pages ─────────────────────────────────────────────── */
  urls.push(entry('/', 'weekly', 1.0));          // Homepage — highest priority
  urls.push(entry('/about-us', 'monthly', 0.8));
  urls.push(entry('/contact-us', 'monthly', 0.8));
  urls.push(entry('/location', 'monthly', 0.8));

  /* ── 2. Master product pages ─────────────────────────────────────── */
  for (const product of PRODUCTS) {
    urls.push(entry(product.master, 'weekly', 0.9));
  }

  // Master-only products (educational-cards, flash-cards)
  for (const productPath of MASTER_ONLY_PRODUCTS) {
    urls.push(entry(productPath, 'weekly', 0.9));
  }

  /* ── 3. Location landing pages ───────────────────────────────────── */
  for (const location of LOCATIONS) {
    urls.push(entry(`/${location.slug}`, 'monthly', 0.8));
  }

  /* ── 4. Location × product pages ─────────────────────────────────── */
  for (const location of LOCATIONS) {
    // "india" location uses master routes directly, not /india/products/...
    if (location.slug === 'india') continue;

    for (const product of PRODUCTS) {
      urls.push(
        entry(`/${location.slug}/products/${product.slug}`, 'monthly', 0.7),
      );
    }
  }

  /* ── 5. Location about, contact & location pages ─────────────────── */
  for (const location of LOCATIONS) {
    if (location.slug === 'india') continue;

    urls.push(entry(`/${location.slug}/about-us`, 'monthly', 0.6));
    urls.push(entry(`/${location.slug}/contact-us`, 'monthly', 0.6));
    urls.push(entry(`/${location.slug}/location`, 'monthly', 0.6));
  }

  return urls;
}
