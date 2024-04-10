'use client';

import { Suspense } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { Image } from '@nextui-org/image';
import { Marker } from 'react-map-gl';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { Chip } from '@nextui-org/chip';
import { Card, CardFooter } from '@nextui-org/card';
import clsx from 'clsx';

import { title } from '@/components/primitives';
import { type Spot, type SpotWithImages } from '@/actions/spot-actions';

import ConfirmModal from '../components/confirm-modal';
import DisplayMap from '../components/display-map';
import Pin from '../components/pin';

type SpotProps = {
  spot: SpotWithImages;
  nearbySpots: SpotWithImages[];
  handleDelete: () => Promise<void>;
};

export default function Spot({ spot, nearbySpots, handleDelete }: SpotProps) {
  const { has } = useAuth();
  const isAdmin = has && has({ role: 'org:admin' });

  return (
    <Suspense fallback={<Spinner />}>
      {spot && (
        <>
          <div className="flex justify-between align-middle">
            <h1 className={title()}>{spot.name}</h1>
            {isAdmin && (
              <ConfirmModal spot={spot} handleDelete={handleDelete} />
            )}
          </div>

          <div>
            {spot.spotsToLabels.map(({ label }) => (
              <Chip key={label.id} color={label.type} className="me-3 mb-3">
                {label.name}
              </Chip>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {spot.images.map((image) => (
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
            <div className="h-full min-h-96">
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

          {nearbySpots.length ? (
            <div className="flex flex-col">
              <h2 className={clsx(title({ size: 'sm' }), 'mb-4')}>
                Nearby Spots
              </h2>
              <div className="columns-6">
                {nearbySpots.map((nearbySpot) => (
                  <Link key={nearbySpot.id} href={`/spots/${nearbySpot.slug}`}>
                    <Card
                      isFooterBlurred
                      isPressable
                      className="w-full h-[250px] col-span-12 sm:col-span-7"
                    >
                      <Image
                        removeWrapper
                        alt="Relaxing app background"
                        className="z-0 w-full h-full object-cover"
                        src={
                          nearbySpot.images.length
                            ? nearbySpot.images[0].url
                            : '/placeholder-spot.webp'
                        }
                      />
                      <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                        <div className="flex flex-col items-start text-white">
                          <b>{nearbySpot.name}</b>
                          <p className="text-tiny">
                            {nearbySpot.address} {nearbySpot.addressLine2}
                          </p>
                          <p className="text-tiny">
                            {nearbySpot.city}, {nearbySpot.state}{' '}
                            {nearbySpot.zip}
                          </p>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}
    </Suspense>
  );
}
