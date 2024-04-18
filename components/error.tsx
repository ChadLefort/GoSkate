import clsx from 'clsx';
import { IconExclamationCircle } from '@tabler/icons-react';

import { subtitle, title } from '@/components/primitives';

type ErrorProps = {
  message?: string;
  error?: string;
};

export default function Error({ message, error }: ErrorProps) {
  return (
    <div className="flex flex-grow flex-col items-center justify-center">
      <IconExclamationCircle size={60} className="text-red-500" />
      <h2 className={title()}>{message ?? 'Something went wrong!'}</h2>
      {error && <h3 className={clsx(subtitle(), 'text-center')}>{error} </h3>}
    </div>
  );
}
