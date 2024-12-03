import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { 
  UserProfileAvatar,
  x as CloseIcon
} from 'apps/web/src/static/icons';
import AssigneeMap from './AvatarMap';
import { FormInstanceEntity, FormInstancesService } from '@web/client';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@web/pages/_app';
import { useAuth } from '@web/hooks/useAuth';
import { getNameFromSignature, signerIsUser } from '@web/utils/formInstanceUtils';

const FormInstance = ({
  formInstance,
  onClose,
}: {
  formInstance: FormInstanceEntity;
  onClose: () => void;
}) => {
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
    .find((v) => v.signed === false);
  const _userCanSign = signerIsUser(_nextSignature!, user!);

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

    onClose();
  };

  return (
    <Box p={8} bg="#F8F9FA" borderRadius="16px">
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" fontSize="24px">
          {formInstance.name}
        </Heading>
        <Button variant="ghost" onClick={onClose}
        h="16px"
        w="16px">
        {<CloseIcon />}
        </Button>
      </Flex>

      <Grid templateColumns="1fr 1fr" gap="40px">
        {/* Left Column */}
        <Box
          border="1px solid #D4D4D4"
          borderRadius="16px"
          overflow="hidden"
          p={4}
          bg="white"
        >
          <embed
            src={formInstance.formDocLink}
            type="application/pdf"
            width="100%"
            height="726px"
            style={{
              borderRadius: '8px',
            }}
          />
        </Box>

        {/* Right Column */}
        <Box
          
        >
          <Box mb={6}>
            <Heading as="h3" fontSize="18px" mb="24px">
              Description
            </Heading>
            <Text color="#222324" fontSize="16px">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>
          </Box>

          <Box mb={6}>
            <Heading as="h3" fontSize="16px" mb="12px">
              Assigned by
            </Heading>
            <Flex alignItems="center">
              <UserProfileAvatar
                firstName={formInstance.originator.firstName}
                lastName={formInstance.originator.lastName}
              />
              <Text ml={2} color="#0C0C0C">
                {formInstance.originator.firstName +
                  ' ' +
                  formInstance.originator.lastName}{' '}
                {formInstance.originator.id === user?.id && (
                  <Text as="span" color="#515151">
                    (you)
                  </Text>
                )}
              </Text>
            </Flex>
          </Box>

          <Box>
            <Heading as="h3" fontSize="16px" mb="12x">
              Assignees
            </Heading>
            <AssigneeMap
              assignees={formInstance.signatures.map((signature) => ({
                signed: signature.signed,
                title: getNameFromSignature(signature),
                signerType: signature.signerType as any,
                updatedAt: signature.updatedAt,
              }))}
            />
          </Box>
        </Box>
      </Grid>

      {_userCanSign && (
        <Flex justifyContent="flex-end" mt={4}>
          <Button
            background={
              formInstance.markedCompleted
                ? 'var(--mfa-gray-hex)'
                : 'var(--mfa-blue-hex)'
            }
            color="white"
            onClick={async () => {
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
        </Flex>
      )}
    </Box>
  );
};

export default FormInstance;
