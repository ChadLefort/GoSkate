'use client';

import MapGL, { Marker, MarkerDragEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useEffect, useState } from 'react';

import type { Point } from '@/types/point';

import Pin from './pin';

type MapProps = {
  coordinates?: Point;
  setCoordinates?: (coordinates: Point) => void;
};

export default function Map({ coordinates, setCoordinates }: MapProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapboxStyle = process.env.NEXT_PUBLIC_MAPBOX_STYLE;

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
      reuseMaps
      mapStyle={mapboxStyle}
      onMove={(evt) => setViewState(evt.viewState)}
      maxZoom={20}
      minZoom={3}
    >
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
