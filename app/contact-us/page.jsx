/* The India master route. Its markup lives in ContactTemplate, shared
   with every /[location] route, and its metadata in data/master-metadata.js,
   shared with lib/seo.js. Passing no location is what makes this the master:
   the template falls back to the unprefixed hrefs and renders no location
   sections. */
import ContactTemplate from '@/components/templates/ContactTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA["/contact-us"];

export default function ContactUsPage() {
  return <ContactTemplate />;
}
