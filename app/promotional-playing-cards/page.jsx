/* The India master route. Its markup lives in PromotionalPlayingCardsTemplate, shared
   with every /[location] route, and its metadata in data/master-metadata.js,
   shared with lib/seo.js. Passing no location is what makes this the master:
   the template falls back to the unprefixed hrefs and renders no location
   sections. */
import PromotionalPlayingCardsTemplate from '@/components/templates/products/PromotionalPlayingCardsTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA["/promotional-playing-cards"];

export default function PromotionalPlayingCardsPage() {
  return <PromotionalPlayingCardsTemplate />;
}
