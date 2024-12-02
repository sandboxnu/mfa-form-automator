import { Box, useDisclosure } from '@chakra-ui/react';
import { NavBar } from './NavBar';
import { TopBar } from './TopBar';
import CreateFormInstanceModal from './createFormInstance/CreateFormInstanceModal';

/**
 * @param children - the children of the layout
 * @returns overall layout of the application
 */
export const Layout = ({ children }: { children: any }) => {
  const {
    isOpen: isCreateFormInstanceOpen,
    onOpen: onOpenCreateFormInstance,
    onClose: onCloseCreateFormInstance,
  } = useDisclosure();

  return (
    <Box
      as="section"
      bg="gray.50"
      _dark={{
        bg: 'gray.700',
      }}
      minH="100vh"
      height="100%"
    >
      <NavBar onOpenCreateFormInstance={onOpenCreateFormInstance} />
      <Box>
        <TopBar />

        <Box as="main" ml="60" pt="60px">
          {children}
        </Box>
      </Box>
      <CreateFormInstanceModal
        isOpen={isCreateFormInstanceOpen}
        onClose={onCloseCreateFormInstance}
      />
    </Box>
  );
};
