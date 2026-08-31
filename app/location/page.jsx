import LocationTemplate from '@/components/templates/LocationTemplate';
import { MASTER_METADATA } from '@/data/master-metadata';

export const metadata = MASTER_METADATA['/location'];

export default function LocationPage() {
  return <LocationTemplate />;
}
