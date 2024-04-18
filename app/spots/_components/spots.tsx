'use client';

import { useEffect, useMemo, useState } from 'react';
import { Marker, Popup } from 'react-map-gl';
import { Link } from '@nextui-org/link';
import { Tab, Tabs } from '@nextui-org/tabs';
import { useMediaQuery } from 'usehooks-ts';
import type { SortDescriptor } from '@nextui-org/table';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import type { Selection } from '@nextui-org/table';
import { IconChevronDown, IconPlus } from '@tabler/icons-react';
import { useAuth } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

import type { Spot, SpotLabel } from '@/types/spot';
import DisplayMap from '@/app/spots/_components/display-map';
import Pin from '@/app/spots/_components/pin';
import SpotsTable from '@/app/spots/_components/table';
import { getSpots, getSpotsTotal, searchSpots, type SpotsParams } from '@/actions/spot-actions';

type Props = {
  spots: Spot[];
  rowsPerPage: number;
  labels: SpotLabel[];
};

export default function Spots({ spots, rowsPerPage, labels }: Props) {
  const searchParams = useSearchParams();
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');
  const [popupInfo, setPopupInfo] = useState<Spot | null>(null);
  const [localSpots, setLocalSpots] = useState<Spot[]>(spots);
  const [labelFilter, setLabelFilter] = useState<Selection>('all');
  const [total, setTotal] = useState(1);
  const [pages, setPages] = useState(1);
  const auth = useAuth();
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'created_at',
    direction: 'descending',
  });

  const [viewState, setViewState] = useState({
    latitude: 34.100028,
    longitude: -118.338894,
    zoom: 17,
  });

  const pins = useMemo(
    () =>
      localSpots.map((spot) => (
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
    [localSpots]
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setViewState((prev) => ({
        ...prev,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        zoom: 5,
      }));
    });
  }, []);

  useEffect(() => {
    const search = searchParams.get('search') as string;
    const spotsParams: SpotsParams = {
      direction: sortDescriptor.direction,
      column: sortDescriptor.column as 'name' | 'address' | 'city' | 'state' | 'zip' | 'bust_level',
      filters: labelFilter !== 'all' ? (Array.from(labelFilter) as unknown as string[]) : undefined,
      offset: (page - 1) * rowsPerPage,
      limit: rowsPerPage,
    };

    getSpotsTotal(search, spotsParams).then((results) => setTotal(results.data));

    if (search) {
      searchSpots(search, spotsParams).then((results) => setLocalSpots(results.data));
    } else {
      getSpots(spotsParams).then((results) => setLocalSpots(results.data));
    }
  }, [sortDescriptor, labelFilter, page, rowsPerPage, searchParams, spots]);

  useEffect(() => {
    setPages(Math.ceil(total / rowsPerPage));
  }, [total, rowsPerPage]);

  const map = useMemo(
    () => (
      <DisplayMap {...viewState} onMove={(evt) => setViewState(evt.viewState)}>
        {pins}
        {popupInfo && (
          <Popup
            anchor="top"
            latitude={popupInfo.location.lat}
            longitude={popupInfo.location.lng}
            onClose={() => setPopupInfo(null)}
            closeButton={false}
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
    ),
    [pins, popupInfo, viewState]
  );

  return (
    <div className="flex flex-grow flex-row-reverse flex-wrap justify-between">
      <div className="flex">
        <Dropdown>
          <DropdownTrigger className="hidden sm:flex">
            <Button endContent={<IconChevronDown size={12} />} className="me-3">
              Labels
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Table Columns"
            closeOnSelect={false}
            selectedKeys={labelFilter}
            selectionMode="multiple"
            onSelectionChange={setLabelFilter}
          >
            {labels.map((label) => (
              <DropdownItem key={label.id} className="capitalize" color={label.type}>
                {label.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {auth.isSignedIn && (
          <Link href="/spots/add">
            <Button endContent={<IconPlus size={12} />}>Add New</Button>
          </Link>
        )}
      </div>

      <Tabs classNames={{ panel: 'flex flex-grow size-full' }}>
        {!isSmallDevice && (
          <Tab key="split" title="Split View">
            <div className="grid flex-grow grid-cols-1 gap-3 md:grid-cols-8">
              <div className="m-h-96 col-span-4 h-full">{map}</div>

              <div className="col-span-4 flex">
                <SpotsTable
                  spots={localSpots}
                  isSplitView
                  pages={pages}
                  page={page}
                  setPage={setPage}
                  sortDescriptor={sortDescriptor}
                  setSortDescriptor={setSortDescriptor}
                />
              </div>
            </div>
          </Tab>
        )}
        <Tab key="map" title="Map">
          <div className="flex flex-grow">{map}</div>
        </Tab>
        <Tab key="list" title="List">
          <SpotsTable
            spots={localSpots}
            pages={pages}
            page={page}
            setPage={setPage}
            sortDescriptor={sortDescriptor}
            setSortDescriptor={setSortDescriptor}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
