/**
 * Sequential, cached loader for the CDN libraries the legacy animation code
 * expects to find on `window`.
 *
 * next/script is deliberately not used here: those libraries have load-order
 * dependencies (ScrollTrigger and CustomEase both register themselves onto an
 * already-present `gsap`), and next/script gives no ordering guarantee between
 * sibling tags. Loading them in series is slower to first paint but it is the
 * order the original <head> had, which is what the legacy code was written
 * against.
 */

/** url -> Promise, so a second page visit reuses the first load. */
const cache = new Map();

function loadOne(src) {
  if (cache.has(src)) return cache.get(src);

  const promise = new Promise((resolve) => {
    /* Survives a full remount: the tag may already be in the document from a
       previous mount even if this module instance lost its cache. */
    const existing = document.querySelector(`script[data-vendor="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => resolve());
      return;
    }

    const el = document.createElement('script');
    el.src = src;
    el.async = false;
    el.dataset.vendor = src;
    el.addEventListener('load', () => {
      el.dataset.loaded = 'true';
      resolve();
    });
    /* A dead CDN must not wedge the page — every consumer guards for a missing
       global anyway, so resolve and let the feature degrade. */
    el.addEventListener('error', () => {
      console.warn('[vendor] failed to load', src);
      resolve();
    });
    document.head.appendChild(el);
  });

  cache.set(src, promise);
  return promise;
}

/** Loads `sources` strictly in order. Resolves once the last one settles. */
export default async function loadScripts(sources) {
  for (const src of sources) {
    await loadOne(src);
  }
}
