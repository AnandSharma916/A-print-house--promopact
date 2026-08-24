import { ROLES } from '@/data/locations';
import { PRODUCT_IMAGES } from '@/data/product-images';
import { getProduct, roleContent } from '@/lib/locations';

/**
 * The only part of a product page that differs between locations: the
 * Manufacturer / Supplier / Exporter / Wholesaler copy from the content doc.
 *
 * Renders nothing at all when there is no location (the master India routes)
 * or when the doc does not cover this location/product pair — a missing
 * section is left out rather than filled with another location's words. India
 * has no tab in the doc, so /india/* product pages show none of this.
 *
 * Each role gets a full-width section that alternates side and background the
 * way the rest of the page does: text left on cream, text right on surface,
 * and so on. The markup is the page's own introduction-section lockup
 * (.heritage__grid + .media-frame), so the type, the ornate frame, the split
 * heading animation and the responsive collapse all come from the stylesheet
 * that was already there. The four pictures are the product page's own, shared
 * by every location — see data/product-images.js.
 */
export default function LocationProductSections({ location, product }) {
  if (!location) return null;

  const entry = getProduct(product);
  if (!entry) return null;

  const content = roleContent(location.slug, entry.slug);
  if (!content) return null;

  const images = PRODUCT_IMAGES[entry.slug] ?? [];

  return (
    <>
      {ROLES.map(({ key, label }, i) => {
        const paragraphs = content[key];
        if (!paragraphs || !paragraphs.length) return null;

        const flipped = i % 2 === 1;
        const image = images[i];

        return (
          <section
            key={key}
            className={`section section--padded ${flipped ? 'bg-surface' : 'bg-cream'}`}
            data-location-section=""
          >
            <div className={`container heritage__grid loc-role${flipped ? ' loc-role--flip' : ''}`}>
              <div className={"heritage__text"}>
                <span className={"eyebrow"}>
                  {location.name}
                </span>
                {/* One interpolation, not four: React would otherwise split the
                    heading into separate text nodes with comment markers
                    between them, which reads badly to anything parsing the
                    page — and SplitType re-splits it on mount anyway. */}
                <h2 className={"headline-lg heritage__title"} data-split="">
                  {`${entry.name} ${label} in ${location.name}`}
                </h2>
                {paragraphs.map((text, n) => (
                  <p className={"body-md heritage__p"} key={n}>
                    {text}
                  </p>
                ))}
              </div>
              {image ? (
                <div className={"heritage__media"}>
                  <div className={"media-frame"}>
                    <img alt={image.alt} src={image.src} />
                    <div className={"media-frame__ring"}></div>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        );
      })}
    </>
  );
}
