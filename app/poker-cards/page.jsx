/* The India master route. Its markup lives in PokerCardsTemplate, shared
   with every /[location] route, and its metadata in data/master-metadata.js,
   shared with lib/seo.js. Passing no location is what makes this the master:
   the template falls back to the unprefixed hrefs and renders no location
   sections. */
import PokerCardsTemplate from '@/components/templates/products/PokerCardsTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA["/poker-cards"];

export default function PokerCardsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org/", 
      "@type": "Product", 
      "name": "Poker Cards",
      "image": "",
      "description": "A India Print House is a trusted Poker Cards Manufacturer in India, offering high-quality printed poker cards for gaming, clubs, events, and promotional use. We design and manufacture durable poker cards that provide a smooth playing experience and long-lasting performance.\n\n\nOur poker cards are made with premium materials and modern printing technology to ensure clear designs, sharp colors, and professional finishing. Whether you need standard poker decks or custom-designed poker cards, we provide complete solutions as per your needs.",
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
        "name": "Poker Cards",
        "item": "https://www.aiphplayingcards.in/poker-cards"  
      }]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PokerCardsTemplate />
    </>
  );
}
