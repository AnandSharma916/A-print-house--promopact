/**
 * The Locations registry — the single source of truth for which locations the
 * site serves and which products each location page offers.
 *
 * Adding an 11th location is a data edit here (plus its copy in
 * data/location-content.js); no route, component or stylesheet changes.
 *
 * NOTE ON COVERAGE: the content doc has ten tabs — the nine markets below plus
 * Noida — and no "India" tab. India is the master site, so it is served as a
 * location but has no Manufacturer/Supplier/Exporter/Wholesaler copy; its
 * product pages render the master India sections only. That is why this list
 * is eleven entries and the doc is ten.
 */

/** The locations, in the order they appear in the footer. */
export const LOCATIONS = [
  { slug: 'india', name: 'India', country: 'India' },
  { slug: 'nepal', name: 'Nepal', country: 'Nepal' },
  { slug: 'delhi-ncr', name: 'Delhi NCR', country: 'India' },
  { slug: 'hyderabad', name: 'Hyderabad', country: 'India' },
  { slug: 'bangalore', name: 'Bangalore', country: 'India' },
  { slug: 'mumbai', name: 'Mumbai', country: 'India' },
  { slug: 'kolkata', name: 'Kolkata', country: 'India' },
  { slug: 'chennai', name: 'Chennai', country: 'India' },
  { slug: 'pune', name: 'Pune', country: 'India' },
  { slug: 'ahmedabad', name: 'Ahmedabad', country: 'India' },
  { slug: 'noida', name: 'Noida', country: 'India' },
];

/**
 * The eight products every location page carries, in the doc's order.
 *
 * `master` is the existing India route for the product; the location routes
 * reuse that page's template verbatim, so this doubles as the template key.
 *
 * Educational Cards and Flash Cards are deliberately absent: the content doc
 * covers neither, so they stay master-only pages and links to them from inside
 * a location point back at the master route.
 */
export const PRODUCTS = [
  { slug: 'premium-playing-cards', name: 'Premium Playing Cards', master: '/premium-playing-cards' },
  { slug: 'promotional-playing-cards', name: 'Promotional Playing Cards', master: '/promotional-playing-cards' },
  { slug: 'advertisement-playing-cards', name: 'Advertisement Playing Cards', master: '/advertisement-playing-cards' },
  { slug: 'card-games', name: 'Card Games', master: '/card-games' },
  { slug: 'corporate-playing-cards', name: 'Corporate Playing Cards', master: '/corporate-playing-cards' },
  { slug: 'souvenir-playing-cards', name: 'Souvenir Playing Cards', master: '/souvenir-playing-cards' },
  { slug: 'branded-playing-cards', name: 'Branded Playing Cards', master: '/branded-playing-cards' },
  { slug: 'poker-cards', name: 'Poker Cards', master: '/poker-cards' },
];

/** Products that exist on the master site but not inside a location. */
export const MASTER_ONLY_PRODUCTS = ['/educational-cards', '/flash-cards'];

/** The four location-specific sections of a product page, in render order. */
export const ROLES = [
  { key: 'manufacturer', label: 'Manufacturer' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'exporter', label: 'Exporter' },
  { key: 'wholesaler', label: 'Wholesaler' },
];
