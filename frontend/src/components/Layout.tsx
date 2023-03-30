import { Box, Flex, HStack, Spacer, VStack } from "@chakra-ui/react";
import { NavBar } from "./NavBar";
import { TopBar } from "./TopBar";

// Common layout component for all pages
export const Layout = ({ children }: { children: any }) => {
  return (
    <Box display="flex">
      <NavBar />
      {/* Sidebar */}
      <Box flex="1" position="fixed" top="75">
        <TopBar />
        {/* Navbar */}
        <Box mt="50px" p="4">
          {/* Rest content */}
        </Box>
      </Box>
    </Box>
  );
};
