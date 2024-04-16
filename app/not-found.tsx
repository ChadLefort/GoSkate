import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';

import { title } from '@/components/primitives';

export default function NotFound() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center">
      <h2 className={title()}>Not found</h2>
      <Link href="/">
        <Button className="mt-8" size="lg">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
