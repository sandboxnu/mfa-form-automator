import { Box } from '@chakra-ui/react';

import { NavBar } from './NavBar';
import { TopBar } from './TopBar';

// Common layout component for all pages
export const Layout = ({ children }: { children: any }) => {
  return (
    <Box
      as="section"
      bg="gray.50"
      _dark={{
        bg: 'gray.700',
      }}
      minH="100vh"
    >
      <NavBar />
      <Box>
        <TopBar />

        <Box as="main" ml="320" pt="136">
          {children}
        </Box>
      </Box>
    </Box>
  );
};
