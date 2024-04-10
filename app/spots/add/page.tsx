'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Input, Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Slider } from '@nextui-org/slider';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useState } from 'react';
import type { AddressAutofillProps } from '@mapbox/search-js-react/dist/components/AddressAutofill';
import type { AddressAutofillRetrieveResponse } from '@mapbox/search-js-core';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectItem } from '@nextui-org/select';

import { addSpot, getSpotBySlug, getSpotLabels } from '@/actions/spot-actions';
import { title } from '@/components/primitives';
import type { AddSpot, SpotLabel } from '@/actions/spot-actions';
import type { Point } from '@/types/point';
import { useUploadThing } from '@/utils/uploadthing';
import { PRIMARY_BRAND_COLOR } from '@/config';

import Map from '../components/controlled-map';
import Upload from '../components/upload';

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
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'Zip is required'),
  description: z.string().min(1, 'Description is required'),
  labels: z.string().min(1, 'Labels are required'),
});

export default function AddSpotPage() {
  const [categories, setCategories] = useState<SpotLabel[]>([]);
  const router = useRouter();
  const [coordinates, setCoordinates] = useState<Point>();
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload, permittedFileInfo, isUploading } =
    useUploadThing('spotImages');

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const [token, setToken] = useState('');
  const {
    register,
    handleSubmit,
    control,
    formState: { defaultValues, errors, isSubmitting, isValid },
  } = useForm<AddSpot>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      address: '',
      addressLine2: '',
      city: '',
      state: '',
      zip: '',
      description: '',
      bustLevel: 0,
      labels: '',
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<AddSpot> = async (data) => {
    if (coordinates) {
      const spot = await addSpot({
        ...data,
        location: coordinates,
        labels: (data.labels as string).split(','),
      });

      if (spot) {
        await startUpload(files, { spotId: spot.id });
      }

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

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getSpotLabels();
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  return (
    <>
      <h1 className={clsx(title(), 'mb-6')}>Add Spots</h1>

      {token && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="col-span-3">
              <div
                className="flex flex-col justify-center gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Input
                  className="max-w-3xl"
                  label="Name"
                  isRequired
                  defaultValue={defaultValues?.name}
                  isInvalid={Boolean(errors.name)}
                  errorMessage={errors.name?.message}
                  {...register('name')}
                />

                <Controller
                  name="labels"
                  control={control}
                  render={({ field }) => (
                    <Select
                      items={categories}
                      label="Labels"
                      isRequired
                      placeholder="Select Labels"
                      selectionMode="multiple"
                      className=""
                      isInvalid={Boolean(errors.labels)}
                      errorMessage={errors.labels?.message}
                      {...field}
                    >
                      {(label) => (
                        <SelectItem key={label.id}>{label.name}</SelectItem>
                      )}
                    </Select>
                  )}
                />

                <div className="min-h-14">
                  <AddressAutofill
                    accessToken={token}
                    onRetrieve={handleRetrieve}
                    theme={{
                      variables: {
                        colorPrimary: PRIMARY_BRAND_COLOR,
                        colorBackground: '#27272a',
                        colorBackgroundHover: '#52525b80',
                        colorText: '#fff',
                      },
                    }}
                    popoverOptions={{
                      offset: 15,
                    }}
                  >
                    <Input
                      className="max-w-3xl"
                      label="Address"
                      isRequired
                      defaultValue={defaultValues?.address}
                      isInvalid={Boolean(errors.address)}
                      errorMessage={errors.address?.message}
                      {...register('address')}
                    />
                  </AddressAutofill>
                </div>

                <Input
                  className="max-w-3xl"
                  label="Address Line 2"
                  placeholder="Address Line 2"
                  isInvalid={Boolean(errors.addressLine2)}
                  errorMessage={errors.addressLine2?.message}
                  autoComplete="address-line2"
                  {...register('addressLine2')}
                />

                <Input
                  className="max-w-3xl"
                  label="City"
                  isRequired
                  defaultValue={defaultValues?.city}
                  isInvalid={Boolean(errors.city)}
                  errorMessage={errors.city?.message}
                  autoComplete="address-level2"
                  {...register('city')}
                />

                <div className="flex">
                  <Input
                    className="max-w-3xl"
                    label="State"
                    isRequired
                    defaultValue={defaultValues?.state}
                    isInvalid={Boolean(errors.state)}
                    errorMessage={errors.state?.message}
                    autoComplete="address-level1"
                    {...register('state')}
                  />

                  <Input
                    className="max-w-3xl ms-3"
                    label="Zip"
                    isRequired
                    defaultValue={defaultValues?.zip}
                    isInvalid={Boolean(errors.zip)}
                    errorMessage={errors.zip?.message}
                    autoComplete="postal-code"
                    {...register('zip')}
                  />
                </div>

                <Textarea
                  className="max-w-3xl"
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
                      className="max-w-3xl"
                      {...field}
                    />
                  )}
                />

                <label className="text-small">Images</label>
                <Upload
                  files={files}
                  setFiles={setFiles}
                  fileTypes={fileTypes}
                />
              </div>
            </div>

            <div className="col-span-3 min-h-96">
              <div className="h-full">
                <Map
                  coordinates={coordinates}
                  setCoordinates={setCoordinates}
                />
              </div>
            </div>
          </div>

          <Button
            size="lg"
            variant="shadow"
            type="submit"
            isLoading={isSubmitting || isUploading}
            isDisabled={isSubmitting || isUploading || !isValid}
            className="mt-12 w-full"
          >
            Add Spot
          </Button>
        </form>
      )}
    </>
  );
}
