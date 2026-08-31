/* The India master route. Its markup lives in AdvertisementPlayingCardsTemplate, shared
   with every /[location] route, and its metadata in data/master-metadata.js,
   shared with lib/seo.js. Passing no location is what makes this the master:
   the template falls back to the unprefixed hrefs and renders no location
   sections. */
import AdvertisementPlayingCardsTemplate from '@/components/templates/products/AdvertisementPlayingCardsTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA["/advertisement-playing-cards"];

export default function AdvertisementPlayingCardsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org/", 
      "@type": "Product", 
      "name": "Advertisement Playing Cards",
      "image": "",
      "description": "A India Print House is a leading Advertisement Playing Cards Manufacturer in India, offering creative and high-quality card printing solutions for businesses and brands. Our advertisement playing cards are designed to promote your products, services, and brand message in a unique and effective way.\n\n\nAdvertisement playing cards are an excellent marketing tool because they are used repeatedly, helping your brand stay visible to customers for a longer time. We print customized cards with your company logo, business details, product information, and promotional designs.",
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
        "name": "Advertisement Playing Cards",
        "item": "https://www.aiphplayingcards.in/advertisement-playing-cards"  
      }]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AdvertisementPlayingCardsTemplate />
    </>
  );
}
