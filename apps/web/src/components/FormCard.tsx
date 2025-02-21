import { Box, Text, Avatar, AvatarGroup, Tooltip } from '@chakra-ui/react';
import { AssignedGroupEntity, FormInstanceEntity } from '@web/client';
import { MouseEventHandler } from 'react';

/**
 * @param formName - the name of the form
 * @param assignedGroups - the assigned groups on the form
 * @param link - the link to the form
 * @returns a card for a form
 */
export const FormCard = ({
  formName,
  assignedGroups,
  link,
  clickFunction,
}: {
  formName: String;
  assignedGroups: AssignedGroupEntity[];
  link: string;
  clickFunction: MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <>
      <Box
        minW="246px"
        minH="120px"
        borderRadius="5px"
        backgroundColor="#FFFFFF"
        boxShadow="0px 0.5px 3px 1px #DCDCDC"
        background="#FCFCFC"
        cursor="pointer"
        onClick={clickFunction}
        _hover={{
          boxShadow: '0px 0.5px 6px 1px #DCDCDC',
        }}
      >
        <Box padding="24px" paddingBottom="27px" paddingTop="27px">
          <Text
            fontFamily="Hanken Grotesk"
            fontWeight={800}
            fontSize="18px"
            isTruncated
          >
            {formName}
          </Text>
          <AvatarGroup size="sm" max={5} marginTop="9px" spacing={'-3px'}>
            {assignedGroups
              .sort((a, b) => a.order - b.order)
              .map((assignedGroup: AssignedGroupEntity, index: number) => {
                return (
                  <Tooltip
                    bg={'white'}
                    color={'black'}
                    placement="bottom-start"
                    label={
                      <>
                        <Text fontSize="16px" fontWeight="bold">
                          {assignedGroup.signerEmployee?.firstName +
                            ' ' +
                            assignedGroup.signerEmployee?.lastName}
                        </Text>
                      </>
                    }
                    key={index}
                  >
                    <Avatar
                      name={
                        assignedGroup.signerEmployee?.firstName +
                        ' ' +
                        assignedGroup.signerEmployee?.lastName
                      }
                      key={index}
                      boxSize="32px"
                      backgroundColor={
                        assignedGroup.signed ? '#D1F0D4' : '#DCDCDC'
                      }
                      outline="1px solid #FFFFFF"
                      color="black"
                      fontWeight={400}
                      fontSize="16px"
                      size="sm"
                      marginRight={'-3.5px'}
                    />
                  </Tooltip>
                );
              })}
          </AvatarGroup>
        </Box>
      </Box>
    </>
  );
};
