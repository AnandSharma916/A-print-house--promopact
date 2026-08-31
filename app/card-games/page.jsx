/* The India master route. Its markup lives in CardGamesTemplate, shared
   with every /[location] route, and its metadata in data/master-metadata.js,
   shared with lib/seo.js. Passing no location is what makes this the master:
   the template falls back to the unprefixed hrefs and renders no location
   sections. */
import CardGamesTemplate from '@/components/templates/products/CardGamesTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA["/card-games"];

export default function CardGamesPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org/", 
      "@type": "Product", 
      "name": "Card Games",
      "image": "",
      "description": "A India Print House is a trusted Card Games Manufacturer in India, offering high-quality and customized card games for businesses, educational institutions, gaming companies, and retail brands. We manufacture creative and durable card game sets designed for entertainment, learning, and promotional purposes.\n\n\nOur card games are produced using premium materials and advanced printing technology to ensure excellent quality, clear graphics, and long-lasting performance. Whether you need custom card games for business promotions, educational activities, or retail sales, we provide solutions tailored to your requirements.",
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
        "name": "Card Games",
        "item": "https://www.aiphplayingcards.in/card-games"  
      }]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CardGamesTemplate />
    </>
  );
}
