'use server';

import { auth } from '@clerk/nextjs/server';

export const checkLoggedIn = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error('You must be logged in');
  }

  return { userId };
};

export const checkAdmin = async () => {
  const { has } = auth();
  const isAdmin = has({ role: 'org:admin' });

  return isAdmin;
};
