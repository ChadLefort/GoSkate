import type { getSpotBySlug, getSpotLabels, getSpots } from '@/actions/spot-actions';
import type { ThenArg } from '@/utils/type-helpers';

export type Spot = ThenArg<ReturnType<typeof getSpots>>[number];

export type SpotWithImages = NonNullable<ThenArg<ReturnType<typeof getSpotBySlug>>>;

export type SpotLabel = ThenArg<ReturnType<typeof getSpotLabels>>[number];

export type AddSpot = Omit<Spot, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'spotsToLabels'> & {
  labels: string | string[];
};

export type AddSpotLabel = Omit<SpotLabel, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
