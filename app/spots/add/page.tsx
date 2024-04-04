'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Input, Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Slider } from '@nextui-org/slider';
import { Card, CardBody } from '@nextui-org/card';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useState } from 'react';
import type { AddressAutofillProps } from '@mapbox/search-js-react/dist/components/AddressAutofill';
import type { AddressAutofillRetrieveResponse } from '@mapbox/search-js-core';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { addSpot, getSpotBySlug } from '@/actions/spot-actions';
import { title } from '@/components/primitives';
import type { Spot, UpsertSpot } from '@/actions/spot-actions';
import type { Point } from '@/types/point';

import Map from '../components/map';

const AddressAutofill = dynamic(
  async () => {
    const mod = await import('@mapbox/search-js-react');
    return mod.AddressAutofill as React.FC<AddressAutofillProps>;
  },
  {
    ssr: false,
  }
);

const validateSlug = async (slug: string) => {
  const spot = await getSpotBySlug(slug);
  return !Boolean(spot?.id);
};

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .refine(validateSlug, (slug) => ({
      message: `${slug} is already taken`,
    })),
  address: z.string().min(1, 'Address is required'),
  description: z.string(),
  bustLevel: z.number().min(0, 'Bust level must be at least 0'),
});

export default function AddSpotPage() {
  const router = useRouter();
  const [coordinates, setCoordinates] = useState<Point>();

  const [token, setToken] = useState('');
  const {
    register,
    handleSubmit,
    control,
    formState: { defaultValues, errors, isSubmitting, isValid },
  } = useForm<Spot>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      address: '',
      description: '',
      bustLevel: 0,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<UpsertSpot> = (data) => {
    if (coordinates) {
      addSpot({ ...data, location: coordinates });
      router.push('/spots');
    }
  };

  const handleRetrieve = useCallback(
    (res: AddressAutofillRetrieveResponse) => {
      const [feature] = res.features;
      const [longitude, latitude] = feature.geometry.coordinates;

      setCoordinates({ lat: latitude, lng: longitude });
    },
    [setCoordinates]
  );

  useEffect(() => {
    const setConfig = async () => {
      const { config } = await import('@mapbox/search-js-react');
      const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
      setToken(accessToken);
      config.accessToken = accessToken;
    };

    setConfig();
  }, []);

  return (
    <>
      <h1 className={clsx(title(), 'mb-6')}>Add Spots</h1>

      {token && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-4 h-full">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              className="max-w-3xl mb-4"
              label="Name"
              isRequired
              defaultValue={defaultValues?.name}
              isInvalid={Boolean(errors.name)}
              errorMessage={errors.name?.message}
              {...register('name')}
            />

            <AddressAutofill accessToken={token} onRetrieve={handleRetrieve}>
              <Input
                className="max-w-3xl mb-4"
                label="Address"
                isRequired
                defaultValue={defaultValues?.address}
                isInvalid={Boolean(errors.address)}
                errorMessage={errors.address?.message}
                {...register('address')}
              />
            </AddressAutofill>

            <Textarea
              className="max-w-3xl mb-4"
              label="Description"
              placeholder="Enter your description"
              isRequired
              defaultValue={defaultValues?.description}
              isInvalid={Boolean(errors.description)}
              errorMessage={errors.description?.message}
              {...register('description')}
            />

            <Controller
              name="bustLevel"
              control={control}
              defaultValue={defaultValues?.bustLevel}
              render={({ field }) => (
                <Slider
                  size="md"
                  step={1}
                  color="foreground"
                  label="Bust Level"
                  showSteps={true}
                  maxValue={10}
                  minValue={0}
                  defaultValue={0.4}
                  className="max-w-3xl mb-4"
                  {...field}
                />
              )}
            />

            <Button
              size="lg"
              variant="shadow"
              type="submit"
              className="max-w-none xl:max-w-xs"
              isLoading={isSubmitting}
              isDisabled={isSubmitting || !isValid}
            >
              Add Spot
            </Button>
          </form>

          <Card>
            <CardBody className="min-h-96">
              <Map coordinates={coordinates} setCoordinates={setCoordinates} />
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
}
