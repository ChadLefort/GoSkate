import { notFound } from 'next/navigation';

import Error from '@/components/error';
import { deleteSpot, getNearbySpots, getSpotBySlug } from '@/actions/spot-actions';
import Spot from '@/app/spots/_components/spot';
import type { SpotWithImages } from '@/types/spot';

type Props = {
  params: {
    slug: string;
  };
};

export default async function SpotPage({ params }: Props) {
  let nearbySpots: SpotWithImages[] = [];
  const results = await getSpotBySlug(params.slug);
  const spot = results.data;

  if (results.data === undefined) notFound();

  if (!results.success) {
    return <Error message={results.message} error={results.error} />;
  }

  if (spot) {
    const results = await getNearbySpots(spot.location, spot.id);
    nearbySpots = results.data;
  }

  const handleDelete = async () => {
    'use server';

    if (spot) {
      return await deleteSpot(spot.id);
    }
  };

  return spot && <Spot spot={spot} nearbySpots={nearbySpots} handleDelete={handleDelete} />;
}
