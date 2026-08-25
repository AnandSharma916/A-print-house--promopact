/**
 * robots.txt — generated via the Next.js Metadata API.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

export default function robots() {
  const baseUrl = 'https://aindiaprinthouse.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',        // no API routes should be indexed
          '/_next/',      // Next.js internal assets
          '/private/',    // any private resources
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],  // block AI scrapers from crawling
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],  // block Common Crawl AI training bot
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
