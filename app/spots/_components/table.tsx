'use client';

import {
  type SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { useRouter } from 'next/navigation';
import { Pagination } from '@nextui-org/pagination';
import { useMediaQuery } from 'usehooks-ts';
import { Chip } from '@nextui-org/chip';

import type { Spot } from '@/types/spot';

type Props = {
  spots: Spot[];
  isSplitView?: boolean;
  pages: number;
  page: number;
  setPage: (page: number) => void;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: (descriptor: SortDescriptor) => void;
};

export default function SpotsTable({
  spots,
  isSplitView,
  pages,
  page,
  setPage,
  sortDescriptor,
  setSortDescriptor,
}: Props) {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');
  const isMediumDevice = useMediaQuery('only screen and (max-width : 1024px)');
  const labelToDisplay = isMediumDevice ? 3 : 5;
  const router = useRouter();
  const gotoSpot = (slug: string) => router.push(`/spots/${slug}`);

  return (
    <Table
      classNames={{ wrapper: 'flex-grow' }}
      aria-label="A table of skate spots"
      selectionMode="single"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination isCompact showControls page={page} total={pages} onChange={(page) => setPage(page)} />
        </div>
      }
    >
      {!isSmallDevice && !isSplitView ? (
        <TableHeader>
          <TableColumn key="name" allowsSorting>
            Name
          </TableColumn>
          <TableColumn key="address" allowsSorting>
            Address
          </TableColumn>
          <TableColumn>Labels</TableColumn>
          <TableColumn key="bustLevel" allowsSorting>
            Bust Level
          </TableColumn>
        </TableHeader>
      ) : (
        <TableHeader>
          <TableColumn key="name" allowsSorting>
            Name
          </TableColumn>
          <TableColumn key="address" allowsSorting>
            Address
          </TableColumn>

          <TableColumn key="bustLevel" allowsSorting>
            Bust Level
          </TableColumn>
        </TableHeader>
      )}

      <TableBody emptyContent={'No rows to display.'} items={spots}>
        {(spot) =>
          !isSmallDevice && !isSplitView ? (
            <TableRow key={spot.id} className="cursor-pointer" onClick={() => gotoSpot(spot.slug)}>
              <TableCell>{spot.name}</TableCell>
              <TableCell>
                <span className="md:truncate">
                  {spot.address} {spot.addressLine2} {spot.city}, {spot.state} {spot.zip}
                </span>
              </TableCell>
              <TableCell>
                {spot.spotsToLabels.slice(0, labelToDisplay).map(({ label }) => (
                  <Chip key={label.id} color={label.type} className="mb-3 me-3 xl:mb-0">
                    {label.name}
                  </Chip>
                ))}

                {spot.spotsToLabels.length >= 5 && (
                  <Chip color="default" className="mb-3 me-3 xl:mb-0">
                    +{spot.spotsToLabels.length - labelToDisplay} more
                  </Chip>
                )}
              </TableCell>
              <TableCell>{spot.bustLevel}</TableCell>
            </TableRow>
          ) : (
            <TableRow key={spot.id} className="cursor-pointer" onClick={() => gotoSpot(spot.slug)}>
              <TableCell>{spot.name}</TableCell>
              <TableCell>
                <span className="md:truncate">
                  {spot.address} {spot.addressLine2} {spot.city}, {spot.state} {spot.zip}
                </span>
              </TableCell>

              <TableCell>{spot.bustLevel}</TableCell>
            </TableRow>
          )
        }
      </TableBody>
    </Table>
  );
}
