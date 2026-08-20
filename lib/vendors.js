/**
 * The CDN libraries each legacy engine needs, in the order the original
 * <head> listed them.
 *
 * Two engines exist because the old site had two: index/contact ran script.js,
 * every product page and about-us ran assets/animations.js. Where individual
 * pages loaded a subset (contact-us pulled only four of the eight home libs),
 * the union is used — it costs one cached request and keeps the engines
 * interchangeable.
 */

const GSAP = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
const SCROLL_TRIGGER = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
const CUSTOM_EASE = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/CustomEase.min.js';
const MOTION_PATH = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/MotionPathPlugin.min.js';
const THREE = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const SWIPER = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
const SPLIT_TYPE = 'https://unpkg.com/split-type@0.3.4/umd/index.min.js';

/* script.js — the home/contact engine. */
export const HOME_VENDORS = [
  GSAP,
  SCROLL_TRIGGER,
  CUSTOM_EASE,
  MOTION_PATH,
  'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js',
  SWIPER,
  SPLIT_TYPE,
  THREE,
];

/* assets/animations.js — the product-page/about engine. */
export const PRODUCT_VENDORS = [
  GSAP,
  SCROLL_TRIGGER,
  'https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js',
  'https://unpkg.com/@lottiefiles/lottie-player@2.0.8/dist/lottie-player.js',
  SPLIT_TYPE,
  'https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js',
  'https://unpkg.com/rough-notation@0.4.0/lib/rough-notation.iife.js',
  'https://cdn.jsdelivr.net/npm/atropos@2.0.2/atropos.min.js',
  'https://cdn.jsdelivr.net/npm/granim@2.0.0/dist/granim.min.js',
  'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js',
  'https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.min.js',
  THREE,
  'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js',
  SWIPER,
  CUSTOM_EASE,
  MOTION_PATH,
];

/* Vendor stylesheets, loaded once in the root layout. */
export const VENDOR_STYLESHEETS = [
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
  'https://cdn.jsdelivr.net/npm/atropos@2.0.2/atropos.min.css',
  'https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.min.css',
];

export const FONT_STYLESHEETS = [
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&display=swap',
  'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
];
