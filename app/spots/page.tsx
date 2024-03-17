import NextLink from 'next/link';
import { Button } from '@nextui-org/button';

import { title } from '@/components/primitives';
import { getData } from '@/actions/spot-actions';

import Spots from './components/spots';

export default async function SpotsPage() {
  const data = await getData();

  return (
    <>
      <div className="flex justify-between align-middle mb-6">
        <h1 className={title()}>Spots</h1>
        <Button size="lg" variant="shadow">
          <NextLink href="/spots/add">Add Spots</NextLink>
        </Button>
      </div>

      <Spots spots={data} />
    </>
  );
}
