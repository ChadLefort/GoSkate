import { auth } from '@clerk/nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { z } from 'zod';

import { addSpotImages } from '@/actions/spot-images.actions';

const uploadThing = createUploadthing();

export const ourFileRouter = {
  spotImages: uploadThing({ image: { maxFileSize: '4MB', maxFileCount: 4 } })
    .input(z.object({ spotId: z.string() }))
    .middleware(async ({ input: { spotId } }) => {
      const { userId } = auth();

      if (!userId) {
        throw new UploadThingError('Unauthorized');
      }

      return { userId, spotId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('User ID:', metadata.userId);
      console.log('Spot ID:', metadata.spotId);
      console.log('File URL:', file.url);

      await addSpotImages({
        spotId: metadata.spotId,
        userId: metadata.userId,
        url: file.url,
      });

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
