import { Suspense } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { redirect } from 'next/navigation';

import { deleteSpot, getSpotBySlug } from '@/actions/spot-actions';
import { getSpotImagesById, SpotImage } from '@/actions/spot-images.actions';

import Spot from '../components/spot';

type Props = {
  params: {
    slug: string;
  };
};

export default async function SpotPage({ params }: Props) {
  const spot = await getSpotBySlug(params.slug);
  let spotImages: SpotImage[] = [];

  if (spot) {
    spotImages = await getSpotImagesById(spot.id);
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
      {spot && (
        <Spot spot={spot} images={spotImages} handleDelete={handleDelete} />
      )}
    </Suspense>
  );
}
