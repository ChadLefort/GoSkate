'use client';

import { Image } from '@nextui-org/image';
import NextImage from 'next/image';
import { Marker } from 'react-map-gl';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { Chip } from '@nextui-org/chip';
import { Card, CardFooter } from '@nextui-org/card';
import clsx from 'clsx';

import { title } from '@/components/primitives';
import type { SpotWithImages } from '@/types/spot';
import ConfirmModal from '@/app/spots/_components/confirm-modal';
import DisplayMap from '@/app/spots/_components/display-map';
import Pin from '@/app/spots/_components/pin';
import type { ServerActionResponse } from '@/types/server-action';
import type { Spot } from '@/types/spot';
import ImageModal from '@/app/spots/_components/image-modal';

type SpotProps = {
  spot: SpotWithImages;
  nearbySpots: SpotWithImages[];
  handleDelete: () => Promise<ServerActionResponse<Spot> | object | undefined>;
};

export default function Spot({ spot, nearbySpots, handleDelete }: SpotProps) {
  const { has } = useAuth();
  const isAdmin = has && has({ role: 'org:admin' });

  return (
    <>
      <h1 className={title()}>{spot.name}</h1>

      <div className="flex items-center justify-between">
        <div>
          {spot.spotsToLabels.map(({ label }) => (
            <Chip key={label.id} color={label.type} className="me-3">
              {label.name}
            </Chip>
          ))}
        </div>

        {isAdmin && <ConfirmModal spot={spot} handleDelete={handleDelete} />}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {spot.images.map((image) => (
          <ImageModal key={image.id} image={image}>
            {({ onOpen }) => (
              <Image
                as={NextImage}
                src={image.url}
                height={200}
                width={400}
                onClick={onOpen}
                isZoomed
                className="size-full max-h-52 cursor-pointer object-fill"
                classNames={{
                  wrapper: 'flex flex-1',
                  zoomedWrapper: 'flex flex-1',
                }}
                alt={spot.name}
              />
            )}
          </ImageModal>
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
            <Marker latitude={spot.location.lat} longitude={spot.location.lng} anchor="bottom">
              <Pin size={40} />
            </Marker>
          </DisplayMap>
        </div>
      )}

      <div>
        <p className="mb-3 whitespace-pre-line">{spot.description}</p>

        <p className="mb-3">
          <span className="font-bold">Address: </span>
          <Link
            href={`https://www.google.com/maps?q=${spot.location.lat},${spot.location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {spot.address} {spot.addressLine2} {spot.city}, {spot.state} {spot.zip}
          </Link>
        </p>

        <p className="mb-3">
          <span className="font-bold">Bust Level: </span> {spot.bustLevel}
        </p>
      </div>

      {nearbySpots.length ? (
        <div className="flex flex-col">
          <h2 className={clsx(title({ size: 'sm' }), 'mb-4')}>Nearby Spots</h2>
          <div className="columns-6">
            {nearbySpots.map((nearbySpot) => (
              <Link key={nearbySpot.id} href={`/spots/${nearbySpot.slug}`}>
                <Card isFooterBlurred isPressable className="col-span-12 h-[250px] w-full sm:col-span-7">
                  <Image
                    removeWrapper
                    alt="Relaxing app background"
                    className="z-0 h-full w-full object-cover"
                    src={nearbySpot.images.length ? nearbySpot.images[0].url : '/placeholder-spot.webp'}
                  />
                  <CardFooter className="absolute bottom-0 z-10 border-t-1 border-default-600 bg-black/40 dark:border-default-100">
                    <div className="flex flex-col items-start text-white">
                      <b>{nearbySpot.name}</b>
                      <p className="text-tiny">
                        {nearbySpot.address} {nearbySpot.addressLine2}
                      </p>
                      <p className="text-tiny">
                        {nearbySpot.city}, {nearbySpot.state} {nearbySpot.zip}
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
  );
}
