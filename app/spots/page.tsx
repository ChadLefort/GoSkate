import clsx from 'clsx';

import { title } from '@/components/primitives';
import { getSpotLabels, getSpots, searchSpots } from '@/actions/spot-actions';
import type { Spot } from '@/types/spot';

import Spots from './components/spots';

export default async function SpotsPage({ searchParams: { search } }: { searchParams: { search: string } }) {
  let data: Spot[] = [];
  const labels = await getSpotLabels();

  if (search) {
    data = await searchSpots(search);
  } else {
    data = await getSpots();
  }

  return (
    <>
      <h1 className={clsx(title(), 'mb-3')}>Spots</h1>

      <Spots spots={data} labels={labels} />
    </>
  );
}
