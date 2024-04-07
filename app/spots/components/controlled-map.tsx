'use client';

import MapGL, {
  FullscreenControl,
  Marker,
  MarkerDragEvent,
  NavigationControl,
} from 'react-map-gl';
import { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import type { Point } from '@/types/point';

import Pin from './pin';

type MapProps = {
  coordinates?: Point;
  setCoordinates?: (coordinates: Point) => void;
};

export default function Map({ coordinates, setCoordinates }: MapProps) {
  const { theme } = useTheme();
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapboxStyle =
    theme === 'dark'
      ? process.env.NEXT_PUBLIC_MAPBOX_STYLE_DARK
      : process.env.NEXT_PUBLIC_MAPBOX_STYLE_LIGHT;

  const [viewState, setViewState] = useState({
    latitude: 34.100028,
    longitude: -118.338894,
    zoom: 17,
  });

  const onMarkerDragEnd = useCallback(
    (event: MarkerDragEvent) => {
      const coordinates = {
        lat: event.lngLat.lat,
        lng: event.lngLat.lng,
      };

      setViewState({
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        zoom: 17,
      });

      setCoordinates && setCoordinates(coordinates);
    },
    [setCoordinates]
  );

  useEffect(() => {
    if (coordinates) {
      setViewState({
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        zoom: 17,
      });
    }
  }, [coordinates]);

  return (
    <MapGL
      {...viewState}
      mapboxAccessToken={mapboxToken}
      mapStyle={mapboxStyle}
      onMove={(evt) => setViewState(evt.viewState)}
      onMoveEnd={(evt) =>
        setCoordinates &&
        setCoordinates({
          lat: evt.viewState.latitude,
          lng: evt.viewState.longitude,
        })
      }
    >
      <NavigationControl position="top-left" />
      <FullscreenControl position="top-right" />

      <Marker
        latitude={viewState.latitude}
        longitude={viewState.longitude}
        anchor="bottom"
        draggable
        onDragEnd={onMarkerDragEnd}
      >
        <Pin size={40} />
      </Marker>
    </MapGL>
  );
}
