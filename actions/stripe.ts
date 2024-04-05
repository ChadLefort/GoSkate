'use server';

import type { Stripe } from 'stripe';
import { headers } from 'next/headers';
import { currentUser } from '@clerk/nextjs/server';

import { CURRENCY } from '@/config';
import { stripe } from '@/lib/stripe';
import { formatAmountForStripe } from '@/utils/stripe-helpers';

export const createCheckoutSession = async (
  data: FormData
): Promise<{ client_secret: string | null; url: string | null }> => {
  const origin: string = headers().get('origin') as string;
  const user = await currentUser();

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: 'payment',
      submit_type: 'donate',
      customer_email: user?.emailAddresses[0].emailAddress,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: 'Custom amount donation',
            },
            unit_amount: formatAmountForStripe(
              Number(data.get('customDonation') as string),
              CURRENCY
            ),
          },
        },
      ],
      success_url: `${origin}/donate/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate`,
      ui_mode: 'hosted',
      payment_method_configuration: process.env.STRIPE_PAYMENT_METHOD_CONFIG_ID,
      payment_intent_data: {
        metadata: {
          userId: user?.id ?? null,
        },
      },
    });

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
};
