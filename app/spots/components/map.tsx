'use client';

import MapGL, { GeolocateControl, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Map() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapboxStyle = process.env.NEXT_PUBLIC_MAPBOX_STYLE;
  const { latitude, longitude } = {
    latitude: 34.100028,
    longitude: -118.338894,
  };

  return (
    <MapGL
      mapboxAccessToken={mapboxToken}
      reuseMaps
      mapStyle={mapboxStyle}
      initialViewState={{
        latitude,
        longitude,
        zoom: 17,
      }}
      maxZoom={20}
      minZoom={3}
    >
      <Marker
        latitude={latitude}
        longitude={longitude}
        anchor="bottom"
      ></Marker>
      <GeolocateControl />
    </MapGL>
  );
}
