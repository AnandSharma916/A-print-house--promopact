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
  …                       one folder per legacy page
  <route>/<route>.css     that page's <head><style> overrides, lifted verbatim
  styles/style.css        the original style.css
  styles/animations.css   the original assets/animations.css
components/
  LegacyEngine.jsx        loads the CDN libs, runs the right legacy engine
  AboutExtras.jsx         about-us inline <script>, ported
  EnquiryMailto.jsx       contact-us mailto composer, ported
  HideOnError.jsx         replaces the one inline onerror= in the markup
lib/
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

## Regenerating and checking the conversion

`scripts/` holds the tooling, so the port is reproducible rather than a
one-time hand edit:

| command | what it does |
| --- | --- |
| `npm run reconvert` | re-derives `app/**/page.jsx` from `legacy/*.html` — **overwrites hand edits** |
| `npm run verify` | server must be running: diffs every route against the legacy HTML (visible text, CSS classes, image paths) |
| `npm run smoke` | drives headless Chrome over CDP: vendor globals, engine start-up, console errors, and soft navigation |

`npm run verify` and `npm run smoke` both take `BASE_URL` (default
`http://localhost:3111`).

Once you start editing pages by hand, stop running `reconvert` — the files under
`app/` are the source of truth from that point on, and `legacy/` plus the two
converter scripts are just the record of where they came from.

## Known issue carried over from the static site

`app/styles/style.css:2025` sets a section background to
`/img/imgi_11_621440636_…n.avif`, which has never existed in this project. It
404s and the section renders flat dark — the same as before the conversion. It
needs either the artwork or the rule removed; both are design calls.
