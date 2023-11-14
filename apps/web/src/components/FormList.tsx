import { FormRow } from './FormRow';
import { Box, Flex, Grid, GridItem, Input, InputGroup, InputLeftElement, Select, Text } from '@chakra-ui/react';
import { RightSearchIcon, SortDownArrow } from 'apps/web/src/static/icons';
import { FormInstanceEntity } from '@web/client';
import { useState } from 'react';

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

  const filteredFormInstances = formInstances.filter((formInstance) =>
    formInstance.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          <Flex alignItems="baseline">
            <InputGroup marginRight="12px">
              <InputLeftElement pointerEvents="none">
                <RightSearchIcon color="#595959" w="25px" h="25px" />
              </InputLeftElement>
              <Input
                size="16px"
                borderRadius="0"
                border="none"
                borderBottom="1px solid"
                borderColor="#B0B0B0"
                boxShadow="none"
                _hover={{ borderColor: "#595959" }}
                _focus={{
                  borderColor: "#595959",
                  boxShadow: "none",
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
            <Text fontSize="16px" width="115px" height="21px">
              Sort by:
            </Text>
            <Select
              minW="85px"
              maxW="85px"
              minH="28px"
              maxH="28px"
              backgroundColor="white"
              borderRadius="md"
              size="16px"
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
          {filteredFormInstances.map((formInstance: FormInstanceEntity, index: number) => (
            <FormRow
              formInstance={formInstance}
              key={index}
              link={'/form-instances/' + formInstance.id}
            />
          ))}
        </Box>
      </Box>
    </>
  );
};
