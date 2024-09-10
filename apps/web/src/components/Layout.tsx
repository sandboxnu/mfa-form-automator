import { Box, useDisclosure } from '@chakra-ui/react';
import { NavBar } from './NavBar';
import { TopBar } from './TopBar';
import { CreateFormTemplateModal } from './createFormTemplate/CreateFormTemplateModal';
import { useAuth } from '@web/hooks/useAuth';
import CreateFormInstanceModal from './createFormInstance/CreateFormInstanceModal';

// common layout component for all pages
export const Layout = ({ children }: { children: any }) => {
  const {
    isOpen: isCreateFormTemplateOpen,
    onOpen: onOpenCreateFormTemplate,
    onClose: onCloseCreateFormTemplate,
  } = useDisclosure();

  const {
    isOpen: isCreateFormInstanceOpen,
    onOpen: onOpenCreateFormInstance,
    onClose: onCloseCreateFormInstance,
  } = useDisclosure();

  useAuth();

  return (
    <Box
      as="section"
      bg="gray.50"
      _dark={{
        bg: 'gray.700',
      }}
      minH="100vh"
    >
      <NavBar
        onOpenCreateFormTemplate={onOpenCreateFormTemplate}
        onOpenCreateFormInstance={onOpenCreateFormInstance}
      />
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
      <CreateFormInstanceModal
        isOpen={isCreateFormInstanceOpen}
        onClose={onCloseCreateFormInstance}
      />
    </Box>
  );
};
