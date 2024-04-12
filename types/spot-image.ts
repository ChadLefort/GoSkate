import type { getSpotImagesById } from '@/actions/spot-images-actions';
import type { ThenArg } from '@/utils/type-helpers';

export type SpotImage = ThenArg<ReturnType<typeof getSpotImagesById>>[number];

export type AddSpotImage = Omit<SpotImage, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
