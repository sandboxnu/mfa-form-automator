import {
  Avatar,
  AvatarGroup,
  Flex,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';
import { FormInstanceEntity, SignatureEntity } from '@web/client';

// form component for displaying a row in a list of forms
export const FormRow = ({
  formInstance,
  last,
}: {
  formInstance: FormInstanceEntity;
  last?: boolean;
}) => {
  return (
    <>
      <Grid
        templateColumns="repeat(20, 1fr)"
        gap={0}
        background="white"
        borderBottomRadius={last ? '5px' : '0px'}
        boxShadow="0px 0px 1px 1px #f7f7f7"
        _hover={{ boxShadow: '0px 0px 1px 1px #dbdbdb' }}
        mb={'2px'}
      >
        <GridItem colSpan={10} h="64px">
          <Text pl="24px" pt="20px">
            {formInstance.name}
          </Text>
        </GridItem>
        <GridItem colSpan={5} h="64px">
          <Flex alignItems="center" pt="15px">
            <Avatar
              name={formInstance.originator.firstName + ' ' + formInstance.originator.lastName}
              boxSize="36px"
              backgroundColor={'#DCDCDC'}
              border="1px solid #FFFFFF"
              color="black"
              fontWeight={400}
              fontSize="14px"
              size="sm"
            />
            <Text pl="8px">{formInstance.originator.firstName} {formInstance.originator.lastName}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={5} h="64px">
          <Flex pt="15px">
            <AvatarGroup size="sm" max={5}>
              {/*Dummy values until userSignedBy fixed*/}
              {formInstance.signatures.map(
                (signature: SignatureEntity, index: number) => {
                  return (
                    <Avatar
                      name={signature.signerPosition.name}
                      key={index}
                      boxSize="36px"
                      backgroundColor={signature.signed ? '#D0F0DC' : '#DCDCDC'}
                      border="1px solid #FFFFFF"
                      color="black"
                      fontWeight={400}
                      fontSize="12px"
                    />
                  );
                },
              )}
            </AvatarGroup>
            <Text pl="15px" mt="5px">{`${
              formInstance.signatures.filter((signature: SignatureEntity) => {
                return signature.signed;
              }).length
            }/${formInstance.signatures.length}`} signed</Text>
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
};
