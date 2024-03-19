import NextLink from 'next/link';
import { Image } from '@nextui-org/image';
import { Button } from '@nextui-org/button';

import { title } from '@/components/primitives';

export default function Home() {
  const images = [
    { src: '/hollywood-high.jpg', title: 'Highwood High 16' },
    { src: '/el-toro.jpg', title: 'El Toro 20' },
  ];

  const image = images[Math.floor(Math.random() * images.length)];

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-12">
      <div className="inline-block max-w-3xl text-center justify-center">
        <div className="mb-8">
          <Image isBlurred src={image.src} alt={image.title} />
        </div>
        <h1 className={title()}>
          Skate the world with <span className="text-primary">GoSkate</span>
        </h1>
      </div>

      <div className="flex gap-3">
        <NextLink href="/spots">
          <Button size="lg" variant="shadow">
            Check Out Spots
          </Button>
        </NextLink>
      </div>
    </section>
  );
}
