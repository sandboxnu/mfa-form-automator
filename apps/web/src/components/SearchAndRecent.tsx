import { FormRow } from './FormRow';
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { RightSearchIcon, SortDownArrow } from 'apps/web/src/static/icons';
import { motion } from 'framer-motion';

/**
 * @returns a search bar and sort by dropdown
 */
export const SearchAndSort = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { isOpen, onToggle } = useDisclosure();
    const [showButton, setShowButton] = useState(false);

    return <>
          <Flex alignItems="flex-end">
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              onAnimationComplete={() => setShowButton(!isOpen)}
            >
              <InputGroup marginRight="12px">
                {isOpen ? (
                  <InputLeftElement
                    as="button"
                    onClick={onToggle}
                    justifyContent="flex-start"
                  >
                    <RightSearchIcon color="#595959" w="25px" h="25px" />
                  </InputLeftElement>
                ) : (
                  <Button
                    variant="unstyled"
                    onClick={onToggle}
                    display="flex"
                    alignItems="flex-end"
                    p={0}
                  >
                    <RightSearchIcon color="#595959" w="25px" h="25px" />
                  </Button>
                )}
                <Input
                  size="16px"
                  borderRadius="0"
                  border="none"
                  marginRight="12px"
                  borderBottom="1px solid"
                  borderColor="#B0B0B0"
                  boxShadow="none"
                  _hover={{ borderColor: '#595959' }}
                  _focus={{
                    borderColor: '#595959',
                    boxShadow: 'none',
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </motion.div>
            {showButton && !isOpen && (
              <Button
                variant="unstyled"
                onClick={onToggle}
                height="32px"
                alignItems="center"
                p={0}
              >
                <RightSearchIcon color="#595959" w="25px" h="25px" />
              </Button>
            )}
            <Text
              fontSize="16px"
              fontWeight="400"
              textAlign="left"
              alignItems="center"
              paddingRight="5px"
              paddingBottom="4px">
                Sort by:
            </Text>
            <Select
              minW="100px"
              maxW="100px"
              minH="32px"
              maxH="32px"
              backgroundColor="white"
              borderRadius="md"
              size="16px"
              icon={<SortDownArrow />}
              iconSize="10px"
            >
              <option value="recent">&nbsp;&nbsp;Recent</option>
              <option value="option2">&nbsp;&nbsp;Option 2</option>
              <option value="option3">&nbsp;&nbsp;Option 3</option>
            </Select>
          </Flex>
        </>
  };