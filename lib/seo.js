/**
 * Location-aware metadata.
 *
 * The content doc supplies no SEO fields — it is Manufacturer / Supplier /
 * Exporter / Wholesaler prose and nothing else — so titles and descriptions
 * are derived rather than copied, in this order of preference:
 *
 *   1. the master page's own title/description with "in India" swapped for the
 *      location, which is how every product page already reads;
 *   2. the location's own supplied Manufacturer paragraph, trimmed to a
 *      description length, when the master page has no description of its own;
 *   3. a fixed formula, used only for the pages the first two cannot cover.
 *
 * India is the master. Its pages carry the same words as the root site, so
 * they canonicalise to the root URL rather than competing with it.
 */
import { MASTER_METADATA } from '@/data/master-metadata';
import { getProduct, roleContent } from '@/lib/locations';

const BRAND = 'A India Print House';
const DESCRIPTION_LIMIT = 160;

const isMaster = (location) => !location || location.slug === 'india';

function localise(text, location) {
  if (!text) return text;
  return text.replace(/\bin India\b/g, 'in ' + location.name);
}

function excerpt(text) {
  if (!text) return null;
  if (text.length <= DESCRIPTION_LIMIT) return text;
  const cut = text.slice(0, DESCRIPTION_LIMIT);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—-]$/, '') + '…';
}

function withOpenGraph({ title, description, canonical }) {
  return {
    title,
    description: description ?? undefined,
    alternates: { canonical },
    openGraph: {
      title,
      description: description ?? undefined,
      url: canonical,
      siteName: BRAND,
      type: 'website',
    },
  };
}

/** Metadata for a location's home, about-us or contact-us page. */
export function pageMetadata(location, masterRoute) {
  const master = MASTER_METADATA[masterRoute];
  const canonical = isMaster(location)
    ? masterRoute
    : masterRoute === '/'
      ? '/' + location.slug
      : '/' + location.slug + masterRoute;

  if (isMaster(location)) {
    return withOpenGraph({ title: master.title, description: master.description, canonical });
  }

  const localisedTitle = localise(master.title, location);
  const title =
    localisedTitle !== master.title
      ? localisedTitle
      : masterRoute === '/about-us'
        ? 'About ' + BRAND + ' | Playing Cards Manufacturer in ' + location.name
        : masterRoute === '/contact-us'
          ? 'Contact ' + BRAND + ' | Playing Cards Manufacturer in ' + location.name
          : 'Playing Cards Manufacturer in ' + location.name + ' | ' + BRAND;

  const localisedDescription = localise(master.description, location);
  const description =
    localisedDescription && localisedDescription !== master.description
      ? localisedDescription
      : master.description
        ? master.description + ' Serving ' + location.name + '.'
        : null;

  return withOpenGraph({ title, description, canonical });
}

/** Metadata for a location's product page. */
export function productMetadata(location, productSlug) {
  const product = getProduct(productSlug);
  if (!product) return {};

  const master = MASTER_METADATA[product.master] ?? { title: product.name, description: null };
  const canonical = isMaster(location)
    ? product.master
    : '/' + location.slug + '/products/' + product.slug;

  if (isMaster(location)) {
    return withOpenGraph({ title: master.title, description: master.description, canonical });
  }

  const localisedTitle = localise(master.title, location);
  const title =
    localisedTitle !== master.title
      ? localisedTitle
      : product.name + ' Manufacturer in ' + location.name + ' | ' + BRAND;

  const localisedDescription = localise(master.description, location);
  let description = null;
  if (localisedDescription && localisedDescription !== master.description) {
    description = localisedDescription;
  } else {
    const content = roleContent(location.slug, product.slug);
    const supplied = content && content.manufacturer && content.manufacturer[0];
    description = excerpt(supplied) ?? master.description ?? null;
  }

  return withOpenGraph({ title, description, canonical });
}
