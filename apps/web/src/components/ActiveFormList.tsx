import { Box, Flex, Stack, Table, Text } from '@chakra-ui/react';
import { Status } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SearchAndSort } from '@web/components/SearchAndSort';
import { AssignedGroupEntity, FormInstanceEntity } from '@web/client';
import { AssignedAvatarGroup } from '@web/components/AssignedAvatarGroup.tsx';
import { formInstancesControllerFindAllOptions } from '@web/client/@tanstack/react-query.gen';
import { useEffect, useState } from 'react';
import { distance } from 'fastest-levenshtein';
import { PreviewIcon } from '@web/static/icons';
import { useQuery } from '@tanstack/react-query';
import { isFullySigned } from '@web/utils/formInstanceUtils';
import { useAuth } from '@web/hooks/useAuth';

export const ActiveFormList = ({ title }: { title: string }) => {
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: allActiveForms,
    error,
    isLoading,
  } = useQuery({
    ...formInstancesControllerFindAllOptions(),
    enabled: !!user,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortedFormInstances, setSortedFormInstances] = useState<
    FormInstanceEntity[]
  >(allActiveForms || []);

  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!allActiveForms) return;

    const filteredAndSortedForms = allActiveForms
      .filter((formInstance) => {
        return formInstance.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        return (
          distance(searchQuery.toLowerCase(), a.name.toLowerCase()) -
          distance(searchQuery.toLowerCase(), b.name.toLowerCase())
        );
      });

    setSortedFormInstances(filteredAndSortedForms);
  }, [searchQuery, allActiveForms]);

  if (isLoading || !allActiveForms || error) {
    return <></>;
  }

  return (
    <>
      <Box>
        <Flex justifyContent="space-between" direction="column">
          <Text
            fontSize="30px"
            fontStyle="normal"
            fontWeight="700"
            lineHeight="38px"
          >
            {title}
          </Text>

          <Flex
            justify="space-between"
            align="center"
            w="100%"
            marginBottom="8px"
          >
            <Text
              fontSize="16px"
              fontStyle="normal"
              fontWeight="400"
              lineHeight="21px"
            >
              {allActiveForms.length === 1
                ? 'There is 1 active form instance'
                : `There are ${allActiveForms.length} active form instances`}
            </Text>

            <Box ml="auto">
              <SearchAndSort
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortedForms={allActiveForms}
                setSortedForms={setSortedFormInstances}
              />
            </Box>
          </Flex>
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
                    px="40px"
                    fontWeight={700}
                    color="#5E5E5E"
                  >
                    Status
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    py="12px"
                    px="24px"
                    fontWeight={700}
                    color="#5E5E5E"
                  >
                    Form Name
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    py="12px"
                    px="24px"
                    fontWeight={700}
                    color="#5E5E5E"
                  >
                    Creator
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    py="12px"
                    px="24px"
                    fontWeight={700}
                    color="#5E5E5E"
                  >
                    Progress
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    py="12px"
                    px="24px"
                    fontWeight={700}
                    color="#5E5E5E"
                  >
                    Assignees
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    py="12px"
                    px="45px"
                    fontWeight={700}
                    color="#5E5E5E"
                  ></Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sortedFormInstances.map(
                  (formInstance: FormInstanceEntity, index: number) => (
                    <Table.Row
                      key={index}
                      cursor="pointer"
                      _hover={{ backgroundColor: '#f5f5f5' }}
                      bg="white"
                      onMouseEnter={() => setHoveredRowIndex(index)}
                      onMouseLeave={() => setHoveredRowIndex(null)}
                      onClick={() =>
                        router.push('/preview-form/' + formInstance.id)
                      }
                    >
                      <Table.Cell py="12px" px="24px">
                        {isFullySigned(formInstance) &&
                        formInstance.markedCompleted ? (
                          <Status.Root
                            size="lg"
                            width="100px"
                            colorPalette="yellow"
                          >
                            <Status.Indicator />
                            Complete
                          </Status.Root>
                        ) : (
                          <Status.Root
                            size="lg"
                            width="100px"
                            colorPalette="green"
                          >
                            <Status.Indicator />
                            Pending
                          </Status.Root>
                        )}
                      </Table.Cell>

                      <Table.Cell py="12px" px="24px">
                        {formInstance.name}
                      </Table.Cell>

                      <Table.Cell py="12px" px="24px">
                        <Text>
                          {formInstance.originator.firstName}{' '}
                          {formInstance.originator.lastName}
                        </Text>
                      </Table.Cell>

                      <Table.Cell py="12px" px="24px">
                        <Flex>
                          <Text mt="5px">
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
                      <Table.Cell py="12px" px="24px">
                        <AssignedAvatarGroup
                          assignedGroups={formInstance.assignedGroups}
                        />
                      </Table.Cell>
                      <Table.Cell py="12px">
                        {hoveredRowIndex === index && (
                          <>
                            <PreviewIcon boxSize="20px" marginRight="8px" />
                            preview
                          </>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
              </Table.Body>
            </Table.Root>
          </Stack>
        </Box>
      </Box>
    </>
  );
};
