'use client';

import MapGL, { Marker } from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import Pin from './pin';

type MapProps = {
  coordinates: {
    lat: number;
    lng: number;
  };
};

export default function DisplayMap({ coordinates }: MapProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapboxStyle = process.env.NEXT_PUBLIC_MAPBOX_STYLE;

  return (
    <MapGL
      initialViewState={{
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        zoom: 17,
      }}
      mapboxAccessToken={mapboxToken}
      reuseMaps
      mapStyle={mapboxStyle}
      maxZoom={20}
      minZoom={3}
    >
      <Marker
        latitude={coordinates.lat}
        longitude={coordinates.lng}
        anchor="bottom"
      >
        <Pin size={40} />
      </Marker>
    </MapGL>
  );
}
