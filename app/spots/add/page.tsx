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
    formState: { defaultValues, errors, isSubmitting, isValid },
  } = useForm<Inputs>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      address: '',
      description: '',
      bustLevel: 0,
    },
  });

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
            defaultValue={defaultValues?.name}
            isInvalid={errors.name?.type === 'required'}
            errorMessage={
              errors.name?.type === 'required' && 'Name is required'
            }
            {...register('name', { required: true })}
          />

          <Input
            className="max-w-3xl mb-4"
            label="Address"
            isRequired
            defaultValue={defaultValues?.address}
            isInvalid={errors.address?.type === 'required'}
            errorMessage={
              errors.address?.type === 'required' && 'Address is required'
            }
            {...register('address', { required: true })}
          />

          <Textarea
            className="max-w-3xl mb-4"
            label="Description"
            placeholder="Enter your description"
            isRequired
            defaultValue={defaultValues?.description}
            isInvalid={errors.description?.type === 'required'}
            errorMessage={
              errors.description?.type === 'required' &&
              'Description is required'
            }
            {...register('description', { required: true })}
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
