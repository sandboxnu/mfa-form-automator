import {
  Button,
  Dialog,
  Flex,
  Portal,
  Text,
  Input,
  VStack,
} from '@chakra-ui/react';
import { CloseIcon, PlusIcon } from '@web/static/icons';
import { positionsControllerFindAllOptions } from '@web/client/@tanstack/react-query.gen';
import { useQuery } from '@tanstack/react-query';
import { RightSearchIcon } from '@web/static/icons';
import { InputGroup } from '../ui/input-group';
import { ModifyPositionCard } from './ModifyPositionCard';

export const EditPositionsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { data: positions } = useQuery(positionsControllerFindAllOptions());

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
            height="auto"
            maxHeight="75vh"
            borderRadius="12px"
            boxShadow="0px 2px 16px 0px rgba(0, 0, 0, 0.15)"
            overflow="hidden"
          >
            <Dialog.Header>
              <Flex
                width="100%"
                flexDirection="row"
                justifyContent={'space-between'}
                alignItems={'center'}
              >
                <Dialog.Title
                  fontFamily={'Hanken Grotesk'}
                  fontSize="30px"
                  fontWeight="700"
                  lineHeight="36px"
                >
                  Manage positions
                </Dialog.Title>
                <CloseIcon
                  onClick={onClose}
                  cursor="pointer"
                  style={{
                    width: '19px',
                    height: '19px',
                  }}
                />
              </Flex>
            </Dialog.Header>
            <Dialog.Body>
              <Flex height="38px">
                <InputGroup
                  startElement={
                    <RightSearchIcon color="#929292" w="30px" h="30px" />
                  }
                  fontSize="16px"
                  flex="1"
                  border="1px solid #929292"
                  borderRadius="6px"
                >
                  <Input placeholder="Search departments" padding="4px 12px" />
                </InputGroup>
                <Button
                  variant="outline"
                  ml="4"
                  padding="4px 12px"
                  bg="#1367EA"
                  color="white"
                  borderRadius="6px"
                >
                  <PlusIcon
                    boxSize="14px"
                    fill="white"
                    stroke="white"
                    stroke-width="0.38"
                  />
                  add position
                </Button>
              </Flex>
              <VStack
                spaceY="10px"
                mt="26px"
                alignItems="flex-start"
                height="500px"
                maxHeight="calc(75vh - 180px)"
                overflowY="auto"
                scrollbar="hidden"
              >
                {positions?.map((position) => (
                  <ModifyPositionCard key={position.id} position={position} />
                ))}
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
