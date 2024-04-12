import clsx from 'clsx';

import { title } from '@/components/primitives';

export default function AboutPage() {
  return (
    <>
      <h1 className={clsx(title(), 'mb-3')}>About</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
        consectetur purus et tellus euismod, imperdiet condimentum ante mattis.
        Nunc fringilla purus at mi elementum varius. Suspendisse potenti. Ut a
        vulputate felis, eu commodo neque. Pellentesque eleifend nunc sit amet
        dui elementum blandit. Suspendisse potenti. Pellentesque et libero
        scelerisque dui sodales dignissim vel vitae sem. Praesent erat turpis,
        dapibus eu leo ut, porttitor aliquam felis.
      </p>
      <p>
        Morbi quis felis porta, venenatis ligula eu, imperdiet nisl. Integer
        ullamcorper sagittis orci, a mollis purus rhoncus ac. Pellentesque
        elementum ex sit amet mattis condimentum. In ac odio non nulla fringilla
        ultricies ac eu tortor. Suspendisse vel vulputate nulla, ac porta lacus.
        Duis eu odio tortor. Donec at sagittis justo. Ut a ipsum pulvinar dolor
        interdum condimentum quis ac turpis. Maecenas pretium dolor neque, non
        lobortis felis sagittis eu. Phasellus scelerisque ante id purus euismod,
        nec feugiat ipsum lobortis. Pellentesque varius lacus id leo dignissim,
        a tristique velit luctus. Integer gravida scelerisque est, id maximus
        libero eleifend nec. Nunc sed scelerisque orci.
      </p>
      <p>
        Suspendisse posuere felis ut sagittis dapibus. Donec blandit et enim
        vitae ullamcorper. Nunc cursus mattis tellus, vel scelerisque mauris.
        Sed at faucibus orci, ac efficitur magna. Etiam sed nisl aliquet,
        venenatis dolor eget, tempus metus. Aenean semper eros orci, eu viverra
        ligula facilisis in. Donec a dolor nunc. Nam fringilla, turpis in
        hendrerit tempor, sem augue efficitur mi, pretium vestibulum ipsum ex ac
        nibh. Donec vel placerat justo, ut fringilla neque. Interdum et
        malesuada fames ac ante ipsum primis in faucibus. Etiam dictum metus
        nulla, eget ultricies quam hendrerit non. Nunc aliquam maximus
        sollicitudin. Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas.
      </p>
    </>
  );
}
