import type { Stripe } from 'stripe';

import { stripe } from '@/lib/stripe';
import { title } from '@/components/primitives';

export default async function ResultPage({ searchParams }: { searchParams: { session_id: string } }) {
  if (!searchParams.session_id) throw new Error('Please provide a valid session_id (`cs_test_...`)');

  const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(searchParams.session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent;

  return (
    <div className="flex flex-grow flex-col items-center justify-center">
      {paymentIntent.status === 'succeeded' ? (
        <h2 className={title()}>Thank you for your donation!</h2>
      ) : (
        <>
          <h2 className={title()}>Donation failed</h2>
          <p>Status: {paymentIntent.status}</p>
        </>
      )}
    </div>
  );
}
