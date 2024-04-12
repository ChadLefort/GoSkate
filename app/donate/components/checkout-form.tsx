'use client';

import React, { useState } from 'react';
import { Slider } from '@nextui-org/slider';
import { Button } from '@nextui-org/button';
import { IconCash } from '@tabler/icons-react';

import { formatAmountForDisplay } from '@/utils/stripe-helpers';
import * as config from '@/config';
import { createCheckoutSession } from '@/actions/stripe-actions';

export default function CheckoutForm() {
  const [loading] = useState<boolean>(false);
  const [input, setInput] = useState<{ customDonation: number }>({
    customDonation: config.DEFAULT_AMOUNT,
  });

  const handleInputChange = (value: number | number[]): void => setInput({ customDonation: value as number });

  const formAction = async (data: FormData): Promise<void> => {
    const { url } = await createCheckoutSession(data);

    window.location.assign(url as string);
  };

  return (
    <form action={formAction}>
      <Slider
        size="md"
        step={config.AMOUNT_STEP}
        color="foreground"
        name="customDonation"
        showSteps={true}
        maxValue={config.MAX_AMOUNT}
        minValue={config.MIN_AMOUNT}
        value={input.customDonation}
        aria-label="Donation amount"
        onChange={handleInputChange}
      />

      <div className="flex justify-center">
        <Button
          size="lg"
          type="submit"
          className="mt-6"
          isLoading={loading}
          isDisabled={loading}
          startContent={<IconCash size={20} />}
        >
          Donate {formatAmountForDisplay(input.customDonation, config.CURRENCY)}
        </Button>
      </div>
    </form>
  );
}
