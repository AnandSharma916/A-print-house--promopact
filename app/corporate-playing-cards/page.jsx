/* The India master route. Its markup lives in CorporatePlayingCardsTemplate, shared
   with every /[location] route, and its metadata in data/master-metadata.js,
   shared with lib/seo.js. Passing no location is what makes this the master:
   the template falls back to the unprefixed hrefs and renders no location
   sections. */
import CorporatePlayingCardsTemplate from '@/components/templates/products/CorporatePlayingCardsTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA["/corporate-playing-cards"];

export default function CorporatePlayingCardsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org/", 
      "@type": "Product", 
      "name": "Corporate Playing Cards",
      "image": "",
      "description": "A India Print House is a trusted Corporate Playing Cards Manufacturer in India, offering customized playing cards for businesses, organizations, and corporate events. Our corporate playing cards are designed to promote your brand while providing a unique and memorable experience for clients, employees, and business partners.\n\n\nWe create high-quality playing cards printed with your company logo, brand colors, business information, and custom artwork. These cards are ideal for corporate gifting, promotional campaigns, exhibitions, conferences, and special business events.",
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
        "name": "Corporate Playing Cards",
        "item": "https://www.aiphplayingcards.in/corporate-playing-cards"  
      }]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CorporatePlayingCardsTemplate />
    </>
  );
}
