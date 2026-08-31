/* The India master route. Its markup lives in FlashCardsTemplate, shared
   with every /[location] route, and its metadata in data/master-metadata.js,
   shared with lib/seo.js. Passing no location is what makes this the master:
   the template falls back to the unprefixed hrefs and renders no location
   sections. */
import FlashCardsTemplate from '@/components/templates/products/FlashCardsTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA["/flash-cards"];

export default function FlashCardsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org/", 
      "@type": "Product", 
      "name": "Flash Cards",
      "image": "",
      "description": "A India Print House is a trusted Flash Cards Manufacturer in India, offering high-quality and customized flash cards for schools, preschools, coaching centres, publishers, and edtech brands. We manufacture engaging and durable flash card sets designed for quick recall, active revision, and confident, independent learning.\n\n\nOur flash cards are produced using premium materials, child-safe inks, and advanced printing technology to ensure crisp graphics, bold text, and long-lasting performance. Whether you need sight-word cards, phonics cards, maths and vocabulary cards, or fully custom revision decks, we deliver solutions tailored to your learners and subjects.",
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
        "name": "Flash Cards",
        "item": "https://www.aiphplayingcards.in/flash-cards"  
      }]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FlashCardsTemplate />
    </>
  );
}
