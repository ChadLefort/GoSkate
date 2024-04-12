import { Suspense } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { redirect } from 'next/navigation';

import { deleteSpot, getNearbySpots, getSpotBySlug } from '@/actions/spot-actions';
import type { SpotWithImages } from '@/types/spot';

import Spot from '../components/spot';

type Props = {
  params: {
    slug: string;
  };
};

export default async function SpotPage({ params }: Props) {
  const spot = await getSpotBySlug(params.slug);
  let nearbySpots: SpotWithImages[] = [];

  if (spot) {
    nearbySpots = await getNearbySpots(spot.location, spot.id);
  }

  const handleDelete = async () => {
    'use server';

    if (spot) {
      deleteSpot(spot.id);
      redirect('/spots');
    }
  };

  return (
    <Suspense fallback={<Spinner />}>
      {spot && <Spot spot={spot} nearbySpots={nearbySpots} handleDelete={handleDelete} />}
    </Suspense>
  );
}
