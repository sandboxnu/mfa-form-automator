import { Button, Flex, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import {
  formInstancesControllerCreateMutation,
  formTemplatesControllerFindAllQueryKey,
} from '@web/client/@tanstack/react-query.gen';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useAuth } from '@web/hooks/useAuth';
import { queryClient } from '@web/pages/_app';
import { useRouter } from 'next/router';

// ! MAYBE COULD REUSE OTHER COMPONENT
export const SignFormButtons = () => {
  const router = useRouter();

  const { assignedGroupData, formInstanceName, formTemplate } =
    useCreateFormInstance();
  const { user } = useAuth();

  const createFormInstanceMutation = useMutation({
    ...formInstancesControllerCreateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formTemplatesControllerFindAllQueryKey(),
      });
    },
  });
  // ! TEMPORARY
  const submitLink = '/form-instances';

  /**
   * Updates form instance with the selected form template, form name, and signature positions
   */
  const _submitSignedForm = async () => {
    if (
      !formTemplate ||
      !assignedGroupData ||
      !user ||
      assignedGroupData.length != formTemplate.fieldGroups.length
    ) {
      return;
    }

    await createFormInstanceMutation.mutateAsync({
      body: {
        name: formInstanceName ?? formTemplate.name,
        assignedGroups: assignedGroupData.map((data, _) => {
          return {
            order: data.order,
            fieldGroupId: data.fieldGroupId,
            signerType: data.signerType,
            signerEmployeeList: data.signerEmployeeList,
            signerDepartmentId: data.signerDepartmentId,
            signerPositionId: data.signerPositionId,
            signerEmployeeId: data.signerEmployeeId,
          };
        }),
        originatorId: user.id,
        formTemplateId: formTemplate.id,
        formDocLink: formTemplate.formDocLink,
        description: formTemplate.description ?? '',
      },
    });

    router.push(submitLink);
  };

  return (
    <>
      <Flex float="right" justifyContent={'space-between'}>
        <Button
          w={'164px'}
          h="36px"
          borderRadius="6px"
          alignContent={'center'}
          background={'#1367EA'}
          _hover={{
            background: 'auto',
          }}
          marginLeft="12px"
          marginRight="36px"
          onClick={() => {
            _submitSignedForm();
          }}
        >
          <Text
            color="#FCFCFC"
            fontWeight="600px"
            fontSize="18px"
            lineHeight="22px"
          >
            {'Submit Form'}
          </Text>
        </Button>
      </Flex>
    </>
  );
};
