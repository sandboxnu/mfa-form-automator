import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  Spacer,
  useToast,
  Heading,
} from '@chakra-ui/react';
import {
  LeftArrowIcon,
  PencilIcon,
  EditUnderlineIcon,
  UserProfileAvatar,
} from 'apps/web/src/static/icons';
import AssigneeMap from './AvatarMap';
import { useState } from 'react';
import { FormInstanceEntity } from '@web/client/types.gen';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@web/pages/_app';
import { useAuth } from '@web/hooks/useAuth';
import {
  getNameFromAssignedGroup,
  signerIsUser,
} from '@web/utils/formInstanceUtils';
import {
  formInstancesControllerCompleteFormInstanceMutation,
  formInstancesControllerFindAllQueryKey,
  formInstancesControllerSignFormInstanceMutation,
} from '@web/client/@tanstack/react-query.gen';

/**
 * @param formInstance - the form instance
 * @returns a form instance page
 */
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
    ...formInstancesControllerSignFormInstanceMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formInstancesControllerFindAllQueryKey(),
      });
    },
  });

  const completeFormInstanceMutation = useMutation({
    ...formInstancesControllerCompleteFormInstanceMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formInstancesControllerFindAllQueryKey(),
      });
    },
  });

  const _nextAssignedGroup = formInstance.assignedGroups
    .sort((a, b) => a.order - b.order)
    .find((v) => v.signed === false);
  const _userCanSign = signerIsUser(_nextAssignedGroup, user);

  /**
   * Update the form instance with the next assigned group
   */
  const _handleFormSign = async () => {
    if (_nextAssignedGroup == null || !_userCanSign) return;
    console.log(formInstance);
    signFormInstanceMutation
      .mutateAsync({
        path: {
          formInstanceId: formInstance.id,
          assignedGroupId: _nextAssignedGroup?.id!,
        },
        body: {
          // TODO: Update when frontend functionality is implemented
          file: new File([], 'placeholder.txt'),
        },
      })
      .catch((e) => {
        throw e;
      });
  };

  /**
   * Update the form instance to be marked as completed
   */
  const _handleFormApprove = async () => {
    if (formInstance.markedCompleted) return;
    completeFormInstanceMutation
      .mutateAsync({
        path: {
          formInstanceId: formInstance.id,
        },
      })
      .catch((e) => {
        throw e;
      });

    router.push('/');
  };

  return (
    <Box>
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
          onClick={() => {}}
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
      <Heading
        as="h2"
        color="#000"
        lineHeight="normal"
        my={4}
        ml="50px"
        mt={12}
      >
        Description
      </Heading>
      <Text color="#000" lineHeight="normal" ml="50px" maxW="450px">
        {formInstance.description}
      </Text>

      <Grid templateColumns="1fr 1fr" gap="100px" mt={20}>
        <Box>
          <Heading as="h2" color="#000" lineHeight="normal" ml="50px">
            Form Preview
          </Heading>

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
        </Box>
        <Box maxWidth="400px">
          <Box>
            <Text
              color="#000"
              fontSize="20px"
              fontWeight="700"
              lineHeight="normal"
              marginBottom="15px"
            >
              Assigned by
            </Text>
            <Flex
              alignItems="center"
              flexDirection="row"
              marginBottom="50px"
              minWidth="380px"
              justifyContent="space-between"
            >
              <Flex alignItems="center">
                <UserProfileAvatar
                  firstName={formInstance.originator.firstName}
                  lastName={formInstance.originator.lastName}
                />
                <Text
                  color="#000"
                  fontFamily="Hanken Grotesk"
                  fontSize="16px"
                  style={{ whiteSpace: 'nowrap' }}
                  fontWeight="500"
                  marginLeft="10px"
                >
                  {formInstance.originator.firstName +
                    ' ' +
                    formInstance.originator.lastName}{' '}
                  {formInstance.originator.id === user?.id && (
                    <Text
                      color="#515151"
                      fontFamily="Hanken Grotesk"
                      fontSize="16px"
                      fontWeight="500"
                      style={{ display: 'inline' }}
                    >
                      (you)
                    </Text>
                  )}
                </Text>
              </Flex>
              <Text color="#515151" fontWeight="400">
                {new Date(formInstance.createdAt).toLocaleDateString()}
              </Text>
            </Flex>

            <Box>
              <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text color="#000" fontSize="20px" fontWeight="700">
                  Assignees
                </Text>
                <Flex alignItems="center">
                  <PencilIcon color="#4C658A" mr={1} />
                  <Text
                    color="#4C658A"
                    style={{ fontSize: '18px', textDecoration: 'none' }}
                  >
                    Edit
                  </Text>
                </Flex>
              </Flex>

              <AssigneeMap
                assignees={formInstance.assignedGroups.map((assignedGroup) => ({
                  signed: assignedGroup.signed,
                  title: getNameFromAssignedGroup(assignedGroup),
                  signerType: assignedGroup.signerType as any,
                  updatedAt: assignedGroup.updatedAt,
                }))}
              />
            </Box>
          </Box>
          {_userCanSign && (
            <Button
              margin="20px"
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
              <Box>
                <Spacer />
                <Button
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
            )}
        </Box>
      </Grid>
    </Box>
  );
};

export default FormInstance;
