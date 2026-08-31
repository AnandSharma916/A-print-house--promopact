/* The India master route. Its markup lives in PremiumPlayingCardsTemplate, shared
   with every /[location] route, and its metadata in data/master-metadata.js,
   shared with lib/seo.js. Passing no location is what makes this the master:
   the template falls back to the unprefixed hrefs and renders no location
   sections. */
import PremiumPlayingCardsTemplate from '@/components/templates/products/PremiumPlayingCardsTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA["/premium-playing-cards"];

export default function PremiumPlayingCardsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org/", 
      "@type": "Product", 
      "name": "Leading Playing Cards",
      "image": "",
      "description": "A India Print House is a trusted manufacturer and exporter of premium playing cards. We provide custom solutions for prestigious businesses, international brands, and professional magicians worldwide.\n\n\nOur process marries ancient tactile sensibilities with modern offset precision, ensuring every deck that leaves our house is a masterpiece of design and functionality.",
      "brand": {
        "@type": "Brand",
        "name": "A India Print House"
      }
    },
    {
      "@context": "https://schema.org/", 
      "@type": "BreadcrumbList", 
      "itemListElement": [{
        "@type": "ListItem", 
        "position": 1, 
        "name": "Home",
        "item": "https://www.aiphplayingcards.in/"  
      },{
        "@type": "ListItem", 
        "position": 2, 
        "name": "Leading Playing Cards Manufacturer in India",
        "item": "https://www.aiphplayingcards.in/premium-playing-cards"  
      }]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PremiumPlayingCardsTemplate />
    </>
  );
}
