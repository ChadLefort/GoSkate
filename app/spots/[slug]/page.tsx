import { Suspense } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { notFound, redirect } from 'next/navigation';

import { deleteSpot, getNearbySpots, getSpotBySlug } from '@/actions/spot-actions';
import Spot from '@/app/spots/_components/spot';

type Props = {
  params: {
    slug: string;
  };
};

export default async function SpotPage({ params }: Props) {
  const spot = await getSpotBySlug(params.slug);

  if (!spot) notFound();

  const nearbySpots = await getNearbySpots(spot.location, spot.id);

  const handleDelete = async () => {
    'use server';

    deleteSpot(spot.id);
    redirect('/spots');
  };

  return (
    <Suspense fallback={<Spinner />}>
      {spot && <Spot spot={spot} nearbySpots={nearbySpots} handleDelete={handleDelete} />}
    </Suspense>
  );
}
