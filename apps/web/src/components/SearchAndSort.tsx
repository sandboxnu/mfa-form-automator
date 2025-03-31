import {
  Button,
  Flex,
  Input,
  NativeSelectField,
  NativeSelectRoot,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { RightSearchIcon } from '@web/static/icons.tsx';
import { motion } from 'framer-motion';
import { InputGroup } from './ui/input-group';

/**
 * @returns a search bar and sort by dropdown
 */
export const SearchAndSort = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
}) => {
  const [showSearchField, setShowSearchField] = useState(false);
  const [showButton, setShowButton] = useState(true);

  return (
    <>
      <Flex alignItems="flex-end">
        {showButton && !showSearchField && (
          <Button
            unstyled
            onClick={() => setShowSearchField(!showSearchField)}
            height="32px"
            alignItems="center"
            p={0}
            pr={1}
          >
            <RightSearchIcon color="#595959" w="25px" h="25px" />
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
              pr={1}
            >
              <RightSearchIcon color="#595959" w="25px" h="25px" />
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
        {/* TODO: https://chakra-ui.com/docs/components/menu Use Radio items here instead? */}
        <NativeSelectRoot
          minW="100px"
          maxW="100px"
          minH="32px"
          maxH="32px"
          backgroundColor="white"
          borderRadius="md"
          // TODO: Used to be 16px, but we can't use absolute values in Chakra v3
          size="sm"
        >
          <NativeSelectField>
            <option value="recent">&nbsp;&nbsp;Recent</option>
            <option value="option2">&nbsp;&nbsp;Option 2</option>
            <option value="option3">&nbsp;&nbsp;Option 3</option>
          </NativeSelectField>
        </NativeSelectRoot>
      </Flex>
    </>
  );
};
