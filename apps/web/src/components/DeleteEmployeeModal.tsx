import { Dialog, Flex, Portal, Text, Button } from '@chakra-ui/react';
import { EmployeeBaseEntity } from '@web/client/types.gen';
import { CloseIcon } from '@web/static/icons';

// TODO docs
export const DeleteEmployeeModal = ({
  isOpen,
  onClose,
  employee,
}: {
  isOpen: boolean;
  onClose: () => void;
  employee?: EmployeeBaseEntity;
}) => {
  if (!employee) {
    return null;
  }

  const handleDeleteEmployee = async () => {
    //TODO
  };

  //   TODO wip
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={onClose}
      closeOnInteractOutside={true}
    >
      <Portal>
        <Dialog.Backdrop bg="rgba(0, 0, 0, 0.5)" />
        <Dialog.Positioner alignItems="center" justifyContent={'center'}>
          <Dialog.Content
            padding={'24px 32px'}
            gap="24px"
            backgroundColor="#F8F9FA"
            flexDir={'column'}
            width="559px"
            borderRadius="12px"
            boxShadow="0px 2px 16px 0px rgba(0, 0, 0, 0.15)"
          >
            <Dialog.Header>
              <Flex
                width="100%"
                flexDirection="row"
                justifyContent={'center'}
                alignItems={'center'}
                position="relative"
              >
                <Dialog.Title
                  fontFamily={'Hanken Grotesk'}
                  fontSize="19px"
                  fontWeight="bold"
                  lineHeight="26px"
                  textAlign="center"
                >
                  Delete User?
                </Dialog.Title>
                <CloseIcon
                  onClick={onClose}
                  cursor="pointer"
                  style={{
                    width: '19px',
                    height: '19px',
                    position: 'absolute',
                    right: 0,
                  }}
                />
              </Flex>
            </Dialog.Header>
            <Dialog.Body>
              <Flex flexDirection="column" alignItems="center" gap="24px">
                <Text
                  color="#222324"
                  fontSize="16px"
                  fontWeight="400"
                  textAlign="center"
                >
                  Are you sure you want to remove{' '}
                  <Text as="span" fontWeight="bold">
                    {employee.firstName} {employee.lastName}
                  </Text>{' '}
                  from the employee directory?
                </Text>
                <Flex gap={4} justify="center" width="100%">
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    onClick={onClose}
                    width="120px"
                    borderColor="blue.500"
                    color="blue.500"
                    _hover={{ bg: 'blue.50' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    bg="red.500"
                    color="white"
                    _hover={{ bg: 'red.600' }}
                    onClick={handleDeleteEmployee}
                    width="120px"
                  >
                    Remove
                  </Button>
                </Flex>
              </Flex>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
