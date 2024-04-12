import { faker } from '@faker-js/faker';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import 'dotenv/config';
import type { AddSpot, AddSpotLabel } from '@/actions/spot-actions';

import { spotLabels, spots, spotsToLabels } from './schema';

const queryClient = postgres(process.env.POSTGRES_CONNECTION_STRING || '');

const db: PostgresJsDatabase = drizzle(queryClient, {
  logger: true,
});

const generateSpotRows = (count: number): (AddSpot & { slug: string })[] => {
  const rows: (AddSpot & { slug: string })[] = [];

  for (let i = 0; i < count; i++) {
    const [lat, lng] = faker.location.nearbyGPSCoordinate({
      origin: [39.8283, -98.5795],
      radius: 700,
    });
    const name = faker.location.city();

    rows.push({
      name,
      slug: name.toLowerCase().replace(/\s/g, '-'),
      description: faker.lorem.paragraphs(5),
      address: faker.location.streetAddress(),
      addressLine2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
      bustLevel: faker.number.int({ min: 0, max: 10 }),
      location: { lat, lng },
      userId: `user_${faker.string.alphanumeric({ length: 27 })}`,
      labels: [],
    });
  }

  return rows;
};

const generateSpotCategories = (): AddSpotLabel[] => {
  const categories: AddSpotLabel[] = [
    { name: 'Skatepark', description: 'A skatepark', type: 'primary' },
    { name: 'DIY', description: 'A DIY spot', type: 'primary' },

    { name: 'Stairs', description: 'A set of stairs', type: 'secondary' },
    { name: 'Ledge', description: 'A ledge', type: 'secondary' },
    { name: 'Rail', description: 'A rail', type: 'secondary' },
    { name: 'Handrail', description: 'A handrail', type: 'secondary' },
    { name: 'Hubba', description: 'A hubba', type: 'secondary' },
    { name: 'Manual Pad', description: 'A manual pad', type: 'secondary' },
    { name: 'Gap', description: 'A gap', type: 'secondary' },

    { name: 'Bank', description: 'A bank', type: 'success' },
    { name: 'Pyramid', description: 'A pyramid', type: 'success' },
    { name: 'Hip', description: 'A hip', type: 'success' },

    { name: 'Quarter Pipe', description: 'A quarter pipe', type: 'warning' },
    { name: 'Half Pipe', description: 'A half pipe', type: 'warning' },
    { name: 'Vert Ramp', description: 'A vert ramp', type: 'warning' },
    { name: 'Mini Ramp', description: 'A mini ramp', type: 'warning' },
    { name: 'Bowl', description: 'A bowl', type: 'warning' },
    { name: 'Pool', description: 'A pool', type: 'warning' },

    { name: 'Flatground', description: 'Flatground', type: 'danger' },
    { name: 'Curb', description: 'A curb', type: 'danger' },
  ];

  return categories;
};

async function seed() {
  console.log('Seeding...');
  console.time('DB has been seeded!');

  // database teardown
  await db.delete(spotsToLabels);
  await db.delete(spots);
  await db.delete(spotLabels);

  // database setup
  const newSpotCategories = generateSpotCategories();
  const categories = await db.insert(spotLabels).values(newSpotCategories).returning();

  const newSpotRows = generateSpotRows(50);
  const spotRows = await db.insert(spots).values(newSpotRows).returning();

  for (const spot of spotRows) {
    await db.insert(spotsToLabels).values({
      spotId: spot.id,
      labelId: faker.helpers.arrayElement(categories).id,
    });
  }
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
