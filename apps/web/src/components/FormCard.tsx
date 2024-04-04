import { Box, Text, Avatar, AvatarGroup, Tooltip } from '@chakra-ui/react';
import { SignatureEntity } from './../../../web/src/client';
import { useRouter } from 'next/router';

// Overview Form component for displaying forms in the dashboard
// will probably have to change the types once the backend is finished
export const FormCard = ({
  formName,
  signatures,
  link,
}: {
  formName: String;
  signatures: SignatureEntity[];
  link: string;
}) => {
  const router = useRouter();

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
        onClick={() => {
          router.push(link);
        }}
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
          {/*Dummy values until userSignedBy fixed*/}
          <AvatarGroup size="sm" max={5} marginTop="9px" spacing={'-3px'}>
            {signatures
              .sort((a, b) => a.order - b.order)
              .map((signature: SignatureEntity, index: number) => {
                return (
                  <Tooltip
                    bg={'white'}
                    color={'black'}
                    placement="bottom-start"
                    label={
                      <>
                        <Text fontSize="16px" fontWeight="bold">
                          {signature.assignedUser?.firstName +
                            ' ' +
                            signature.assignedUser?.lastName}
                        </Text>
                      </>
                    }
                    key={index}
                  >
                    <Avatar
                      name={
                        signature.assignedUser?.firstName +
                        ' ' +
                        signature.assignedUser?.lastName
                      }
                      key={index}
                      boxSize="32px"
                      backgroundColor={signature.signed ? '#D1F0D4' : '#DCDCDC'}
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
