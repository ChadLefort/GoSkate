'use client';

import MapGL, { FullscreenControl, type MapProps, NavigationControl } from 'react-map-gl';
import { useTheme } from 'next-themes';

type DisplayMapProps = {
  children: React.ReactNode;
};

export default function DisplayMap({ children, ...props }: DisplayMapProps & MapProps) {
  const { theme } = useTheme();
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapboxStyle =
    theme === 'dark' ? process.env.NEXT_PUBLIC_MAPBOX_STYLE_DARK : process.env.NEXT_PUBLIC_MAPBOX_STYLE_LIGHT;

  return (
    <MapGL mapboxAccessToken={mapboxToken} mapStyle={mapboxStyle} {...props}>
      <NavigationControl position="top-left" />
      <FullscreenControl position="top-right" />

      {children}
    </MapGL>
  );
}
