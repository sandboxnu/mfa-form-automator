import { Avatar, Flex, Grid, GridItem, Text } from '@chakra-ui/react';

import { FormInstanceEntity, SignatureEntity } from '@web/client/types.gen.tsx';
import { useRouter } from 'next/router.js';
import { AssignedAvatarGroup } from './AssignedAvatarGroup.tsx';

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

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  return (
    <>
      <Grid
        // z index must remain safely less than the 1500 of profile hover popover
        // to ensure when it fades out that it remains on top of all form rows,
        // hovered or unhovered
        templateColumns="repeat(20, 1fr)"
        gap={0}
        z-index={0}
        background="white"
        borderBottomRadius={last ? '8px' : '0px'}
        boxShadow="0px 0px 1px 1px #d4d4d4"
        _hover={{
          boxShadow: '0px 0px 4px 0px #1367EA',
          zIndex: '400',
        }}
        mb={'0px'}
        cursor="pointer"
        position="relative"
        onClick={() => router.push(link)}
      >
        <GridItem colSpan={8} h="64px">
          <Text pl="24px" pt="20px" fontWeight={500} truncate>
            {formInstance.name}
          </Text>
        </GridItem>
        <GridItem colSpan={3} h="64px">
          <Text pt="20px" fontWeight={400}>
            {formatDate(new Date(formInstance.createdAt))}
          </Text>
        </GridItem>
        <GridItem colSpan={4} h="64px">
          <Flex alignItems="center" pt="15px">
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
                name={
                  formInstance.originator.firstName +
                  ' ' +
                  formInstance.originator.lastName
                }
              />
            </Avatar.Root>
            <Text pl="8px">
              {formInstance.originator.firstName}{' '}
              {formInstance.originator.lastName}
            </Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={5} h="64px">
          <Flex pt="15px">
            <AssignedAvatarGroup signatures={formInstance.signatures} />

            {/* TODO: Do we need to have the enhanced popover for these avatars? */}
            {/* <AvatarGroup size="sm" max={5}>
              {formInstance.signatures
                .sort((a, b) => a.order - b.order)
                .map((signature: SignatureEntity, index: number) => {
                  return (
                    <>
                      <HoverableAvatar
                        name={getNameFromSignature(signature)}
                        signed={signature.signed}
                        index={index}
                      />
                    </>
                  );
                })}
            </AvatarGroup> */}
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
