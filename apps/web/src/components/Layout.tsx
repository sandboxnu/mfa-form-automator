import { Box, useDisclosure } from '@chakra-ui/react';
import { NavBar } from './NavBar';
import { TopBar } from './TopBar';

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
      _dark={{ bg: 'gray.700' }}
      minH="100vh"
      display="flex"
      flexDirection="column"
    >
      <NavBar onOpenCreateFormInstance={onOpenCreateFormInstance} />
      <Box flex="1" display="flex" flexDirection="column">
        <TopBar />
        <Box as="main" ml="60" pt="60px" flex="1">
          {children}
        </Box>
      </Box>
    </Box>
  );
};
