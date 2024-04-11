'use client';

import { useEffect, useMemo, useState } from 'react';
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
  const [viewState, setViewState] = useState({
    latitude: 34.100028,
    longitude: -118.338894,
    zoom: 17,
  });

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
    <div className="flex flex-col h-full">
      <Tabs classNames={{ panel: 'flex flex-grow' }}>
        {!isSmallDevice && (
          <Tab key="split" title="Split View">
            <div className="flex-grow grid grid-cols-1 md:grid-cols-8 gap-3">
              <div className="h-full col-span-4 m-h-96">{map}</div>

              <div className="col-span-4 flex">
                <SpotsTable spots={spots} isSplitView />
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
