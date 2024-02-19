import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  Skeleton,
  Spacer,
  useToast,
  Heading,
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

  function isValidURL(formDocLink: string) {
    var urlPattern = /^(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ;,./?%&=]*)?$/;
    return urlPattern.test(formDocLink);
  }

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
          fill="var(--mfa-blue-hex)"
          _groupHover={{ fill: 'var(--chakra-colors-gray-500)' }}
        />
        <Text
          color="var(--mfa-blue-hex)"
          _groupHover={{ color: 'var(--chakra-colors-gray-500)' }}
        >
          Back
        </Text>
      </Flex>
      <Flex align="center" pl={4} mt={4}>
        <Heading as="h1" ml="30px" mt={4} mr={5}>
          {formInstance.name}
        </Heading>
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
        fontSize="20px"
        fontWeight="700"
        lineHeight="normal"
        my={4}
        ml="50px"
        mt={12}
      >
        Description
      </Text>
      <Text
        color="#000"
        fontSize="16px"
        lineHeight="normal"
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
            fontSize="20px"
            fontWeight="700"
            lineHeight="normal"
            ml="50px"
          >
            Form Preview
          </Text>

          {formInstance.formDocLink && isValidURL(formInstance.formDocLink) && (
            <embed
              src={formInstance.formDocLink}
              type="application/pdf"
              width="400px"
              height="500px"
              style={{
                border: '3px solid black',
                borderRadius: '8px',
                marginLeft: '50px',
                marginTop: '6px',
                marginBottom: '100px',
                minWidth: '436.353px',
                minHeight: '566.219px',
              }}
            />
          )}
        </Box>

        <Box
          display="flex"
          flexDirection={'column'}
          justifyContent={'flex-start'}
          maxWidth="370px"
        >
          <Text
            color="#000"
            fontSize="20px"
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
              background={
                formInstance.markedCompleted
                  ? 'var(--mfa-gray-hex)'
                  : 'var(--mfa-blue-hex)'
              }
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
                      formInstance.markedCompleted
                        ? 'var(--mfa-gray-hex)'
                        : 'var(--mfa-blue-hex)'
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
