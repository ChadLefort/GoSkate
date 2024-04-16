'use client';

import { Button } from '@nextui-org/button';

import { title } from '@/components/primitives';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const handleReset = () => reset();

  return (
    <div className="flex flex-grow flex-col items-center justify-center">
      <h2 className={title()}>Something went wrong!</h2>
      <Button className="mt-8" size="lg" onClick={handleReset}>
        Try again
      </Button>
    </div>
  );
}
