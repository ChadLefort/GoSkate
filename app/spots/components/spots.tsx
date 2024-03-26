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
import { useState } from 'react';

import type { Spot } from '@/actions/spot-actions';

type Props = {
  spots: Spot[];
};

export default function Spots({ spots }: Props) {
  const router = useRouter();
  const gotoSpot = (slug: string) => router.push(`/spots/${slug}`);
  const [selectedKeys, setSelectedKeys] = useState(new Set(['2']));

  return (
    <Table
      aria-label="A table of skate spots"
      selectionMode="single"
      selectedKeys={selectedKeys}
    >
      <TableHeader>
        <TableColumn width={20}>Name</TableColumn>
        <TableColumn width={70}>Address</TableColumn>
        <TableColumn width={10}>Bust Level</TableColumn>
      </TableHeader>

      <TableBody emptyContent={'No rows to display.'}>
        {spots.map((spot) => (
          <TableRow key={spot.id} onClick={() => gotoSpot(spot.slug)}>
            <TableCell>{spot.name}</TableCell>
            <TableCell>{spot.address}</TableCell>
            <TableCell>{spot.bustLevel}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
