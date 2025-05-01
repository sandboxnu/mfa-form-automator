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
      _dark={{ bg: 'gray.700' }}
      minH="100vh"
      display="flex"
      flexDirection="column"
    >
      <NavBar />
      <Box flex="1" display="flex" flexDirection="column">
        <TopBar />
        <Box as="main" ml="60" pt="60px" pb="30px" px="8">
          {children}
        </Box>
      </Box>
    </Box>
  );
};
