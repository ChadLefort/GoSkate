'use client';

import { Suspense } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { Image } from '@nextui-org/image';
import { Marker } from 'react-map-gl';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

import { title } from '@/components/primitives';
import { type Spot } from '@/actions/spot-actions';
import { type SpotImage } from '@/actions/spot-images.actions';

import ConfirmModal from '../components/confirm-modal';
import DisplayMap from '../components/display-map';
import Pin from '../components/pin';

type SpotProps = {
  spot: Spot;
  images: SpotImage[];
  handleDelete: () => Promise<void>;
};

export default function Spot({ spot, images, handleDelete }: SpotProps) {
  const { has } = useAuth();
  const isAdmin = has && has({ role: 'org:admin' });

  return (
    <Suspense fallback={<Spinner />}>
      {spot && (
        <>
          <div className="flex justify-between align-middle mb-6">
            <h1 className={title()}>{spot.name}</h1>
            {isAdmin && (
              <ConfirmModal spot={spot} handleDelete={handleDelete} />
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <Image
                key={image.id}
                src={image.url}
                height={200}
                isZoomed
                className="object-fill size-full max-h-52"
                classNames={{ wrapper: 'flex' }}
                alt={spot.name}
              />
            ))}
          </div>

          {spot.location && (
            <div className="h-full">
              <DisplayMap
                initialViewState={{
                  latitude: spot.location.lat,
                  longitude: spot.location.lng,
                  zoom: 16,
                }}
              >
                <Marker
                  latitude={spot.location.lat}
                  longitude={spot.location.lng}
                  anchor="bottom"
                >
                  <Pin size={40} />
                </Marker>
              </DisplayMap>
            </div>
          )}

          <div>
            <p className="mb-3">{spot.description}</p>
            <p className="mb-3">
              <span className="font-bold">Address: </span>
              <Link
                href={`https://www.google.com/maps?q=${spot.location.lat},${spot.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {spot.address} {spot.addressLine2} {spot.city}, {spot.state}{' '}
                {spot.zip}
              </Link>
            </p>
            <p className="mb-3">
              <span className="font-bold">Bust Level: </span> {spot.bustLevel}
            </p>
          </div>
        </>
      )}
    </Suspense>
  );
}
