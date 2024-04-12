import { Spinner } from '@nextui-org/spinner';

export default function Loading() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center">
      <Spinner size="lg" label="Loading..." />
    </div>
  );
}
