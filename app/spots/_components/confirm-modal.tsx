'use client';

import { Button } from '@nextui-org/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/modal';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import type { ServerActionResponse } from '@/types/server-action';
import type { Spot } from '@/types/spot';

type Props = {
  spot: Spot;
  handleDelete: () => Promise<ServerActionResponse<Spot> | object | undefined>;
};

export default function ConfirmModal({ spot, handleDelete }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  return (
    <>
      <Button onPress={onOpen} color="danger">
        Delete
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Spot: {spot.name}</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this spot?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onClick={async () => {
                    const result = (await handleDelete()) as ServerActionResponse<Spot> | undefined;

                    if (!result?.success) {
                      toast.error(result?.message);
                    }

                    if (result?.success) {
                      toast.success(`${spot.name} has been successfully deleted`);
                      router.push('/spots');
                    }
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
