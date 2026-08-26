import LocationTemplate from '@/components/templates/LocationTemplate';

export const metadata = {
  title: "Locations — A India Print House",
  description: "View all the regions served by A India Print House.",
  alternates: { canonical: "/location" },
};

export default function LocationPage() {
  return <LocationTemplate />;
}
