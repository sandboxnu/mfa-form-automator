import {
  Avatar,
  AvatarGroup,
  Divider,
  Flex,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';
import { FormInstanceEntity, SignatureEntity } from '@web/client';
import {
  getInitialsFromSignature,
  getNameFromSignature,
} from '@web/utils/formInstanceUtils';
import { useRouter } from 'next/router';
import { ProfileHover } from './ProfileHover';

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Grid
        templateColumns="repeat(20, 1fr)"
        gap={0}
        z-index={0}
        background="white"
        borderBottomRadius={last ? '8px' : '0px'}
        boxShadow="0px 0px 1px 1px #d4d4d4"
        _hover={{
          boxShadow: '0px 0px 4px 0px #1367EA',
          position: 'relative',
          zIndex: '3000',
        }}
        mb={'0px'}
        cursor="pointer"
        onClick={() => router.push(link)}
      >
        <GridItem colSpan={8} h="64px">
          <Text pl="24px" pt="20px" fontWeight={500} isTruncated>
            {formInstance.name}
          </Text>
        </GridItem>
        <GridItem colSpan={3} h="64px">
          <Text pt="20px" fontWeight={400}>
            {formatDate(formInstance.createdAt)}
          </Text>
        </GridItem>
        <GridItem colSpan={4} h="64px">
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
                    <>
                      <Avatar
                        name={getInitialsFromSignature(signature)}
                        key={index}
                        boxSize="36px"
                        backgroundColor={
                          signature.signed ? '#D0F0DC' : '#DCDCDC'
                        }
                        border="1px solid #FFFFFF"
                        color="black"
                        fontWeight={400}
                        fontSize="12px"
                      />
                    </>
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
