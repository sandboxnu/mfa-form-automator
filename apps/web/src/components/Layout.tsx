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
import { CreateFormTemplateModal } from './createFormTemplate/CreateFormTemplateModal';

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

        <Box as="main" ml="320" pt="96px">
          {children}
        </Box>
      </Box>
      <CreateFormTemplateModal
        isCreateFormTemplateOpen={isCreateFormTemplateOpen}
        onCloseCreateFormTemplate={onCloseCreateFormTemplate}
      />
    </Box>
  );
};
