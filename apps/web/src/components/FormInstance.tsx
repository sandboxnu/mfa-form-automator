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
import { FormInstanceEntity, FormInstancesService } from '@web/client';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@web/pages/_app';
import { useAuth } from '@web/hooks/useAuth';
import {
  getNameFromSignature,
  signerIsUser,
} from '@web/utils/formInstanceUtils';

/**
 * @param formInstance - the form instance
 * @param onClose - function to close the drawer
 * @returns a form instance side panel content
 */
const FormInstance = ({
  formInstance,
  onClose,
}: {
  formInstance: FormInstanceEntity;
  onClose: () => void; //closes the drawer side panel thing
}) => {
  const [isHovered, setIsHovered] = useState(false);
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
    <Box>
      {/* Back button to close the drawer */}
      <Flex
        ml="50px"
        as="button"
        align="center"
        cursor="pointer"
        mt={10}
        data-group
        onClick={onClose}
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
      </Flex>
      <Grid templateColumns="1fr 1fr" gap="100px" mt={20}>
        {/* Form Preview and Assignees */}
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
          <Text fontSize="20px" fontWeight="700" mb={4}>
            Assignees
          </Text>
          <AssigneeMap
            assignees={formInstance.signatures.map((signature) => ({
              signed: signature.signed,
              title: getNameFromSignature(signature),
              signerType: signature.signerType as any,
              updatedAt: signature.updatedAt,
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
              mt={4}
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
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default FormInstance;
