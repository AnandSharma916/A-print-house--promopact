/* The India master route. Its markup lives in EducationalCardsTemplate, shared
   with every /[location] route, and its metadata in data/master-metadata.js,
   shared with lib/seo.js. Passing no location is what makes this the master:
   the template falls back to the unprefixed hrefs and renders no location
   sections. */
import EducationalCardsTemplate from '@/components/templates/products/EducationalCardsTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA["/educational-cards"];

export default function EducationalCardsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org/", 
      "@type": "Product", 
      "name": "Educational Cards",
      "image": "",
      "description": "A India Print House is a trusted Educational Cards Manufacturer in India, offering high-quality and customized educational cards for schools, preschools, coaching centres, publishers, and learning brands. We manufacture engaging and durable educational card sets designed to make learning simple, visual, and enjoyable for students of every age.\n\n\nOur educational cards are produced using premium materials, child-safe inks, and advanced printing technology to ensure clear graphics, vibrant colours, and long-lasting performance. Whether you need alphabet cards, number cards, word cards, science and general-knowledge cards, or fully custom learning kits, we deliver solutions tailored to your curriculum and teaching goals.",
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
        "name": "Educational Cards",
        "item": "https://www.aiphplayingcards.in/educational-cards"  
      }]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EducationalCardsTemplate />
    </>
  );
}
