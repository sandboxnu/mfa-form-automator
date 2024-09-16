import {
  Avatar,
  AvatarGroup,
  Flex,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';
import { FormInstanceEntity, SignatureEntity } from '@web/client';
import { useRouter } from 'next/router';

/**
 * @param formInstance - the form instance
 * @returns a row for a form
 */
export const FormRow = ({
  formInstance,
  last,
  link,
}: {
  formInstance: FormInstanceEntity;
  last?: boolean;
  link: string;
}) => {
  const router = useRouter();
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
        cursor="pointer"
        onClick={() => router.push(link)}
      >
        <GridItem colSpan={10} h="64px">
          <Text pl="24px" pt="20px" fontWeight="bold">
            {formInstance.name}
          </Text>
        </GridItem>
        <GridItem colSpan={5} h="64px">
          <Flex alignItems="center" pt="15px">
            <Avatar
              name={
                formInstance.originator.firstName +
                ' ' +
                formInstance.originator.lastName
              }
              boxSize="36px"
              backgroundColor={'#DCDCDC'}
              border="1px solid #FFFFFF"
              color="black"
              fontWeight={400}
              fontSize="14px"
              size="sm"
            />
            <Text pl="8px">
              {formInstance.originator.firstName}{' '}
              {formInstance.originator.lastName}
            </Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={5} h="64px">
          <Flex pt="15px">
            <AvatarGroup size="sm" max={5}>
              {formInstance.signatures
                .sort((a, b) => a.order - b.order)
                .map((signature: SignatureEntity, index: number) => {
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
                })}
            </AvatarGroup>
            <Text pl="15px" mt="5px">
              {`${
                formInstance.signatures.filter((signature: SignatureEntity) => {
                  return signature.signed;
                }).length
              }/${formInstance.signatures.length}`}{' '}
              signed
            </Text>
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
};
