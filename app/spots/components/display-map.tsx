'use client';

import MapGL, {
  FullscreenControl,
  type MapProps,
  NavigationControl,
} from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

type DisplayMapProps = {
  children: React.ReactNode;
};

export default function DisplayMap({
  children,
  ...props
}: DisplayMapProps & MapProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapboxStyle = process.env.NEXT_PUBLIC_MAPBOX_STYLE;

  return (
    <MapGL mapboxAccessToken={mapboxToken} mapStyle={mapboxStyle} {...props}>
      <NavigationControl position="top-left" />
      <FullscreenControl position="top-right" />

      {children}
    </MapGL>
  );
}
