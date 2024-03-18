import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_CONNECTION_STRING!,
  },
  tablesFilter: '!@(spatial_ref_sys|geometry_columns|geography_columns)',
} satisfies Config;
