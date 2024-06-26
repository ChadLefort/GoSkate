import NextLink from 'next/link';
import { Image } from '@nextui-org/image';
import NextImage from 'next/image';
import { Button } from '@nextui-org/button';

import { title } from '@/components/primitives';

export default function Home() {
  const images = [
    { src: '/hollywood-high.webp', title: 'Highwood High 16' },
    { src: '/el-toro.webp', title: 'El Toro 20' },
  ];

  const image = images[Math.floor(Math.random() * images.length)];

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-12">
      <div className="inline-block max-w-3xl justify-center text-center">
        <div className="mb-8">
          <Image
            as={NextImage}
            width={800}
            height={800}
            isBlurred
            src={image.src}
            alt={image.title}
            className="object-contain"
          />
        </div>
        <h1 className={title()}>
          Skate the world with <span className="text-primary">GoSkate</span>
        </h1>
      </div>

      <div className="flex gap-3">
        <NextLink href="/spots">
          <Button size="lg">Check Out Spots</Button>
        </NextLink>
      </div>
    </section>
  );
}
