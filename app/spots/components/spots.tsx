'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';

import type { Spot } from '@/actions/spot-actions';

type Props = {
  spots: Spot[];
};

export default function Spots({ spots }: Props) {
  return (
    <Table aria-label="A table of skate spots">
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Address</TableColumn>
        <TableColumn>Description</TableColumn>
        <TableColumn>Bust Level</TableColumn>
      </TableHeader>
      <TableBody>
        {spots.map((spot) => (
          <TableRow key={spot.id}>
            <TableCell>{spot.name}</TableCell>
            <TableCell>{spot.address}</TableCell>
            <TableCell>{spot.description}</TableCell>
            <TableCell>{spot.bustLevel}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
