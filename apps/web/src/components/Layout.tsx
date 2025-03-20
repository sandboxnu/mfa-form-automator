import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { NavBar } from './NavBar';
import { TopBar } from './TopBar';

/**
 * @param children - the children of the layout
 * @returns overall layout of the application
 */
export const Layout = ({ children }: { children: any }) => {
  const [isCreateFormInstanceOpen, setIsCreateFormInstanceOpen] =
    useState(false);

  return (
    <Box
      as="section"
      bg="gray.50"
      _dark={{ bg: 'gray.700' }}
      minH="100vh"
      display="flex"
      flexDirection="column"
    >
      <NavBar
        onOpenCreateFormInstance={() => setIsCreateFormInstanceOpen(true)}
      />
      <Box flex="1" display="flex" flexDirection="column">
        <TopBar />
        <Box as="main" ml="60" pt="60px" flex="1">
          {children}
        </Box>
      </Box>
    </Box>
  );
};
