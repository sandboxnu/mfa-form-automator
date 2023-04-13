import {
  Avatar,
  AvatarGroup,
  Flex,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import { Assignee, FormInstance } from "@/utils/types";

export const FormRow = ({ formInstance }: { formInstance: FormInstance }) => {
  return (
    <>
      <Grid
        templateColumns="repeat(20, 1fr)"
        gap={0}
        background="white"
        boxShadow="0px 0px 1px 1px #f7f7f7"
        _hover={{ boxShadow: "0px 0px 1px 1px #dbdbdb" }}
        mb={"2px"}
      >
        <GridItem colSpan={10} h="64px">
          <Text pl="24px" pt="20px">
            {formInstance.name}
          </Text>
        </GridItem>
        <GridItem colSpan={5} h="64px">
          <Flex alignItems="center" pt="15px">
            <Avatar
              name={formInstance.originator}
              boxSize="36px"
              backgroundColor={"#DCDCDC"}
              border="1px solid #FFFFFF"
              color="black"
              fontWeight={400}
              fontSize="14px"
            />
            <Text pl="8px">{formInstance.originator}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={5} h="64px">
          <Flex pt="15px">
            <AvatarGroup size="md" max={5}>
              {formInstance.assignees.map(
                (assignee: Assignee, index: number) => {
                  return (
                    <Avatar
                      name={assignee.name}
                      key={index}
                      boxSize="36px"
                      backgroundColor={assignee.signed ? "#D0F0DC" : "#DCDCDC"}
                      border="1px solid #FFFFFF"
                      color="black"
                      fontWeight={400}
                      fontSize="14px"
                    />
                  );
                }
              )}
            </AvatarGroup>
            <Text pl="15px" mt="5px">{`${
              formInstance.assignees.filter((assignee) => {
                return assignee.signed;
              }).length
            }/${formInstance.assignees.length}`}</Text>
          </Flex>
        </GridItem>
      </Grid>
      {/* <Flex
        justifyContent="space-between"
        alignItems="center"
        h="64px"
        p="10px"
        background={"#FFFFFF"}
        boxShadow="inset 0px -5px 2px -5px #8B8B8B"
      >
        <Text pl="24px">{formInstance.name}</Text>
        <Flex alignItems="center">
          <Avatar
            name={formInstance.originator}
            boxSize="36px"
            backgroundColor={"#DCDCDC"}
            border="1px solid #FFFFFF"
            color="black"
            fontWeight={400}
            fontSize="14px"
          />
          <Text pl="8px">{formInstance.originator}</Text>
        </Flex>

        <AvatarGroup size="md" max={5} marginTop="10px">
          {formInstance.assignees.map((assignee: Assignee, index: number) => {
            return (
              <Avatar
                name={assignee.name}
                key={index}
                boxSize="36px"
                backgroundColor={assignee.signed ? "#D0F0DC" : "#DCDCDC"}
                border="1px solid #FFFFFF"
                color="black"
                fontWeight={400}
                fontSize="14px"
              />
            );
          })}
        </AvatarGroup>
      </Flex> */}
    </>
  );
};
