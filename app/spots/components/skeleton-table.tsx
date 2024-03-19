'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { Skeleton } from '@nextui-org/skeleton';

export default function SkeletonTable() {
  return (
    <Table aria-label="A table of skate spots">
      <TableHeader>
        <TableColumn width={20}>Name</TableColumn>
        <TableColumn width={70}>Address</TableColumn>
        <TableColumn width={10}>Bust Level</TableColumn>
      </TableHeader>

      <TableBody>
        {Array(50)
          .fill(null)
          .map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-3 w-full rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-full rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-full rounded-lg" />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
