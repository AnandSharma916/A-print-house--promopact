/* The India master route. Its markup lives in PokerCardsTemplate, shared
   with every /[location] route, and its metadata in data/master-metadata.js,
   shared with lib/seo.js. Passing no location is what makes this the master:
   the template falls back to the unprefixed hrefs and renders no location
   sections. */
import PokerCardsTemplate from '@/components/templates/products/PokerCardsTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA["/poker-cards"];

export default function PokerCardsPage() {
  return <PokerCardsTemplate />;
}
