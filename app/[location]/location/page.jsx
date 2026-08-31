import { notFound } from 'next/navigation';
import LocationTemplate from '@/components/templates/LocationTemplate';
import { LOCATIONS } from '@/data/locations';
import { getLocation } from '@/lib/locations';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCATIONS.map((location) => ({ location: location.slug }));
}

export async function generateMetadata({ params }) {
  const { location: slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};
  return pageMetadata(location, '/location');
}

export default async function LocationSubPage({ params }) {
  const { location: slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();
  return <LocationTemplate location={location} />;
}
