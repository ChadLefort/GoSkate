import { Card, CardBody } from '@nextui-org/card';
import clsx from 'clsx';
import { IconMedal } from '@tabler/icons-react';

import { title } from '@/components/primitives';

import CheckoutForm from './components/checkout-form';

export default function DonatePage() {
  return (
    <>
      <h1 className={clsx(title(), 'mb-3')}>Donate</h1>

      <div className="flex justify-center">
        <Card className="w-full p-3 xl:w-1/2">
          <CardBody>
            <h4 className={clsx(title({ size: 'sm' }), 'mb-6')}>Skaters Supporting Skaters</h4>
            <p className="mb-3">
              Your donation helps us to continue providing resources and support to the skateboarding community. Thank
              you for your generosity and any amount you can give.
            </p>

            <p className="mb-3 flex">
              For your donation, you will receive a special badge by your name. <IconMedal />
            </p>
            <CheckoutForm />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
