'use client';

import { useEffect } from 'react';
import loadScripts from '@/lib/load-scripts';
import { HOME_VENDORS, PRODUCT_VENDORS } from '@/lib/vendors';

/**
 * Runs one of the two legacy animation engines against the page that renders
 * it, and tears it down again on unmount.
 *
 * The engines query the DOM directly (`#site-header`, `.deck-card`, …), so they
 * must run *after* React has committed the page — hence useEffect rather than a
 * <Script> tag. The teardown matters because App Router keeps the document
 * alive across navigation: without it, every visit would add another Lenis
 * instance and another set of ScrollTriggers pinning sections that have since
 * been unmounted.
 *
 * @param {{ variant: 'home' | 'product' }} props
 */
export default function LegacyEngine({ variant }) {
  useEffect(() => {
    let teardown = null;
    let cancelled = false;

    (async () => {
      const vendors = variant === 'home' ? HOME_VENDORS : PRODUCT_VENDORS;
      await loadScripts(vendors);
      /* Navigated away while the CDN was still responding. */
      if (cancelled) return;

      const mod =
        variant === 'home'
          ? await import('@/lib/legacy-script')
          : await import('@/lib/legacy-animations');
      if (cancelled) return;

      try {
        teardown = mod.default();
      } catch (e) {
        console.error(`[${variant}] legacy engine failed to start:`, e);
      }
    })();

    return () => {
      cancelled = true;
      if (teardown) teardown();
    };
  }, [variant]);

  return null;
}
