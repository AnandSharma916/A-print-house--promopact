/* The India master route. Its markup lives in CardGamesTemplate, shared
   with every /[location] route, and its metadata in data/master-metadata.js,
   shared with lib/seo.js. Passing no location is what makes this the master:
   the template falls back to the unprefixed hrefs and renders no location
   sections. */
import CardGamesTemplate from '@/components/templates/products/CardGamesTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA["/card-games"];

export default function CardGamesPage() {
  return <CardGamesTemplate />;
}
