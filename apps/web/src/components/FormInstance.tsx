import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  Skeleton,
  Spacer,
  useToast,
} from '@chakra-ui/react';
import {
  LeftArrowIcon,
  PencilIcon,
  EditUnderlineIcon,
} from 'apps/web/src/static/icons';
import AssigneeMap from './AvatarMap';
import { useState } from 'react';
import { FormInstanceEntity, FormInstancesService } from '@web/client';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@web/pages/_app';
import { useAuth } from '@web/hooks/useAuth';

const FormInstance = ({
  formInstance,
}: {
  formInstance: FormInstanceEntity;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();

  const signFormInstanceMutation = useMutation({
    mutationFn: async ({
      formInstanceId,
      signatureId,
    }: {
      formInstanceId: string;
      signatureId: string;
    }) => {
      return FormInstancesService.formInstancesControllerSignFormInstance(
        formInstanceId,
        signatureId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['api', 'form-instances'],
      });
    },
  });

  const completeFormInstanceMutation = useMutation({
    mutationFn:
      FormInstancesService.formInstancesControllerCompleteFormInstance,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['api', 'form-instances'],
      });
    },
  });

  const _nextSignature = formInstance.signatures
    .sort((a, b) => a.order - b.order)
    .find((v) => v.userSignedById == null);
  const _userCanSign = _nextSignature?.signerPositionId == user?.positionId;

  console.log('form id', formInstance.originator);

  const _handleFormSign = async () => {
    if (_nextSignature == null || !_userCanSign) return;
    signFormInstanceMutation
      .mutateAsync({
        formInstanceId: formInstance.id,
        signatureId: _nextSignature?.id!,
      })
      .catch((e) => {
        throw e;
      });
  };
  const _handleFormApprove = async () => {
    if (formInstance.markedCompleted) return;
    completeFormInstanceMutation.mutateAsync(formInstance.id).catch((e) => {
      throw e;
    });

    router.push('/');
  };

  return (
    <Box className="main">
      <Flex
        ml="50px"
        as="button"
        align="center"
        cursor="pointer"
        mt={10}
        data-group
        onClick={router.back}
      >
        <LeftArrowIcon
          boxSize={3}
          mr={2}
          fill="#4C658A"
          _groupHover={{ fill: 'var(--chakra-colors-gray-500)' }}
        />
        <Text
          color="#4C658A"
          _groupHover={{ color: 'var(--chakra-colors-gray-500)' }}
        >
          Back
        </Text>
      </Flex>
      <Flex align="center" pl={4} mt={4}>
        <Text
          color="#000"
          fontFamily="Hanken Grotesk"
          fontSize="27px"
          fontStyle="normal"
          fontWeight="800"
          lineHeight="normal"
          ml="30px"
          mt={4}
          mr={5}
        >
          {formInstance.name}
        </Text>
        <Button
          variant="link"
          onClick={() => {
            // handle edit action here
          }}
          color="black"
          fontWeight="normal"
          textAlign="left"
          _hover={{ textDecoration: 'none' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Flex flexDirection="column">
            <Flex>
              <PencilIcon mr={1} mt={6} />
              <Text
                color="#000"
                style={{ fontSize: '18px', textDecoration: 'none' }}
                mt={5}
              >
                Edit
              </Text>
            </Flex>
            {isHovered && (
              <EditUnderlineIcon
                stroke="black"
                width="52px"
                height="2"
                fill="none"
              />
            )}
          </Flex>
        </Button>
      </Flex>
      <Text
        color="#000"
        fontFamily="Hanken Grotesk"
        fontSize="20px"
        fontStyle="normal"
        fontWeight="700"
        lineHeight="normal"
        textAlign="left"
        my={4}
        ml="50px"
        mt={12}
      >
        Description
      </Text>
      <Text
        color="#000"
        fontFamily="Hanken Grotesk"
        fontSize="16px"
        fontStyle="normal"
        fontWeight="normal"
        lineHeight="normal"
        textAlign="left"
        ml="50px"
        maxW="450px"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et
        imperdiet enim. Ut enim justo, tincidunt ac enim ut, mollis pulvinar
        neque. Suspendisse id semper nunc.
      </Text>

      <Grid templateColumns="1fr 1fr" gap="100px" mt={20}>
        <Box>
          <Text
            color="#000"
            fontFamily="Hanken Grotesk"
            fontSize="20px"
            fontStyle="normal"
            fontWeight="700"
            lineHeight="normal"
            ml="50px"
          >
            Form Preview
          </Text>
          <Skeleton
            ml="50px"
            mt={6}
            mb="100px"
            bg="#000"
            minWidth="436.353px"
            minHeight="566.219px"
          />
        </Box>

        <Box
          display="flex"
          flexDirection={'column'}
          justifyContent={'flex-start'}
          maxWidth="370px"
        >
          <Text
            color="#000"
            fontFamily="Hanken Grotesk"
            fontSize="20px"
            fontStyle="normal"
            fontWeight="700"
            lineHeight="normal"
          >
            Assignees
          </Text>
          <AssigneeMap
            assignees={formInstance.signatures.map((signature) => ({
              name: signature.userSignedBy
                ? signature.userSignedBy?.firstName +
                  ' ' +
                  signature.userSignedBy?.lastName
                : undefined,
              signed: signature.userSignedById ? true : false,
              title: signature.signerPosition.name,
            }))}
          />
          {_userCanSign && (
            <Button
              background={formInstance.markedCompleted ? '#e2e8f0' : '#4C658A'}
              color="#FFF"
              onClick={async (_) => {
                toast.promise(_handleFormSign(), {
                  success: {
                    title: 'Success',
                    description: 'Form signed',
                  },
                  error: {
                    title: 'Error',
                    description: 'Unable to sign form',
                  },
                  loading: {
                    title: 'Pending',
                    description: 'Please wait',
                  },
                });
              }}
            >
              Sign Form
            </Button>
          )}
          {formInstance.completed &&
            user?.id === formInstance.originator.id && (
              <Flex>
                <Spacer />
                <Box pl="350px">
                  <Button
                    borderRadius="8px"
                    width="111px"
                    height="40px"
                    onClick={async (_) => {
                      toast.promise(_handleFormApprove(), {
                        success: {
                          title: 'Success',
                          description: 'Form approved',
                        },
                        error: {
                          title: 'Error',
                          description: 'Unable to approve form',
                        },
                        loading: {
                          title: 'Pending',
                          description: 'Please wait',
                        },
                      });
                    }}
                    background={
                      formInstance.markedCompleted ? '#e2e8f0' : '#4C658A'
                    }
                    color="#FFF"
                    cursor={
                      formInstance.markedCompleted ? 'not-allowed' : 'pointer'
                    }
                  >
                    Approve
                  </Button>
                </Box>
              </Flex>
            )}
        </Box>
      </Grid>
    </Box>
  );
};

export default FormInstance;
