import React, { useEffect, useState } from 'react';
import { Box, Flex, Grid, GridItem, Text, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, useDisclosure } from '@chakra-ui/react';
import { FormRow } from './FormRow';
import { FormInstanceEntity } from '@web/client';
import { distance } from 'fastest-levenshtein';
import { SearchAndSort } from 'apps/web/src/components/SearchAndSort';
import { ViewAll } from 'apps/web/src/components/ViewAll';
import { NoForms } from '@web/static/icons';
import FormInstance from './FormInstance'; //added this

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFormInstance, setSelectedFormInstance] = useState<FormInstanceEntity | null>(null);

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

  const handleOpenDrawer = (formInstance: FormInstanceEntity) => {
    setSelectedFormInstance(formInstance);
    onOpen();
  };

  return (
    <>
      <Box padding={isDashboard ? '12px 30px 12px 0px' : '12px 30px 12px 30px'}>
        <Flex justifyContent="space-between" pb="20px">
          <Flex alignItems="center">
            <Text
              textColor="#363940"
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
          {sortedFormInstances.map((formInstance, index) => (
            <Box
              key={index}
              onClick={() => handleOpenDrawer(formInstance)}
              cursor="pointer"
            >
              <FormRow
                formInstance={formInstance}
                last={index === sortedFormInstances.length - 1}
                link="#"
              />
            </Box>
          ))}
          {sortedFormInstances.length === 0 && (
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
          )}
        </Box>
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="#f8f9fa" maxWidth="1375px" borderRadius="16px 0 0 16px">
          
          <DrawerBody>
            {selectedFormInstance ? (
              <FormInstance formInstance={selectedFormInstance} onClose={onClose} />
            ) : (
              <Text>No form selected</Text>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
