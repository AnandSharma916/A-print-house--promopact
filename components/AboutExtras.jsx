'use client';

import { useEffect } from 'react';
import loadScripts from '@/lib/load-scripts';
import { PRODUCT_VENDORS } from '@/lib/vendors';

/**
 * About page extras: the "People Behind the Press" Swiper and the animated
 * stat counters.
 *
 * Ported from the inline <script> at the bottom of about-us.html. Runs
 * alongside <LegacyEngine variant="product" />, which handles everything else
 * on the page; both await the same cached vendor loads, so Swiper is guaranteed
 * present by the time this runs.
 */
export default function AboutExtras() {
  useEffect(() => {
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const disposers = [];
    let cancelled = false;

    (async () => {
      await loadScripts(PRODUCT_VENDORS);
      if (cancelled) return;

      /* ---- Swiper: "The People Behind the Press" carousel ---- */
      if (typeof window.Swiper === 'function' && document.querySelector('.about-swiper')) {
        const swiper = new window.Swiper('.about-swiper', {
          slidesPerView: 1,
          spaceBetween: 24,
          grabCursor: true,
          loop: true,
          speed: 800,
          autoplay: REDUCED ? false : { delay: 3200, disableOnInteraction: false },
          pagination: { el: '.about-pager', clickable: true },
          breakpoints: {
            640: { slidesPerView: 1.4 },
            900: { slidesPerView: 2.2 },
            1200: { slidesPerView: 3 },
          },
        });
        disposers.push(() => {
          try { swiper.destroy(true, true); } catch (e) { /* already gone */ }
        });
      }

      /* ---- Animated number counters (home-page style) ---- */
      const counters = Array.from(document.querySelectorAll('[data-count]'));
      if (!counters.length) return;

      const EASE = (t) => 1 - Math.pow(1 - t, 3); /* easeOutCubic */
      if (window.gsap && window.CustomEase) {
        try {
          window.gsap.registerPlugin(window.CustomEase);
          window.CustomEase.create('countEase', '0.16, 1, 0.3, 1');
        } catch (e) { /* fall back to the JS easing above */ }
      }

      const frames = new Set();
      function runCount(el) {
        if (el.__done) return;
        el.__done = true;
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        if (REDUCED) { el.textContent = target.toLocaleString(); return; }
        const dur = 1600;
        let start = null;
        function step(ts) {
          if (start === null) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          el.textContent = Math.round(target * EASE(p)).toLocaleString();
          if (p < 1) frames.add(requestAnimationFrame(step));
        }
        frames.add(requestAnimationFrame(step));
      }
      disposers.push(() => frames.forEach((id) => cancelAnimationFrame(id)));

      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              if (en.isIntersecting) { runCount(en.target); io.unobserve(en.target); }
            });
          },
          { threshold: 0.5 }
        );
        counters.forEach((el) => io.observe(el));
        disposers.push(() => io.disconnect());
      } else {
        counters.forEach(runCount);
      }
    })();

    return () => {
      cancelled = true;
      disposers.forEach((fn) => {
        try { fn(); } catch (e) { console.error('AboutExtras teardown failed:', e); }
      });
    };
  }, []);

  return null;
}
