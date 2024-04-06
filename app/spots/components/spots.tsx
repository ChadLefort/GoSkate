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
import { Marker, Popup } from 'react-map-gl';
import { Link } from '@nextui-org/link';

import type { Spot } from '@/actions/spot-actions';

import DisplayMap from './display-map';
import Pin from './pin';

type Props = {
  spots: Spot[];
};

export default function Spots({ spots }: Props) {
  const router = useRouter();
  const gotoSpot = (slug: string) => router.push(`/spots/${slug}`);
  const [popupInfo, setPopupInfo] = useState<Spot | null>(null);

  const pins = useMemo(
    () =>
      spots.map((spot) => (
        <Marker
          key={spot.id}
          latitude={spot.location.lat}
          longitude={spot.location.lng}
          anchor="bottom"
          onClick={(event) => {
            event.originalEvent.stopPropagation();
            setPopupInfo(spot);
          }}
        >
          <Pin />
        </Marker>
      )),
    [spots]
  );

  return (
    <>
      <div className="min-h-96">
        <DisplayMap
          initialViewState={{
            latitude: 40,
            longitude: -100,
            zoom: 3.5,
          }}
        >
          {pins}
          {popupInfo && (
            <Popup
              anchor="top"
              latitude={popupInfo.location.lat}
              longitude={popupInfo.location.lng}
              onClose={() => setPopupInfo(null)}
            >
              <Link href={`/spots/${popupInfo.slug}`} className="flex-col">
                <span>{popupInfo.name}</span>
                <span>
                  {popupInfo.city}, {popupInfo.state}
                </span>
              </Link>
            </Popup>
          )}
        </DisplayMap>
      </div>

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
    </>
  );
}
