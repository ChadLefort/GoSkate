'use server';

import { revalidatePath } from 'next/cache';
import { and, asc, count, desc, eq, ilike, inArray, isNull, or, sql } from 'drizzle-orm';
import type { SortDirection } from '@react-types/shared';
import type { PostgresError } from 'postgres';

import db from '@/db/drizzle';
import { spots, spotsToLabels } from '@/db/schema';
import type { Point } from '@/types/point';
import { checkAdmin, checkLoggedIn } from '@/utils/auth';
import type { AddSpot } from '@/types/spot';

export type SpotTableColumns = 'name' | 'address' | 'city' | 'state' | 'zip' | 'bust_level' | 'created_at';

export type SpotsParams = {
  direction?: SortDirection;
  column?: SpotTableColumns;
  filters?: string[];
  limit?: number;
  offset?: number;
};

const getSpotLabelIds = (filters: string[]) => {
  return db.select({ id: spotsToLabels.spotId }).from(spotsToLabels).where(inArray(spotsToLabels.labelId, filters));
};

const searchFilter = (searchTerm: string) => {
  return or(
    ilike(spots.name, `%${searchTerm}%`),
    ilike(spots.address, `%${searchTerm}%`),
    ilike(spots.city, `%${searchTerm}%`),
    ilike(spots.state, `%${searchTerm}%`)
  );
};

export const getSpots = async (spotParams?: SpotsParams) => {
  try {
    const sortColumn = sql.identifier(spotParams?.column ?? 'created_at');
    const orderBy = spotParams?.direction === 'descending' ? desc(sortColumn) : asc(sortColumn);
    const limit = spotParams?.limit ?? 20;
    const offset = spotParams?.offset ?? 0;
    const data = await db.query.spots.findMany({
      orderBy,
      limit,
      offset,
      with: {
        spotsToLabels: {
          columns: {
            labelId: false,
            spotId: false,
          },
          with: {
            label: true,
          },
        },
      },
      where: (spot, { isNull, and, inArray }) =>
        and(
          isNull(spot.deletedAt),
          spotParams?.filters?.length ? inArray(spot.id, getSpotLabelIds(spotParams.filters)) : undefined
        ),
    });

    return {
      success: true,
      status: 200,
      data,
    };
  } catch (e) {
    const error = e as PostgresError;

    return {
      success: false,
      status: 500,
      data: [],
      message: 'An error occurred while fetching spots.',
      error: error.message,
    };
  }
};

export const getSpotLabels = async () => {
  try {
    const data = await db.query.spotLabels.findMany({ orderBy: (spotLabel, { asc }) => asc(spotLabel.name) });

    return {
      success: true,
      status: 200,
      data,
    };
  } catch (e) {
    const error = e as PostgresError;

    return {
      success: false,
      status: 500,
      data: [],
      message: 'An error occurred while fetching labels.',
      error: error.message,
    };
  }
};

export const getSpotsTotal = async (searchTerm?: string, spotParams?: SpotsParams) => {
  try {
    const query = db
      .select({ count: count() })
      .from(spots)
      .where(
        and(
          isNull(spots.deletedAt),
          spotParams?.filters?.length ? inArray(spots.id, getSpotLabelIds(spotParams.filters)) : undefined
        )
      );

    if (searchTerm) {
      const [total] = await query.$dynamic().where(searchFilter(searchTerm));
      return {
        success: true,
        status: 200,
        data: total.count,
      };
    } else {
      const [total] = await query;
      return {
        success: true,
        status: 200,
        data: total.count,
      };
    }
  } catch (e) {
    const error = e as PostgresError;

    return {
      success: false,
      status: 500,
      data: 0,
      message: 'An error occurred while fetching spot totals.',
      error: error.message,
    };
  }
};

export const getSpotBySlug = async (slug: string) => {
  try {
    const data = await db.query.spots.findFirst({
      with: {
        spotsToLabels: {
          columns: {
            labelId: false,
            spotId: false,
          },
          with: {
            label: true,
          },
        },
        images: true,
      },
      where: (spot, { eq, and, isNull }) => and(eq(spot.slug, slug), isNull(spot.deletedAt)),
    });

    return {
      success: true,
      status: 200,
      data,
    };
  } catch (e) {
    const error = e as PostgresError;

    return {
      success: false,
      status: 500,
      data: null,
      message: 'An error occurred while fetching spot.',
      error: error.message,
    };
  }
};

export const searchSpots = async (searchTerm?: string, spotParams?: SpotsParams) => {
  try {
    if (!searchTerm) {
      return await getSpots(spotParams);
    }

    const sortColumn = sql.identifier(spotParams?.column ?? 'created_at');
    const orderBy = spotParams?.direction === 'descending' ? desc(sortColumn) : asc(sortColumn);
    const limit = spotParams?.limit ?? 20;
    const offset = spotParams?.offset ?? 0;
    const data = await db.query.spots.findMany({
      orderBy,
      limit,
      offset,
      with: {
        spotsToLabels: {
          columns: {
            labelId: false,
            spotId: false,
          },
          with: {
            label: true,
          },
        },
      },
      where: (spot, { isNull, and, inArray }) =>
        and(
          searchFilter(searchTerm),
          isNull(spot.deletedAt),
          spotParams?.filters?.length ? inArray(spot.id, getSpotLabelIds(spotParams.filters)) : undefined
        ),
    });

    return {
      success: true,
      status: 200,
      data,
    };
  } catch (e) {
    const error = e as PostgresError;

    return {
      success: false,
      status: 500,
      data: [],
      message: error.message,
    };
  }
};

export const getNearbySpots = async ({ lng, lat }: Point, id: string) => {
  try {
    const radius = 1609.344 * 250;
    const data = await db.query.spots.findMany({
      with: {
        spotsToLabels: {
          columns: {
            labelId: false,
            spotId: false,
          },
          with: {
            label: true,
          },
        },
        images: true,
      },
      where: (spot, { eq, and, not, isNull }) =>
        and(
          not(eq(spot.id, id)),
          sql`ST_DWithin(${spot.location}, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326), ${radius})`,
          isNull(spot.deletedAt)
        ),
      limit: 6,
      orderBy: desc(spots.createdAt),
    });

    return {
      success: true,
      status: 200,
      data,
    };
  } catch (e) {
    const error = e as PostgresError;

    return {
      success: false,
      status: 500,
      data: [],
      message: 'An error occurred while fetching nearby spots.',
      error: error.message,
    };
  }
};

export const addSpot = async (data: AddSpot & { labels: string[] }) => {
  try {
    const { userId } = await checkLoggedIn();
    const slug = data.name.toLowerCase().replace(/\s/g, '-');
    const existingSpot = await db.query.spots.findFirst({
      where: (spot, { eq, and, isNull }) => and(eq(spot.slug, slug), isNull(spot.deletedAt)),
    });

    if (!existingSpot) {
      const [newSpot] = await db
        .insert(spots)
        .values({
          ...data,
          slug,
          userId,
        })
        .returning();

      for (const id of data.labels) {
        await db.insert(spotsToLabels).values({
          spotId: newSpot.id,
          labelId: id,
        });
      }

      return {
        success: true,
        status: 200,
        data: newSpot,
      };
    }

    return {
      success: false,
      status: 400,
      data: null,
      message: 'Spot already exists.',
    };
  } catch (e) {
    const error = e as PostgresError;

    return {
      success: false,
      status: 500,
      data: null,
      message: 'An error occurred while adding spot.',
      error: error.message,
    };
  }
};

export const deleteSpot = async (id: string) => {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      throw new Error('You must be an admin to perform this action');
    }

    const [data] = await db
      .update(spots)
      .set({ deletedAt: sql`now()` })
      .where(eq(spots.id, id))
      .returning();

    revalidatePath('/spots');

    return {
      success: true,
      status: 200,
      data,
    };
  } catch (e) {
    const error = e as PostgresError;

    return {
      success: false,
      status: 500,
      data: null,
      message: 'An error occurred while deleting spot.',
      error: error.message,
    };
  }
};
