'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Input, Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { SubmitHandler, useForm } from 'react-hook-form';

import { addSpot } from '@/actions/spot-actions';
import { title } from '@/components/primitives';

type Inputs = {
  name: string;
  description: string;
};

export default function AddSpotPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<Inputs>({ mode: 'onBlur' });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    addSpot(data);
    router.push('/spots');
  };

  return (
    <>
      <h1 className={clsx(title(), 'mb-6')}>Add Spots</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          className="mb-4"
          type="name"
          label="Name"
          isRequired
          {...register('name', { required: true })}
          isInvalid={errors.name?.type === 'required'}
          errorMessage={errors.name?.type === 'required' && 'Name is required'}
        />
        <Textarea
          className="mb-4"
          label="Description"
          placeholder="Enter your description"
          isRequired
          {...register('description', { required: true })}
          isInvalid={errors.description?.type === 'required'}
          errorMessage={
            errors.description?.type === 'required' && 'Description is required'
          }
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
    </>
  );
}
