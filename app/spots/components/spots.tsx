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

import type { Spot } from '@/actions/spot-actions';

type Props = {
  spots: Spot[];
};

export default function Spots({ spots }: Props) {
  const router = useRouter();
  const gotoSpot = (slug: string) => router.push(`/spots/${slug}`);

  return (
    <Table aria-label="A table of skate spots" selectionMode="single">
      <TableHeader>
        <TableColumn width={20}>Name</TableColumn>
        <TableColumn width={70}>Address</TableColumn>
        <TableColumn width={10}>Bust Level</TableColumn>
      </TableHeader>

      <TableBody emptyContent={'No rows to display.'}>
        {spots.map((spot) => (
          <TableRow
            key={spot.id}
            className="cursor-pointer"
            onClick={() => gotoSpot(spot.slug)}
          >
            <TableCell>{spot.name}</TableCell>
            <TableCell>{spot.address}</TableCell>
            <TableCell>{spot.bustLevel}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
