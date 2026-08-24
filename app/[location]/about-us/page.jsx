import { notFound } from 'next/navigation';
import AboutTemplate from '@/components/templates/AboutTemplate';
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
  return pageMetadata(location, '/about-us');
}

export default async function LocationAboutPage({ params }) {
  const { location: slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();
  return <AboutTemplate location={location} />;
}
