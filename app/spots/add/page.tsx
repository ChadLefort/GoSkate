'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Input, Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Slider } from '@nextui-org/slider';

import { addSpot } from '@/actions/spot-actions';
import { title } from '@/components/primitives';
import type { Spot, UpsertSpot } from '@/actions/spot-actions';

import Map from '../components/map';

type Inputs = Spot;

export default function AddSpotPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<Inputs>({ mode: 'onBlur' });

  const onSubmit: SubmitHandler<UpsertSpot> = (data) => {
    addSpot(data);
    router.push('/spots');
  };

  return (
    <>
      <h1 className={clsx(title(), 'mb-6')}>Add Spots</h1>
      <div className="columns-2 flex-grow gap-x-8">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            className="max-w-3xl mb-4"
            label="Name"
            isRequired
            {...register('name', { required: true })}
            isInvalid={errors.name?.type === 'required'}
            errorMessage={
              errors.name?.type === 'required' && 'Name is required'
            }
          />

          <Input
            className="max-w-3xl mb-4"
            label="Address"
            isRequired
            {...register('address', { required: true })}
            isInvalid={errors.name?.type === 'required'}
            errorMessage={
              errors.name?.type === 'required' && 'Address is required'
            }
          />

          <Textarea
            className="max-w-3xl mb-4"
            label="Description"
            placeholder="Enter your description"
            isRequired
            {...register('description', { required: true })}
            isInvalid={errors.description?.type === 'required'}
            errorMessage={
              errors.description?.type === 'required' &&
              'Description is required'
            }
          />

          <Controller
            name="bustLevel"
            control={control}
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
            isDisabled={isSubmitting || !isValid}
          >
            Add Spot
          </Button>
        </form>

        <Map />
      </div>
    </>
  );
}
