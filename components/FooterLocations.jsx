import Link from 'next/link';
import { LOCATIONS } from '@/data/locations';

/**
 * The "Locations" quick-link column in the site footer.
 *
 * Rendered by every page — master and location alike — from data/locations.js,
 * so a new location appears in the footer of every page without touching any
 * page file. It is a plain .ftl-col like the three columns beside it, so it
 * inherits the footer's existing type, colour and hover treatment.
 */
export default function FooterLocations({ location = null }) {
  return (
    <div className={"ftl-col"}>
      <h4>
        Locations
      </h4>
      <ul>
        {LOCATIONS.map((entry) => (
          <li key={entry.slug}>
            <Link
              href={`/${entry.slug}`}
              aria-current={location && location.slug === entry.slug ? 'page' : undefined}
            >
              {entry.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
