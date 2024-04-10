'use server';

import { desc, eq } from 'drizzle-orm';

import db from '@/db/drizzle';
import { users } from '@/db/schema';
import type { ThenArg } from '@/utils/type-helpers';

export type User = ThenArg<ReturnType<typeof getUsers>>[number];
export type AddEditUser = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export const getUsers = async () => {
  const data = await db.select().from(users).orderBy(desc(users.createdAt));
  return data;
};

export const getUserById = async (id: string) => {
  const data = db.query.users.findFirst({
    where: (user, { eq }) => eq(user.userId, id),
  });

  return data;
};

export const addUser = async (data: AddEditUser) => {
  await db.insert(users).values(data);
};

export const editUser = async (
  id: string,
  { data, premium }: Partial<AddEditUser>
) => {
  const updateQuery = db.update(users);
  const updatedAt = new Date();

  if (data) {
    await updateQuery.set({ data, updatedAt }).where(eq(users.userId, id));
  }

  if (premium !== undefined) {
    await updateQuery.set({ premium, updatedAt }).where(eq(users.userId, id));
  }
};
