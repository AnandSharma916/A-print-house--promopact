import { notFound } from 'next/navigation';
import HomeTemplate from '@/components/templates/HomeTemplate';
import { LOCATIONS } from '@/data/locations';
import { getLocation } from '@/lib/locations';
import { pageMetadata } from '@/lib/seo';

/* A location home page is the master home page with its links rewritten into
   the location's subtree — same markup, same stylesheets, same engines. */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCATIONS.map((location) => ({ location: location.slug }));
}

export async function generateMetadata({ params }) {
  const { location: slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};
  return pageMetadata(location, '/');
}

export default async function LocationHomePage({ params }) {
  const { location: slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();
  return <HomeTemplate location={location} />;
}
