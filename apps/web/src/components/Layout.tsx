import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';

import { NavBar } from './NavBar';
import { TopBar } from './TopBar';
import { CreateFormTemplate } from './CreateFormTemplate';

// Common layout component for all pages
export const Layout = ({ children }: { children: any }) => {
  const {
    isOpen: isCreateFormTemplateOpen,
    onOpen: onOpenCreateFormTemplate,
    onClose: onCloseCreateFormTemplate,
  } = useDisclosure();

  return (
    <Box
      as="section"
      bg="gray.50"
      _dark={{
        bg: 'gray.700',
      }}
      minH="100vh"
    >
      <NavBar onOpenCreateFormTemplate={onOpenCreateFormTemplate} />
      <Box>
        <TopBar />

        <Box as="main" ml="320" pt="136">
          {children}
        </Box>
      </Box>
      <Modal
        isOpen={isCreateFormTemplateOpen}
        onClose={onCloseCreateFormTemplate}
      >
        <ModalOverlay />
        <ModalContent minWidth="fit-content" height="fit-content">
          <ModalCloseButton />
          <ModalBody>
            <CreateFormTemplate />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseCreateFormTemplate}>
              Cancel
            </Button>
            <Button color="#4C658A" onClick={() => {}}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
