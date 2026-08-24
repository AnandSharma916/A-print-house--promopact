import { notFound } from 'next/navigation';
import { PRODUCT_TEMPLATES } from '@/components/templates/products';
import { LOCATIONS, PRODUCTS } from '@/data/locations';
import { getLocation, getProduct } from '@/lib/locations';
import { productMetadata } from '@/lib/seo';

/* One route for every location/product pair. The template it picks is the
   master product page itself, so /nepal/products/poker-cards and /poker-cards
   render the same markup, images and animations; the only difference is the
   Manufacturer / Supplier / Exporter / Wholesaler block the template renders
   from the location's own content. */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCATIONS.flatMap((location) =>
    PRODUCTS.map((product) => ({ location: location.slug, product: product.slug }))
  );
}

export async function generateMetadata({ params }) {
  const { location: locationSlug, product: productSlug } = await params;
  const location = getLocation(locationSlug);
  if (!location || !getProduct(productSlug)) return {};
  return productMetadata(location, productSlug);
}

export default async function LocationProductPage({ params }) {
  const { location: locationSlug, product: productSlug } = await params;

  const location = getLocation(locationSlug);
  const product = getProduct(productSlug);
  const Template = PRODUCT_TEMPLATES[productSlug];

  if (!location || !product || !Template) notFound();

  return <Template location={location} />;
}
