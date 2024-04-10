import { Spinner } from '@nextui-org/spinner';

export default function Loading() {
  return (
    <div className="flex flex-col flex-grow justify-center items-center">
      <Spinner size="lg" label="Loading..." />
    </div>
  );
}
