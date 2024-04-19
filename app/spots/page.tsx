import clsx from 'clsx';

import { title } from '@/components/primitives';
import { getSpotLabels, getSpots, searchSpots, type SpotsParams } from '@/actions/spot-actions';
import type { Spot } from '@/types/spot';
import Spots from '@/app/spots/_components/spots';
import type { ServerActionResponse } from '@/types/server-action';
import Error from '@/components/error';

import { type URLSearchParams, validateSearchParams } from './_utils/validate-search-params';

export default async function SpotsPage({ searchParams }: { searchParams: URLSearchParams }) {
  let data: Spot[] = [];
  let results: ServerActionResponse<Spot[]>;
  const labels = await getSpotLabels();
  const rowsPerPage = 20;
  const { search, page, column, direction } = validateSearchParams(searchParams);
  const spotParams: SpotsParams = {
    direction,
    column,
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
  };

  if (search) {
    results = await searchSpots(search, spotParams);
    data = results.data;
  } else {
    results = await getSpots(spotParams);
    data = results.data;
  }

  if (!results.success) {
    return <Error message={results.message} error={results.error} />;
  }

  return (
    <>
      <h1 className={clsx(title(), 'mb-3')}>Spots</h1>
      <Spots spots={data} rowsPerPage={rowsPerPage} labels={labels.data} />
    </>
  );
}
