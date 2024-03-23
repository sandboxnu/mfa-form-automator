import { FormRow } from './FormRow';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { RightSearchIcon, SortDownArrow } from 'apps/web/src/static/icons';
import { FormInstanceEntity } from '@web/client';
import { useState } from 'react';
import { distance } from 'fastest-levenshtein';
import { motion } from 'framer-motion';

// abstracted component for displaying forms in list format
export const FormList = ({
  title,
  formInstances,
  color,
}: {
  title: string;
  formInstances: FormInstanceEntity[];
  color: string;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isOpen, onToggle } = useDisclosure();
  const [showButton, setShowButton] = useState(false);

  const sortedFormInstances = formInstances
    .map((formInstance) => ({
      ...formInstance,
      levenshteinDistance: distance(
        searchQuery.toLowerCase(),
        formInstance.name.toLowerCase(),
      ),
    }))
    .sort((a, b) => a.levenshteinDistance - b.levenshteinDistance);

  return (
    <>
      <Box padding="30px">
        <Flex justifyContent="space-between" pb="20px">
          <Flex alignItems="flex-end">
            <Heading as="h2">{title}</Heading>
            <Box pb="5px">
              <Flex
                marginLeft="13px"
                backgroundColor={color}
                height="18px"
                width="32px"
                borderRadius="12"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="14px" fontWeight="700" color="#756160">
                  {formInstances.length}
                </Text>
              </Flex>
            </Box>
          </Flex>

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
        </Flex>
        <Box>
          <Grid
            templateColumns="repeat(20, 1fr)"
            gap={0}
            background="white"
            borderTopRadius={'5px'}
            boxShadow="0px 0px 1px 1px #f7f7f7"
            textColor={'#8B8B8B'}
          >
            <GridItem colSpan={10} h="48px">
              <Text fontSize="16px" fontWeight="800" pl="24px" pt="10px">
                Form
              </Text>
            </GridItem>
            <GridItem colSpan={5} h="48px">
              <Text fontSize="16px" fontWeight="800" pt="10px">
                Originator
              </Text>
            </GridItem>
            <GridItem colSpan={5} h="48px">
              <Text fontSize="16px" fontWeight="800" pt="10px">
                Assignees
              </Text>
            </GridItem>
          </Grid>
          {sortedFormInstances.map(
            (formInstance: FormInstanceEntity, index: number) => (
              <FormRow
                formInstance={formInstance}
                key={index}
                link={'/form-instances/' + formInstance.id}
              />
            ),
          )}
        </Box>
      </Box>
    </>
  );
};
