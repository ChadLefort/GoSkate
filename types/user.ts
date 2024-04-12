import type { getUsers } from '@/actions/user-actions';
import type { ThenArg } from '@/utils/type-helpers';

export type User = ThenArg<ReturnType<typeof getUsers>>[number];

export type AddEditUser = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
