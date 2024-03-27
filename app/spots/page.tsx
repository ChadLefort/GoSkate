import NextLink from 'next/link';
import { Button } from '@nextui-org/button';
import { auth } from '@clerk/nextjs/server';

import { title } from '@/components/primitives';
import { getSpots } from '@/actions/spot-actions';

import Spots from './components/spots';

export default async function SpotsPage() {
  const data = await getSpots();
  const { userId } = auth();

  return (
    <>
      <div className="flex justify-between align-middle mb-6">
        <h1 className={title()}>Spots</h1>
        {userId && (
          <NextLink href="/spots/add">
            <Button size="lg" variant="shadow">
              Add Spots
            </Button>
          </NextLink>
        )}
      </div>

      <Spots spots={data} />
    </>
  );
}
