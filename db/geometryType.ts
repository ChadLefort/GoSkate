import { customType } from 'drizzle-orm/pg-core';
import { Geometry } from 'wkx';

export interface Point {
  lat: number;
  lng: number;
}

interface Coordinate {
  type: string;
  coordinates: number[];
}

export const point = customType<{ data: Point; driverData: string }>({
  dataType() {
    return 'geography';
  },
  toDriver(value: Point): string {
    return `SRID=4326;POINT(${value.lng} ${value.lat})`;
  },
  fromDriver(value: string) {
    const geometry = Geometry.parse(Buffer.from(value, 'hex'));

    const { coordinates } = geometry.toGeoJSON() as Coordinate;
    const [lng, lat] = coordinates;

    return { lat, lng } as Point;
  },
});
