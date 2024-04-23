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
  isLoading: boolean;
  spots: Spot[];
  isSplitView?: boolean;
  pages: number;
  page: number;
  sortDescriptor: SortDescriptor;
  handlePageChange: (page: number) => void;

  handleSortChange: (descriptor: SortDescriptor) => void;
};

export default function SpotsTable({
  isLoading,
  spots,
  isSplitView,
  pages,
  page,
  sortDescriptor,
  handlePageChange,

  handleSortChange,
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
      onSortChange={handleSortChange}
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            initialPage={page}
            total={pages}
            onChange={(page) => handlePageChange(page)}
          />
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
          <TableColumn key="city" allowsSorting>
            City
          </TableColumn>
          <TableColumn key="state" allowsSorting>
            State
          </TableColumn>
          <TableColumn key="zip" allowsSorting>
            Zip
          </TableColumn>
          <TableColumn>Labels</TableColumn>
          <TableColumn key="bust_level" allowsSorting>
            Bust Level
          </TableColumn>
        </TableHeader>
      ) : (
        <TableHeader>
          <TableColumn key="name" allowsSorting>
            Name
          </TableColumn>
          <TableColumn key="city" allowsSorting>
            City
          </TableColumn>
          <TableColumn key="state" allowsSorting>
            State
          </TableColumn>
          <TableColumn key="bust_level" allowsSorting>
            Bust Level
          </TableColumn>
        </TableHeader>
      )}

      <TableBody emptyContent="No rows to display." items={spots} isLoading={isLoading}>
        {(spot) =>
          !isSmallDevice && !isSplitView ? (
            <TableRow key={spot.id} className="cursor-pointer" onClick={() => gotoSpot(spot.slug)}>
              <TableCell>{spot.name}</TableCell>
              <TableCell>{spot.address}</TableCell>
              <TableCell>{spot.city}</TableCell>
              <TableCell>{spot.state}</TableCell>
              <TableCell>{spot.zip}</TableCell>
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
              <TableCell>{spot.city}</TableCell>
              <TableCell>{spot.state}</TableCell>
              <TableCell>{spot.bustLevel}</TableCell>
            </TableRow>
          )
        }
      </TableBody>
    </Table>
  );
}
