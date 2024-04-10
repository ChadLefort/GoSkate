'use client';

import { useMemo, useState } from 'react';
import { Marker, Popup } from 'react-map-gl';
import { Link } from '@nextui-org/link';
import { Tab, Tabs } from '@nextui-org/tabs';
import { useMediaQuery } from 'usehooks-ts';

import type { Spot } from '@/actions/spot-actions';

import DisplayMap from './display-map';
import Pin from './pin';
import SpotsTable from './table';

type Props = {
  spots: Spot[];
};

export default function Spots({ spots }: Props) {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');
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

  const map = useMemo(
    () => (
      <DisplayMap
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 3.5,
        }}
        style={{ width: '100%', height: '100%' }}
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
    ),
    [pins, popupInfo]
  );

  return (
    <div className="flex flex-col h-full">
      <Tabs classNames={{ panel: 'flex flex-grow' }}>
        {!isSmallDevice && (
          <Tab key="split" title="Split View">
            <div className="flex-grow grid grid-cols-1 md:grid-cols-8 gap-3">
              <div className="h-full col-span-4 m-h-96">{map}</div>

              <div className="col-span-4 flex">
                <SpotsTable spots={spots} />
              </div>
            </div>
          </Tab>
        )}
        <Tab key="map" title="Map">
          <div className="flex flex-grow">{map}</div>
        </Tab>
        <Tab key="list" title="List">
          <SpotsTable spots={spots} />
        </Tab>
      </Tabs>
    </div>
  );
}
