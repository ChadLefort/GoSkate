import clsx from 'clsx';

import { title } from '@/components/primitives';
import { getSpotLabels, getSpots, getSpotsTotal, searchSpots, type SpotsParams } from '@/actions/spot-actions';
import type { Spot } from '@/types/spot';
import Spots from '@/app/spots/_components/spots';

export default async function SpotsPage({ searchParams: { search } }: { searchParams: { search: string } }) {
  let data: Spot[] = [];

  const total = await getSpotsTotal(search);
  const labels = await getSpotLabels();
  const rowsPerPage = 20;
  const pages = Math.ceil(total / rowsPerPage);
  const spotParams: SpotsParams = {
    direction: 'descending',
    column: 'created_at',
    offset: 0,
    limit: rowsPerPage,
  };

  if (search) {
    data = await searchSpots(search, spotParams);
  } else {
    data = await getSpots(spotParams);
  }

  return (
    <>
      <h1 className={clsx(title(), 'mb-3')}>Spots</h1>

      <Spots spots={data} rowsPerPage={rowsPerPage} pages={pages} labels={labels} search={search} />
    </>
  );
}
