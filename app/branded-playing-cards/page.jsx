/* The India master route. Its markup lives in BrandedPlayingCardsTemplate, shared
   with every /[location] route, and its metadata in data/master-metadata.js,
   shared with lib/seo.js. Passing no location is what makes this the master:
   the template falls back to the unprefixed hrefs and renders no location
   sections. */
import BrandedPlayingCardsTemplate from '@/components/templates/products/BrandedPlayingCardsTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA["/branded-playing-cards"];

export default function BrandedPlayingCardsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org/", 
      "@type": "Product", 
      "name": "Branded Playing Cards",
      "image": "",
      "description": "A India Print House is a trusted Branded Playing Cards Manufacturer in India, offering high-quality customized playing cards for businesses, brands, organizations, and promotional campaigns. Our branded playing cards are designed to showcase your company logo, brand identity, products, and marketing message in a creative and memorable way.\n\n\nWe manufacture premium-quality playing cards using advanced printing technology and durable materials to ensure excellent appearance and long-lasting use. Whether you need branded cards for promotions, corporate gifting, events, or retail sales, we provide customized solutions to meet your requirements.",
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
        "name": "Branded Playing Cards",
        "item": "https://www.aiphplayingcards.in/branded-playing-cards"  
      }]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BrandedPlayingCardsTemplate />
    </>
  );
}
