/* The India master route. Its markup lives in CorporatePlayingCardsTemplate, shared
   with every /[location] route, and its metadata in data/master-metadata.js,
   shared with lib/seo.js. Passing no location is what makes this the master:
   the template falls back to the unprefixed hrefs and renders no location
   sections. */
import CorporatePlayingCardsTemplate from '@/components/templates/products/CorporatePlayingCardsTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA["/corporate-playing-cards"];

export default function CorporatePlayingCardsPage() {
  return <CorporatePlayingCardsTemplate />;
}
