import NextLink from 'next/link';
import { Button } from '@nextui-org/button';
import { auth } from '@clerk/nextjs';
import { Suspense } from 'react';

import { title } from '@/components/primitives';
import { getSpots } from '@/actions/spot-actions';

import Spots from './components/spots';
import SkeletonTable from './components/skeleton-table';

export default async function SpotsPage() {
  const data = await getSpots();
  const { userId } = auth();

  return (
    <>
      <div className="flex justify-between align-middle mb-6">
        <h1 className={title()}>Spots</h1>
        {userId && (
          <Button size="lg" variant="shadow">
            <NextLink href="/spots/add">Add Spots</NextLink>
          </Button>
        )}
      </div>

      <Suspense fallback={<SkeletonTable />}>
        <Spots spots={data} />
      </Suspense>
    </>
  );
}
