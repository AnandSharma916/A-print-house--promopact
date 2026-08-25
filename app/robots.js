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
        allow: ['/'],
      },
      {
        userAgent: 'CCBot',
        allow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
