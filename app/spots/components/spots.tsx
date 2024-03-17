'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';

import { ThenArg } from '@/utils/type-helpers';
import { getData } from '@/actions/spot-actions';

type Props = {
  spots: ThenArg<ReturnType<typeof getData>>;
};

export default function Spots({ spots }: Props) {
  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>Id</TableColumn>
        <TableColumn>Name</TableColumn>
        <TableColumn>Description</TableColumn>
      </TableHeader>
      <TableBody>
        {spots.map((spot) => (
          <TableRow key={spot.id}>
            <TableCell>{spot.id}</TableCell>
            <TableCell>{spot.name}</TableCell>
            <TableCell>{spot.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
