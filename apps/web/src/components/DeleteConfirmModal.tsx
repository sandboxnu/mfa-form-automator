import {
  Button,
  Dialog,
  DialogPositioner,
  Flex,
  Portal,
  Text,
} from '@chakra-ui/react';

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  deleteObjectName,
  deleteObjectType,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleteObjectName: string;
  deleteObjectType: string;
  isLoading: boolean;
}) => {
  return (
    <Dialog.Root
      open={isOpen}
      placement={'center'}
      size="sm"
      onInteractOutside={onClose}
    >
      <Portal>
        <Dialog.Backdrop bg="rgba(0, 0, 0, 0.5)" />
        <DialogPositioner>
          <Dialog.Content alignItems="center" justifyContent={'center'}>
            <Flex
              zIndex="1000"
              padding="24px 32px"
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems="center"
              gap="24px"
              background="#FFF"
              borderRadius={'5px'}
            >
              <Flex fontSize="19px" fontWeight="700">
                Delete {deleteObjectType}?
              </Flex>
              <Text textAlign={'center'}>
                Are you sure you want to remove{' '}
                <em>
                  <strong>{deleteObjectName} </strong>
                </em>
                from the directory permanently?
              </Text>
              <Flex
                justifyContent={'center'}
                alignItems={'center'}
                gap="40px"
                height="29px"
              >
                <Button
                  padding="4px 10px"
                  background="transparent"
                  _hover={{
                    bgColor: 'transparent',
                  }}
                  border="1px solid var(--Blue, #1367EA)"
                  borderRadius="5px"
                  color="#1367EA"
                  width="100px"
                  height="29px"
                  fontWeight={'normal'}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  padding="4px 10px"
                  background={' var(--MFA-Red, #ED2324)'}
                  borderRadius="5px"
                  _hover={{
                    bgColor: ' var(--MFA-Red, #ED2324)',
                  }}
                  color="white"
                  width="100px"
                  height="29px"
                  onClick={onConfirm}
                  loading={isLoading}
                >
                  Remove
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </DialogPositioner>
      </Portal>
    </Dialog.Root>
  );
};
