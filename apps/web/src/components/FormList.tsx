import { FormRow } from './FormRow';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
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
          <Flex>
            <Text fontSize="22px" fontWeight="800">
              {title}
            </Text>
            <Box pt="10px">
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

          <Flex alignItems="center" gap="6px" justifyContent="flex-end">
            <span> Sort by: </span>
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
