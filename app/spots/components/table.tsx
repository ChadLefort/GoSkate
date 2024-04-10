'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Pagination } from '@nextui-org/pagination';
import { useMediaQuery } from 'usehooks-ts';

import type { Spot } from '@/actions/spot-actions';

type Props = {
  spots: Spot[];
};

export default function SpotsTable({ spots }: Props) {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');
  const router = useRouter();
  const gotoSpot = (slug: string) => router.push(`/spots/${slug}`);
  const [page, setPage] = useState(1);
  const rowsPerPage = isSmallDevice ? 8 : 20;

  const pages = Math.ceil(spots.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return spots.slice(start, end);
  }, [page, rowsPerPage, spots]);

  return (
    <Table
      classNames={{ wrapper: 'flex-grow' }}
      aria-label="A table of skate spots"
      selectionMode="single"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
    >
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Address</TableColumn>
        <TableColumn>Bust Level</TableColumn>
      </TableHeader>

      <TableBody emptyContent={'No rows to display.'}>
        {items.map((spot) => (
          <TableRow
            key={spot.id}
            className="cursor-pointer"
            onClick={() => gotoSpot(spot.slug)}
          >
            <TableCell>{spot.name}</TableCell>
            <TableCell>
              <span className="md:truncate">
                {spot.address} {spot.addressLine2} {spot.city}, {spot.state}{' '}
                {spot.zip}
              </span>
            </TableCell>
            <TableCell>{spot.bustLevel}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
