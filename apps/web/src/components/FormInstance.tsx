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
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@web/pages/_app';
import { useAuth } from '@web/hooks/useAuth';
import {
  getNameFromSignature,
  signerIsUser,
} from '@web/utils/formInstanceUtils';

/**
 * @param formInstance - the form instance
 * @returns a form instance page with all content in a side panel
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
    mutationFn: async ({
      formInstanceId,
      signatureId,
    }: {
      formInstanceId: string;
      signatureId: string;
    }) => {
      return FormInstancesService.formInstancesControllerSignFormInstance(
        formInstanceId,
        signatureId
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

  /**
   * Update the form instance with the next signature
   */
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

  /**
   * Update the form instance to be marked as completed
   */
  const _handleFormApprove = async () => {
    if (formInstance.markedCompleted) return;
    completeFormInstanceMutation.mutateAsync(formInstance.id).catch((e) => {
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

      <Box
        position="fixed"
        top="0"
        right="0"
        height="100vh"
        width="800px"
        bg="gray.100"
        boxShadow="lg"
        padding="20px"
        overflowY="auto"
      >

        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading as="h1" ml="30px" mt={4} mr={5}>
            {formInstance.name}
          </Heading>
          <Button
            variant="link"
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
          ml="30px"
          mt={12}
        >
          Description
        </Heading>
        <Text color="#000" lineHeight="normal" ml="30px" maxW="350px">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et
          imperdiet enim. Ut enim justo, tincidunt ac enim ut, mollis pulvinar
          neque. Suspendisse id semper nunc.
        </Text>

        <Box>
          <Heading as="h2" color="#000" lineHeight="normal" ml="30px" mt={4}>
            Form Preview
          </Heading>
          <embed
            src={formInstance.formDocLink}
            type="application/pdf"
            width="350px"
            height="500px"
            style={{
              border: '3px solid black',
              borderRadius: '8px',
              marginLeft: '30px',
              marginTop: '6px',
              marginBottom: '100px',
            }}
          />
        </Box>

        <Text fontSize="lg" fontWeight="bold" mb={2} ml="30px">
          Assigned by
        </Text>
        <Flex justifyContent="space-between" alignItems="center" mb={6} ml="30px">
          <Box>
            <Text fontWeight="bold">
              {formInstance.originator.firstName} {formInstance.originator.lastName}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {formInstance.originator.id === user?.id ? 'You' : ''}
            </Text>
          </Box>
          <Text color="gray.500" fontSize="sm">
            {new Date(formInstance.createdAt).toLocaleDateString()}
          </Text>
        </Flex>

        <Text fontSize="lg" fontWeight="bold" mb={2} ml="30px">
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
      </Box>
    </Box>
  );
};

export default FormInstance;
