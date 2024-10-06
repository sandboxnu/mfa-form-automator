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
import Link from 'next/link';
import { RightArrowIcon } from 'apps/web/src/static/icons';
import { SearchAndSort } from 'apps/web/src/components/SearchAndRecent';
import { ViewAll } from 'apps/web/src/components/ViewAll';

/**
 * @param title - the title of the form list
 * @param formInstances - an array of form instances
 * @param color - the color of the form list
 * @param extended - whether search and sort options are enabled
 * @param link - link to page for category
 * @param border - if true should have border
 * @returns a list of forms for the dashboard
 */
export const FormList = ({
  title,
  formInstances,
  color,
  extended,
  link,
  border,
}: {
  title: string;
  formInstances: FormInstanceEntity[];
  color: string;
  extended: boolean;
  link: string;
  border: boolean;
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

  const OptionDisplay = () => {
    return (
      <>
        {extended ? <SearchAndSort /> : <ViewAll title={title} link={link} />}
      </>
    );
  };

  const showPadding = () => {
    return border ? '12px 30px 12px 30px' : '12px 30px 12px 0px';
  };

  const headingSize = () => {
    return extended ? '24px' : '19px';
  };

  return (
    <>
      <Box padding={showPadding()}>
        <Flex justifyContent="space-between" pb="20px">
          <Flex alignItems="flex-end">
            <Heading as="h2" textColor="#363940" fontSize={headingSize()}>
              {title}
            </Heading>
            <Box pb="0px">
              <Flex
                marginLeft="11px"
                backgroundColor={color}
                height="25px"
                width="41px"
                borderRadius="20"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="16px" fontWeight="700" color="#4C483D">
                  {formInstances.length}
                </Text>
              </Flex>
            </Box>
          </Flex>
          <OptionDisplay />
        </Flex>
        <Box>
          <Grid
            templateColumns="repeat(20, 1fr)"
            gap={0}
            background="white"
            borderTopRadius={'8px'}
            boxShadow="0px 0px 1px 1px #d4d4d4"
            textColor={'#5E5E5E'}
          >
            <GridItem colSpan={8} h="48px">
              <Text fontSize="15px" fontWeight="700" pl="24px" pt="10px">
                Form
              </Text>
            </GridItem>
            <GridItem colSpan={3} h="48px">
              <Text fontSize="15px" fontWeight="700" pt="10px">
                Date Assigned
              </Text>
            </GridItem>
            <GridItem colSpan={4} h="48px">
              <Text fontSize="15px" fontWeight="700" pt="10px">
                Originator
              </Text>
            </GridItem>
            <GridItem colSpan={5} h="48px">
              <Text fontSize="15px" fontWeight="700" pt="10px">
                Assignees
              </Text>
            </GridItem>
          </Grid>
          {sortedFormInstances.map(
            (formInstance: FormInstanceEntity, index: number) => (
              <FormRow
                formInstance={formInstance}
                key={index}
                last={index === sortedFormInstances.length - 1}
                link={'/form-instances/' + formInstance.id}
              />
            ),
          )}
        </Box>
      </Box>
    </>
  );
};
