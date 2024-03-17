'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { Input, Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';

import { addSpot } from '@/actions/spot-actions';
import { title } from '@/components/primitives';

export default function AddSpotPage() {
  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const router = useRouter();

  const handleNameInput = (e: ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
  };

  const handleDescriptionInput = (e: ChangeEvent<HTMLInputElement>) => {
    setDescriptionInput(e.target.value);
  };

  const handleSumbit = () => {
    addSpot({ name: nameInput, description: descriptionInput });
    router.push('/spots');
  };

  return (
    <>
      <h1 className={clsx(title(), 'mb-6')}>Add Spots</h1>
      <Input
        type="name"
        label="Name"
        value={nameInput}
        onChange={handleNameInput}
      />
      <Textarea
        label="Description"
        placeholder="Enter your description"
        value={descriptionInput}
        onChange={handleDescriptionInput}
      />

      <Button
        size="lg"
        variant="shadow"
        className="max-w-none xl:max-w-xs"
        onClick={handleSumbit}
      >
        Add Spot
      </Button>
    </>
  );
}
