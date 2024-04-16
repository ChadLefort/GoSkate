import * as React from 'react';
import { IconMapPin } from '@tabler/icons-react/';

type PinProps = {
  size?: number;
};

function Pin({ size = 20 }: PinProps) {
  return <IconMapPin size={size} />;
}

export default React.memo(Pin);
