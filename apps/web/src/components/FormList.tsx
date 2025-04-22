import React, { useEffect } from 'react';
import { Box, Flex, Stack, Table, Text, Avatar } from '@chakra-ui/react';
import {
  AssignedGroupEntity,
  FormInstanceEntity,
} from '@web/client/types.gen.ts';
import { useState } from 'react';
import { distance } from 'fastest-levenshtein';
import { SearchAndSort } from 'apps/web/src/components/SearchAndSort.tsx';
import { ViewAll } from 'apps/web/src/components/ViewAll.tsx';
import { NoForms } from '@web/static/icons.tsx';
import { AssignedAvatarGroup } from './AssignedAvatarGroup.tsx';
import { SignFormInstancePreview } from './SignFormInstancePreview.tsx';

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

  const [open, setOpen] = useState(false);
  const [selectedFormInstance, setSelectedFormInstance] =
    useState<FormInstanceEntity | null>(null);

  const openModal = (formInstance: FormInstanceEntity) => {
    setSelectedFormInstance(formInstance);
    setOpen(true);
  };

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
                setSortOption={() => {}} // No sorting on form instances
                sortedForms={formInstances}
                setSortedForms={setSortedFormInstances}
              />
            )}
          </>
        </Flex>
        <Box>
          <Stack gap="70">
            <Table.Root
              key="lg"
              size="lg"
              width="full"
              variant={'outline'}
              borderWidth="1px"
              borderRadius="8px"
            >
              <Table.Header>
                <Table.Row bg="white">
                  <Table.ColumnHeader
                    py="12px"
                    px="24px"
                    fontWeight={700}
                    color="#5E5E5E"
                  >
                    Form
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    py="12px"
                    px="24px"
                    fontWeight={700}
                    color="#5E5E5E"
                  >
                    Date Assigned
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    py="12px"
                    px="24px"
                    fontWeight={700}
                    color="#5E5E5E"
                  >
                    Originator
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    py="12px"
                    px="24px"
                    fontWeight={700}
                    color="#5E5E5E"
                  >
                    Assignees
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sortedFormInstances.length > 0 ? (
                  sortedFormInstances.map(
                    (formInstance: FormInstanceEntity, index: number) => (
                      <Table.Row
                        key={index}
                        cursor="pointer"
                        _hover={{ backgroundColor: '#f5f5f5' }}
                        bg="white"
                        onClick={() => openModal(formInstance)}
                      >
                        <Table.Cell py="12px" px="24px">
                          <Text fontWeight={500}>{formInstance.name}</Text>
                        </Table.Cell>

                        <Table.Cell py="12px" px="24px">
                          <Text fontWeight={400}>
                            {new Date(
                              formInstance.createdAt,
                            ).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Text>
                        </Table.Cell>

                        <Table.Cell py="12px" px="24px">
                          <Flex alignItems="center">
                            <Avatar.Root
                              boxSize="36px"
                              backgroundColor={'#DCDCDC'}
                              border="1px solid #FFFFFF"
                              color="black"
                              fontWeight={400}
                              fontSize="14px"
                              size="sm"
                            >
                              <Avatar.Fallback
                                name={`${formInstance.originator.firstName} ${formInstance.originator.lastName}`}
                              />
                            </Avatar.Root>
                            <Text pl="8px">
                              {formInstance.originator.firstName}{' '}
                              {formInstance.originator.lastName}
                            </Text>
                          </Flex>
                        </Table.Cell>

                        <Table.Cell py="12px" px="24px">
                          <Flex>
                            <AssignedAvatarGroup
                              assignedGroups={formInstance.assignedGroups}
                            />
                            <Text pl="15px" mt="5px">
                              {`${
                                formInstance.assignedGroups.filter(
                                  (assignedGroup: AssignedGroupEntity) =>
                                    assignedGroup.signed,
                                ).length
                              }/${formInstance.assignedGroups.length}`}{' '}
                              signed
                            </Text>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ),
                  )
                ) : (
                  <Table.Row bg="white">
                    <Table.Cell colSpan={4} py="40px" textAlign="center">
                      <Flex
                        flexDirection="column"
                        alignItems="center"
                        gap="16px"
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
                        <Text color="#32353B" fontSize="21px" fontWeight={500}>
                          {"You're all caught up!"}
                        </Text>
                        <Text
                          color="#7F8185"
                          fontSize="16px"
                          fontWeight={400}
                          lineHeight="21px"
                          width="296px"
                          textAlign="center"
                        >
                          It appears there are no forms requiring your attention
                          at the moment.
                        </Text>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </Stack>
        </Box>
      </Box>
      {selectedFormInstance && (
        <SignFormInstancePreview
          isOpen={open}
          onClose={() => setOpen(false)}
          formInstance={selectedFormInstance}
        />
      )}
    </>
  );
};
