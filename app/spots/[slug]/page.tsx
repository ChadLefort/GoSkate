import { Suspense } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { redirect } from 'next/navigation';
import { Card, CardBody } from '@nextui-org/card';

import { title } from '@/components/primitives';
import { deleteSpot, getSpotBySlug } from '@/actions/spot-actions';
import { checkAdmin } from '@/actions/auth';

import ConfirmModal from '../components/confirm-modal';
import DisplayMap from '../components/display-map';

type Props = {
  params: {
    slug: string;
  };
};

export default async function SpotsPage({ params }: Props) {
  const spot = await getSpotBySlug(params.slug);
  const isAdmin = await checkAdmin();

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
        <>
          <div className="flex justify-between align-middle mb-6">
            <h1 className={title()}>{spot.name}</h1>
            {isAdmin && (
              <ConfirmModal spot={spot} handleDelete={handleDelete} />
            )}
          </div>

          {spot.location && (
            <Card>
              <CardBody className="min-h-96">
                <DisplayMap coordinates={spot.location} />
              </CardBody>
            </Card>
          )}
        </>
      )}
    </Suspense>
  );
}
