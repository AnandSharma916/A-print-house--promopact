'use client';

/**
 * <img> that removes itself if the file fails to load.
 *
 * Replaces the one inline onerror="this.style.display='none'" in the legacy
 * markup (the decorative CTA image on the home page).
 */
export default function HideOnError(props) {
  // eslint-disable-next-line jsx-a11y/alt-text -- alt comes through in props
  return <img {...props} onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
}
