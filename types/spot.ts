import type { getSpotBySlug, getSpotLabels, getSpots } from '@/actions/spot-actions';
import type { ThenArg } from '@/utils/type-helpers';

export type Spot = ThenArg<ReturnType<typeof getSpots>>['data'][number];

export type SpotWithImages = NonNullable<ThenArg<ReturnType<typeof getSpotBySlug>>['data']>;

export type SpotImage = SpotWithImages['images'][number];

export type SpotLabel = ThenArg<ReturnType<typeof getSpotLabels>>['data'][number];

export type AddSpot = Omit<Spot, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'spotsToLabels'> & {
  labels: string | string[];
};

export type AddSpotLabel = Omit<SpotLabel, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
