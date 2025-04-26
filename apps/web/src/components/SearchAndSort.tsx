import { Button, Flex, Input, Menu, Portal, Text } from '@chakra-ui/react';
import React, { SetStateAction, useEffect, useState } from 'react';
import { RightSearchIcon } from '@web/static/icons.tsx';
import { motion } from 'framer-motion';
import { InputGroup } from './ui/input-group';
import { SortBy } from '@web/client';

export type SearchAndSortProps<
  T extends { createdAt: string | Date; name: string },
> = {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  setSortOption: React.Dispatch<SortBy>;
  sortedForms?: T[];
  setSortedForms?: React.Dispatch<SetStateAction<T[]>>;
};

/**
 * @returns a search bar and sort by dropdown
 */
export const SearchAndSort = <
  T extends { createdAt: string | Date; name: string },
>({
  searchQuery,
  setSearchQuery,
  setSortOption,
  sortedForms,
  setSortedForms,
}: SearchAndSortProps<T>) => {
  const [showSearchField, setShowSearchField] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [sortValue, setSortValue] = useState('Recent'); // Default sort value

  useEffect(() => {
    if (!sortedForms || sortedForms.length === 0) return;
    if (!setSortedForms) return;

    switch (sortValue.toLowerCase()) {
      case 'recent':
        setSortedForms(
          [...sortedForms].sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }),
        );
        return;
      case 'oldest':
        setSortedForms(
          [...sortedForms].sort((a, b) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          }),
        );
        return;
      case 'a to z':
        setSortedForms(
          [...sortedForms].sort((a, b) => {
            // Sort alphabetically by name
            return a.name.localeCompare(b.name);
          }),
        );
        return;
    }
  }, [sortValue, sortedForms, setSortedForms]);

  return (
    <Flex alignItems="flex-end">
      <Flex alignItems="center">
        {showButton && !showSearchField && (
          <Button
            unstyled
            onClick={() => setShowSearchField(!showSearchField)}
            height="32px"
            alignItems="center"
            p={0}
            pr={1.5}
            _hover={{
              background: 'transparent', // Keep it transparent on hover
              cursor: 'pointer',
            }}
          >
            <RightSearchIcon color="#595959" w="28px" h="28px" />
          </Button>
        )}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: showSearchField ? 'auto' : 0,
            opacity: showSearchField ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => setShowButton(!showSearchField)}
        >
          <Flex alignItems="center" pr="10px">
            <Button
              unstyled
              onClick={() => setShowSearchField(!showSearchField)}
              height="32px"
              alignItems="center"
              p={0}
              pr={1.5}
            >
              <RightSearchIcon color="#595959" w="28px" h="28px" />
            </Button>
            <InputGroup>
              <Input
                // TODO: Used to be 16px, but we can't use absolute values in Chakra v3
                size="sm"
                h="25px"
                pl="2"
                borderColor="#B0B0B0"
                boxShadow="none"
                _hover={{ borderColor: '#595959' }}
                _focus={{
                  borderColor: '#595959',
                  boxShadow: 'none',
                }}
                placeholder="Search for forms"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
              />
            </InputGroup>
          </Flex>
        </motion.div>
        <Text
          fontSize="16px"
          fontWeight="400"
          textAlign="left"
          alignItems="center"
          paddingRight="5px"
          paddingBottom="4px"
        >
          Sort by:
        </Text>
      </Flex>

      <Menu.Root>
        <Menu.Trigger asChild>
          <Button variant="outline" size="sm" p={2}>
            {sortValue}
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.RadioItemGroup
                value={sortValue}
                onValueChange={(e) => {
                  const option = [
                    { value: SortBy.CREATED_AT_DESC, label: 'Recent' },
                    { value: SortBy.CREATED_AT_ASC, label: 'Oldest' },
                    { value: SortBy.NAME_ASC, label: 'A to Z' },
                  ].find((item) => item.value === e.value);
                  setSortValue(option?.label || 'Recent');
                  setSortOption(e.value as SortBy);
                }}
              >
                {[
                  {
                    value: SortBy.CREATED_AT_DESC,
                    label: 'Recent',
                  },
                  {
                    value: SortBy.CREATED_AT_ASC,
                    label: 'Oldest',
                  },
                  {
                    value: SortBy.NAME_ASC,
                    label: 'A to Z',
                  },
                ].map((item) => (
                  <Menu.RadioItem key={item.value} value={item.value} p={2}>
                    {item.label}
                    <Menu.ItemIndicator />
                  </Menu.RadioItem>
                ))}
              </Menu.RadioItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Flex>
  );
};
