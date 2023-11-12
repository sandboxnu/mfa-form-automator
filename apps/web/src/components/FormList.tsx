import { FormRow } from './FormRow';
import { Box, Flex, Grid, GridItem, Select, Text } from '@chakra-ui/react';
import { SortDownArrow } from 'apps/web/src/static/icons';
import { FormInstanceEntity } from '@web/client';

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

          <Flex>
            <Text fontSize="16px" pr="5px">
              Sort by:
            </Text>
            <Select
              minW="85px"
              maxW="85px"
              minH="28px"
              maxH="28px"
              backgroundColor="white"
              borderRadius="0"
              size="xs"
              icon={<SortDownArrow />}
              iconSize="10px"
            >
              <option value="recent">Recent</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
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
          {formInstances.length > 1 &&
            formInstances
              .slice(0, -1)
              .map((formInstance: FormInstanceEntity, index: number) => {
                return (
                  <FormRow
                    formInstance={formInstance}
                    key={index}
                    link={'/form-instances/' + formInstance.id}
                  />
                );
              })}
          {formInstances.length > 0 && (
            <FormRow
              formInstance={formInstances[formInstances.length - 1]}
              key={formInstances.length - 1}
              last={true}
              link={
                '/form-instances/' + formInstances[formInstances.length - 1].id
              }
            />
          )}
        </Box>
      </Box>
    </>
  );
};
