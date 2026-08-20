import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* The legacy engines do imperative DOM setup in an effect (GSAP timelines,
     a Lenis instance, a Three.js canvas). Strict Mode's double-invoke would
     build all of that twice on mount, so it stays off. */
  reactStrictMode: false,

  /* There is a package-lock.json in the user's home directory; without this,
     Turbopack infers that as the workspace root. */
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
