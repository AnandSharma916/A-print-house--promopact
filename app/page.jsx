/* The India master route. Its markup lives in HomeTemplate, shared
   with every /[location] route, and its metadata in data/master-metadata.js,
   shared with lib/seo.js. Passing no location is what makes this the master:
   the template falls back to the unprefixed hrefs and renders no location
   sections. */
import HomeTemplate from '@/components/templates/HomeTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA["/"];

export default function HomePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "A India Print House",
      "url": "https://www.aiphplayingcards.in/",
      "logo": "https://www.aiphplayingcards.in/img/aiph-logo.avif"
    },
    {
      "@context": "https://schema.org/",
      "@type": "WebSite",
      "name": "A India Print House",
      "url": "https://www.aiphplayingcards.in/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.aiphplayingcards.in/?s={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeTemplate />
    </>
  );
}
