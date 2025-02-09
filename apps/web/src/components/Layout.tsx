import { Box } from '@chakra-ui/react';
import { NavBar } from './NavBar.tsx';
import { TopBar } from './TopBar.tsx';
import CreateFormInstanceModal from './createFormInstance/CreateFormInstanceModal.tsx';
import { useState } from 'react';

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
      _dark={{
        bg: 'gray.700',
      }}
      minH="100vh"
      height="100%"
    >
      <NavBar
        onOpenCreateFormInstance={() => setIsCreateFormInstanceOpen(true)}
      />
      <Box>
        <TopBar />

        <Box as="main" ml="60" pt="60px">
          {children}
        </Box>
      </Box>
      <CreateFormInstanceModal
        open={isCreateFormInstanceOpen}
        onClose={() => setIsCreateFormInstanceOpen(false)}
      />
    </Box>
  );
};
