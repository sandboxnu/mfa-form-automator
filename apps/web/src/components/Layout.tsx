import { Box } from '@chakra-ui/react';
import { NavBar } from './NavBar';
import { TopBar } from './TopBar';

/**
 * @param children - the children of the layout
 * @returns overall layout of the application
 */
export const Layout = ({ children }: { children: any }) => {
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
      <NavBar />
      <Box>
        <TopBar />

        <Box as="main" ml="60" pt="60px">
          {children}
        </Box>
      </Box>
    </Box>
  );
};
