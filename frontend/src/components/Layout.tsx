import { Box, Flex, HStack, Spacer, VStack } from "@chakra-ui/react";
import { NavBar } from "./NavBar";
import { TopBar } from "./TopBar";

// Common layout component for all pages
export const Layout = ({ children }: { children: any }) => {
  return (
    <>
      <VStack>
        <TopBar />
        <HStack minW="100vw">
          <NavBar />
          <Spacer />
        </HStack>
      </VStack>
      {children}
    </>
  );
};
