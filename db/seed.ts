import { faker } from '@faker-js/faker';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import 'dotenv/config';
import type { UpsertSpot } from '@/actions/spot-actions';

import { spot } from './schema';

const queryClient = postgres(process.env.POSTGRES_CONNECTION_STRING || '');

const db: PostgresJsDatabase = drizzle(queryClient, {
  logger: true,
});

const generateSpotRows = (count: number): (UpsertSpot & { slug: string })[] => {
  const rows: (UpsertSpot & { slug: string })[] = [];

  for (let i = 0; i < count; i++) {
    const [lat, lng] = faker.location.nearbyGPSCoordinate({
      origin: [39.8283, -98.5795],
      radius: 700,
    });
    const name = faker.location.city();

    rows.push({
      name,
      slug: name.toLowerCase().replace(/\s/g, '-'),
      description: faker.lorem.paragraph(),
      address: faker.location.streetAddress(),
      addressLine2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
      bustLevel: faker.number.int({ min: 0, max: 10 }),
      location: { lat, lng },
      userId: `user_${faker.string.alphanumeric({ length: 27 })}`,
    });
  }

  return rows;
};

async function seed() {
  console.log('Seeding...');
  console.time('DB has been seeded!');

  // database teardown
  await db.delete(spot);

  // database setup
  const newSpotRows = generateSpotRows(50);
  await db.insert(spot).values(newSpotRows).returning();
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Seeding done!');
    process.exit(0);
  });
