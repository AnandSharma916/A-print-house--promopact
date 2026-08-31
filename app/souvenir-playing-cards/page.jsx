/* The India master route. Its markup lives in SouvenirPlayingCardsTemplate, shared
   with every /[location] route, and its metadata in data/master-metadata.js,
   shared with lib/seo.js. Passing no location is what makes this the master:
   the template falls back to the unprefixed hrefs and renders no location
   sections. */
import SouvenirPlayingCardsTemplate from '@/components/templates/products/SouvenirPlayingCardsTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA["/souvenir-playing-cards"];

export default function SouvenirPlayingCardsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org/", 
      "@type": "Product", 
      "name": "Customised Playing Cards",
      "image": "",
      "description": "A India Print House is a trusted Customised Playing Cards Manufacturer in India, offering beautifully designed and customised playing cards for tourist destinations, museums, events, organizations, and gift shops. Our customised playing cards are a unique way to showcase special places, cultures, landmarks, and memorable occasions.\n\n\nWe manufacture high-quality customised playing cards with creative artwork, vibrant printing, and durable materials. These cards are perfect for gifting, collecting, and promoting destinations or brands.",
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
        "name": "Customised Playing Cards",
        "item": "https://www.aiphplayingcards.in/souvenir-playing-cards"  
      }]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SouvenirPlayingCardsTemplate />
    </>
  );
}
