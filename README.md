# A India Print House — Next.js

The site, converted from the hand-written static build (13 HTML files + one
stylesheet + two script files) to Next.js 16 with the App Router.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Layout

```
app/
  layout.jsx              root <html>/<body>, global CSS, fonts + vendor CSS
  page.jsx                /                        (was index.html)
  about-us/page.jsx       /about-us                (was about-us.html)
  …                       one folder per legacy page — each a thin wrapper now
  <route>/<route>.css     that page's <head><style> overrides, lifted verbatim
  [location]/             /[location] and everything under it (see Locations)
  styles/style.css        the original style.css
  styles/animations.css   the original assets/animations.css
components/
  templates/              the page markup, shared by master and location routes
  LocationProductSections.jsx  the four location blocks on a product page
  FooterLocations.jsx     the footer's Locations column, from data/locations.js
  LegacyEngine.jsx        loads the CDN libs, runs the right legacy engine
  AboutExtras.jsx         about-us inline <script>, ported
  EnquiryMailto.jsx       contact-us mailto composer, ported
  HideOnError.jsx         replaces the one inline onerror= in the markup
data/
  locations.js            the eleven locations and the eight products they carry
  location-content.js     per-location product copy, generated from the doc
  location-doc.txt        the content doc's own text export — the source of truth
  product-images.js       each product page's four pictures, reused by its sections
  master-metadata.js      the master pages' metadata, verbatim
lib/
  locations.js            slug lookup + the href rewriting the templates use
  seo.js                  location-aware titles, descriptions and canonicals
  legacy-script.js        was script.js
  legacy-animations.js    was assets/animations.js
  vendors.js              CDN URLs per engine
  load-scripts.js         ordered, cached script loader
public/                   img/ New/ Educational-Cards/ Flash-Cards/ Video/
legacy/                   the original HTML/CSS/JS, kept as the conversion source
scripts/                  the conversion and verification tooling
```

## How the animation code works now

The original site loaded ~16 libraries from CDNs and ran one of two engines on
`DOMContentLoaded`. That is preserved rather than rewritten:

- **Libraries still come from their CDNs**, loaded in the original order by
  `lib/load-scripts.js`. `next/script` is not used because ScrollTrigger and
  CustomEase must register onto an already-present `gsap`, and it gives no
  ordering guarantee between sibling tags.
- **The two engines became modules** that export an `init()` and return a
  teardown. `<LegacyEngine>` runs one on mount and tears it down on unmount, so
  navigating between pages does not stack up Lenis instances or leave dead
  ScrollTriggers pinning unmounted sections.
- **Every page is wrapped in one `<div className="page-root">`.** The engines
  rewrite React's DOM (SplitType shreds headings into per-word divs, GSAP
  reparents nodes), so React's unmount used to throw `removeChild: The node to
  be removed is not a child of this node` and blank the route. With a single
  wrapper React removes one node from `<body>` and never walks the mutated
  subtree.
- **Strict Mode is off** (`next.config.mjs`). Double-invoking those effects
  would build every GSAP timeline and Three.js scene twice.

## Locations

The site serves eleven locations — the content doc's ten market tabs plus
India, which is the master and has no tab of its own — each with a home, an
About Us, a Contact Us and eight product pages:

```
/nepal
/nepal/about-us
/nepal/contact-us
/nepal/products/poker-cards        …and the other seven products
```

There is no second copy of the site behind those URLs. Each master page's
markup was moved into `components/templates/**`, and both the master route and
the matching `/[location]` route render that one template:

```
app/poker-cards/page.jsx                    -> <PokerCardsTemplate />
app/[location]/products/[product]/page.jsx  -> <PokerCardsTemplate location={nepal} />
```

The template takes a single `location` prop and uses it for exactly two things:

1. **Links.** Every internal `href` goes through `path(href, location)`, which
   rewrites `/poker-cards` into `/nepal/products/poker-cards` and leaves
   anchors, `mailto:`, `tel:` and external URLs alone. With no location it
   returns the href untouched, which is what makes the master routes master.
2. **The four location sections.** `<LocationProductSections>` renders the
   Manufacturer / Supplier / Exporter / Wholesaler copy for that location and
   product, and renders nothing at all when there is none. Each role is a
   full-width section that alternates side and background — text left on
   cream, text right on surface — built from the page's own introduction
   lockup (`.heritage__grid` + `.media-frame`), so type, the ornate frame and
   the split-heading animation all come from the stylesheet that was already
   there. The pictures are the product page's own four, listed in
   `data/product-images.js` and identical across every location.

Everything else — classes, images, image sizes, stylesheets, the GSAP/Lenis/
Three.js engines, section order — is the same bytes on every location, because
it is the same file. `npm run verify:locations` asserts exactly that: it takes
each location page, unwinds its links and lifts out its four sections, and
requires the result to be byte-identical to the master page.

### Adding a location

1. Add it to `LOCATIONS` in `data/locations.js`.
2. Add its copy to the content doc, re-export it, and run `npm run build:content`.

No route, component or stylesheet changes. It appears in the footer of every
page automatically, because that column is built from `LOCATIONS`.

### Content coverage

`data/location-content.js` is generated from the client's location doc and is
the only source of location-specific text. The doc has ten tabs — Nepal, Delhi
NCR, Hyderabad, Bangalore, Mumbai, Kolkata, Chennai, Pune, Ahmedabad, Noida —
each holding eight products x four roles. Two gaps are real and deliberate:

- **India has no entry** — the doc has no India tab, so `/india/*` renders the
  master India copy with no location sections, and canonicalises to the root
  URLs rather than competing with them.
- **Educational Cards and Flash Cards** are not in the doc, so they stay
  master-only routes. Links to them from inside a location point at
  `/educational-cards` and `/flash-cards`.

The copy is never retyped: `scripts/build-location-content.mjs` parses the doc's
own text export, and `npm run verify:content` diffs every one of the 592
paragraphs against it. That check exists because an earlier hand-assisted pass
silently reworded 21 of them.

## Regenerating and checking the conversion

`scripts/` holds the tooling, so the port is reproducible rather than a
one-time hand edit:

| command | what it does |
| --- | --- |
| `npm run reconvert` | re-derives `app/**/page.jsx` from `legacy/*.html` — **overwrites hand edits** |
| `npm run verify` | server must be running: diffs every route against the legacy HTML (visible text, CSS classes, image paths) |
| `npm run smoke` | drives headless Chrome over CDP: vendor globals, engine start-up, console errors, and soft navigation |
| `npm run verify:locations` | after `next build`: every location page is byte-identical to its master page once links are unwound and the four location sections lifted out |
| `npm run build:content` | regenerates `data/location-content.js` from `data/location-doc.txt` |
| `npm run verify:content` | diffs all 592 paragraphs against the doc export, paragraph by paragraph |

`npm run verify` and `npm run smoke` both take `BASE_URL` (default
`http://localhost:3111`).

Once you start editing pages by hand, stop running `reconvert` — the files under
`app/` are the source of truth from that point on, and `legacy/` plus the two
converter scripts are just the record of where they came from. Since the
Locations work `reconvert` refuses to run outright: it would overwrite the
master wrappers with standalone pages and quietly desynchronise every location
from the master it mirrors. If you ever do need it, run it with `--i-know` and
then re-run `scripts/build-templates.mjs` and `scripts/emit-master-routes.mjs`.

## Known issue carried over from the static site

`app/styles/style.css:2025` sets a section background to
`/img/imgi_11_621440636_…n.avif`, which has never existed in this project. It
404s and the section renders flat dark — the same as before the conversion. It
needs either the artwork or the rule removed; both are design calls.
