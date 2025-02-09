import React, { useEffect } from 'react';
import { FormRow } from './FormRow.tsx';
import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { FormInstanceEntity } from '@web/client/types.gen.ts';
import { useState } from 'react';
import { distance } from 'fastest-levenshtein';
import { SearchAndSort } from 'apps/web/src/components/SearchAndSort.tsx';
import { ViewAll } from 'apps/web/src/components/ViewAll.tsx';
import { NoForms } from '@web/static/icons.tsx';

/**
 * @param title - the title of the form list
 * @param formInstances - an array of form instances
 * @param color - the color of the form list
 * @param isDashboard - whether component is displayed on index page
 * @param link - link to page for category
 * @returns a list of forms for the dashboard
 */

export const FormList = ({
  title,
  formInstances,
  color,
  isDashboard,
  link,
}: {
  title: string;
  formInstances: FormInstanceEntity[];
  color: string;
  isDashboard: boolean;
  link?: string;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedFormInstances, setSortedFormInstances] = useState(formInstances);

  useEffect(() => {
    setSortedFormInstances(
      formInstances
        .map((formInstance) => ({
          ...formInstance,
          levenshteinDistance: distance(
            searchQuery.toLowerCase().slice(0, 10),
            formInstance.name.toLowerCase().slice(0, 10),
          ),
        }))
        .sort((a, b) => a.levenshteinDistance - b.levenshteinDistance),
    );
  }, [searchQuery, formInstances]);

  return (
    <>
      <Box>
        <Flex justifyContent="space-between" pb="20px">
          <Flex alignItems="center">
            <Text
              css={{ '--color': '#363940' }}
              fontSize={isDashboard ? '19px' : '24px'}
              fontWeight="700"
            >
              {title}
            </Text>
            <Box pb="0px">
              <Flex
                marginLeft="11px"
                backgroundColor={color}
                height="25px"
                width="41px"
                borderRadius="20px"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="16px" fontWeight="700" color="#4C483D">
                  {formInstances.length}
                </Text>
              </Flex>
            </Box>
          </Flex>
          <>
            {isDashboard ? (
              <ViewAll title={title} link={link || '/'} />
            ) : (
              <SearchAndSort
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
          </>
        </Flex>
        <Box>
          <Grid
            templateColumns="repeat(20, 1fr)"
            gap={0}
            background="white"
            borderTopRadius={'8px'}
            boxShadow="0px 0px 1px 1px #d4d4d4"
            css={{ '--color': '#5E5E5E' }}
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
          {sortedFormInstances.length === 0 ? (
            <Flex
              height="392px"
              padding="12px 24px"
              justifyContent={'center'}
              alignItems={'center'}
              gap="24px"
              alignSelf={'stretch'}
              borderRadius="0px 0px 8px 8px"
              border="1px solid #D4D4D4"
              background="#FFF"
            >
              <Flex
                flexDirection="column"
                gap="24px"
                justifyContent="center"
                alignItems="center"
              >
                <Flex
                  width="200px"
                  height="200px"
                  padding="37.5px 47px"
                  justifyContent={'center'}
                  alignItems={'center'}
                  borderRadius="200px"
                  background="#ECF0F2"
                >
                  <NoForms width="106" height="125" />
                </Flex>
                <Flex flexDirection={'column'} alignItems={'center'} gap="8px">
                  <Text color="#32353B" fontSize="21px" fontWeight={500}>
                    {"You're all caught up!"}
                  </Text>
                  <Text
                    color="#7F8185"
                    fontSize="16px"
                    fontWeight={400}
                    lineHeight="21px"
                    width="296px"
                    textAlign={'center'}
                  >
                    It appears there are no forms requiring your attention at
                    the moment.
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </>
  );
};
