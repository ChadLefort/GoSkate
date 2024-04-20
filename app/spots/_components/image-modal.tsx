import React from 'react';
import { Modal, ModalBody, ModalContent, useDisclosure } from '@nextui-org/modal';
import { Image } from '@nextui-org/image';
import NextImage from 'next/image';

import type { SpotImage } from '@/types/spot';

type ImageModalProps = {
  children: ({ onOpen }: { onOpen: () => void }) => React.ReactNode;
  image: SpotImage;
};

export default function ImageModal({ children, image }: ImageModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {children({ onOpen })}
      <Modal className="px-3 py-6" isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
        <ModalContent>
          <ModalBody>
            <Image as={NextImage} src={image.url} className="size-full" width="1000" height="1000" alt={image.spotId} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
