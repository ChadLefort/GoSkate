import { Webhook } from 'svix';
import { headers } from 'next/headers';
import type { WebhookEvent } from '@clerk/nextjs/server';

import { addUser, editUser, getUserById } from '@/actions/user-actions';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return Response.json({ message: 'No svix headers' }, { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: WebhookEvent;

  // Verify the payload with the headers
  try {
    event = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('❌ Error verifying webhook:', err);

    return Response.json({ message: 'Error occurred' }, { status: 400 });
  }

  // Get the ID and type
  const { id } = event.data;
  const eventType = event.type;

  console.log(
    `✅ Success: Webhook with and ID of ${id} and type of ${eventType}`
  );

  if (eventType.includes('user')) {
    const userId = payload.data.id;
    const data = payload.data;

    if (eventType === 'user.created' || eventType === 'user.updated') {
      if (await getUserById(userId)) {
        await editUser(userId, data);
      } else {
        await addUser({ userId, data, premium: false });
      }
    }
  }

  return Response.json({ message: 'Clerk webhook received' }, { status: 200 });
}
