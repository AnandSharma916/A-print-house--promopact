/* The India master route. Its markup lives in PromotionalPlayingCardsTemplate, shared
   with every /[location] route, and its metadata in data/master-metadata.js,
   shared with lib/seo.js. Passing no location is what makes this the master:
   the template falls back to the unprefixed hrefs and renders no location
   sections. */
import PromotionalPlayingCardsTemplate from '@/components/templates/products/PromotionalPlayingCardsTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA["/promotional-playing-cards"];

export default function PromotionalPlayingCardsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org/", 
      "@type": "Product", 
      "name": "Promotional Playing Cards",
      "image": "",
      "description": "A India Print House is a trusted Promotional Playing Cards Manufacturer in India, offering high-quality customized playing cards for businesses, brands, events, and marketing campaigns.\n\n\nWe design and print playing cards with your company logo, brand name, product details, and promotional messages. Our cards are made using quality materials and advanced printing techniques to ensure a creative look and long-lasting performance.",
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
        "name": "Promotional Playing Cards",
        "item": "https://www.aiphplayingcards.in/promotional-playing-cards"  
      }]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PromotionalPlayingCardsTemplate />
    </>
  );
}
