import { Button, Flex, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { CreateFieldGroupDto, CreateTemplateBoxDto } from '@web/client';
import {
  formInstancesControllerCreateMutation,
  formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey,
  formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey,
  formInstancesControllerFindAllQueryKey,
  formTemplatesControllerCreateMutation,
  formTemplatesControllerUpdateMutation,
  formTemplatesControllerFindAllQueryKey,
} from '@web/client/@tanstack/react-query.gen';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { queryClient } from '@web/pages/_app';
import { useRouter } from 'next/router';
import { useAuth } from '@web/hooks/useAuth';
import { FormInteractionType } from './types';
import { useSignFormInstance } from '@web/hooks/useSignFormInstance';
import { Toaster, toaster } from '../ui/toaster';
import { useState } from 'react';
import { AxiosError } from 'axios';

/**
 * Delete, Back, and Save & Continue buttons at the bottom of form template creation flow.
 * @param submitLink page router will push on click of 'save & continue'
 * @param backLink page router will push on click of 'back'
 * @param disabled whether the 'save & continue' button should be activated
 * @param review if review page, there is no delete/clear button and the Save & Continue becomes Create Form Template
 */
export const FormButtons = ({
  type,
  submitLink,
  backLink,
  disabled,
  review = false,
  heading,
}: {
  type: FormInteractionType;
  submitLink: string;
  backLink: string;
  disabled: boolean;
  review?: boolean;
  heading: string;
}) => {
  const router = useRouter();

  const {
    formTemplateUseId,
    formTemplateName,
    formTemplateDescription,
    pdfFile,
    fieldGroups: fieldGroupsContext,
    formFields: formFieldsContext,
    formDimensions,
  } = useCreateFormTemplate();
  const {
    assignedGroupData,
    formInstanceName,
    formTemplate,
    formInstanceDescription,
    formInstanceUseId,
  } = useCreateFormInstance();
  const [createFormLoading, setCreateFormLoading] = useState(false);
  const { nextSignFormPage, signFormInstanceLoading } = useSignFormInstance();

  const { user } = useAuth();

  const createFormTemplateMutation = useMutation({
    ...formTemplatesControllerCreateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formTemplatesControllerFindAllQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey:
          formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey:
          formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey(),
      });
    },
  });

  const createFormInstanceMutation = useMutation({
    ...formInstancesControllerCreateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formInstancesControllerFindAllQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey:
          formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey:
          formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey(),
      });
    },
  });

  const updateFormTemplateMutation = useMutation({
    ...formTemplatesControllerUpdateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formTemplatesControllerFindAllQueryKey(),
      });
    },
  });

  /**
   * Upload and create a form template
   */
  const _submitFormTemplate = async () => {
    if (disabled || createFormLoading) {
      return;
    }
    if (!review) {
      router.push(submitLink);
      return;
    }
    if (!pdfFile) {
      throw new Error('No PDF file uploaded');
    }

    setCreateFormLoading(true);

    let fieldGroups: CreateFieldGroupDto[] = [];
    let orderVal = 0;

    // populate fieldGroups with fieldGroupsContext
    fieldGroupsContext.forEach((value, groupId) => {
      let templateBoxes: CreateTemplateBoxDto[] = [];

      // populate templateBoxes with formFieldsContext
      for (const page in formFieldsContext) {
        const fieldGroupsOnPage = formFieldsContext[page];
        fieldGroupsOnPage.forEach((field, _) => {
          if (field.groupId !== groupId) {
            return;
          }

          templateBoxes.push({
            type: field.type,
            x_coordinate: field.position.x,
            y_coordinate: field.position.y,
            width: field.position.width,
            height: field.position.height,
            page: parseInt(page),
          });
        });
      }
      fieldGroups.push({
        name: value.groupName,
        order: orderVal,
        templateBoxes: templateBoxes,
      });

      orderVal += 1;
    });
    if (formDimensions && type == FormInteractionType.CreateFormTemplate)
      await createFormTemplateMutation
        .mutateAsync({
          body: {
            pageHeight: formDimensions.height,
            pageWidth: formDimensions.width,
            name: formTemplateName ?? '',
            fieldGroups: fieldGroups,
            file: pdfFile,
            description: formTemplateDescription ?? '',
            disabled: false,
          },
        })
        .then(async (response) => {
          await queryClient.invalidateQueries({
            queryKey: formTemplatesControllerFindAllQueryKey(),
          });
          router.push(submitLink).then(() => {
            setCreateFormLoading(false);
          });
          return response;
        })
        .catch((e) => {
          setCreateFormLoading(false);
          if (e instanceof AxiosError) {
            toaster.create({
              title: 'Failed to create form template',
              description: e.response?.data.message ?? e.message,
              type: 'error',
              duration: 3000,
            });
          } else {
            toaster.create({
              title: 'Failed to create form template',
              description: (e as Error).message,
              type: 'error',
              duration: 3000,
            });

            setCreateFormLoading(false);
          }
        });
    else if (type == FormInteractionType.EditFormTemplate) {
      await updateFormTemplateMutation
        .mutateAsync({
          body: {
            name: formTemplateName ?? '',
            description: formTemplateDescription ?? '',
            disabled: false,
          },
          path: {
            id: formTemplateUseId!!,
          },
        })
        .then(async (response) => {
          await queryClient.invalidateQueries({
            queryKey: formTemplatesControllerFindAllQueryKey(),
          });
          router.push(submitLink).then(() => {
            setCreateFormLoading(false);
          });
          return response;
        })
        .catch((e) => {
          setCreateFormLoading(false);
          if (e instanceof AxiosError) {
            toaster.create({
              title: 'Failed to edit form template',
              description: e.response?.data.message ?? e.message,
              type: 'error',
              duration: 3000,
            });
          } else {
            toaster.create({
              title: 'Failed to edit form template',
              description: (e as Error).message,
              type: 'error',
              duration: 3000,
            });
          }
        });
    }

    // always set loading to false
    setCreateFormLoading(false);
  };

  /**
   * Updates form instance with the selected form template, form name, and signature positions
   */
  const _submitFormInstance = async () => {
    if (!review) {
      router.push(submitLink);
      return;
    }

    if (
      !formTemplate ||
      !assignedGroupData ||
      disabled ||
      !user ||
      assignedGroupData.length != formTemplate.fieldGroups.length ||
      createFormLoading
    ) {
      return;
    }

    setCreateFormLoading(true);

    if (type == FormInteractionType.CreateFormInstance) {
      await createFormInstanceMutation
        .mutateAsync({
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
            description: formInstanceDescription ?? formTemplate.description!!,
          },
        })
        .then(async (response) => {
          await queryClient.invalidateQueries({
            queryKey: formInstancesControllerFindAllQueryKey(),
          });
          await queryClient.invalidateQueries({
            queryKey:
              formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey(),
          });
          await queryClient.invalidateQueries({
            queryKey:
              formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey(),
          });
          router.push(submitLink).then(() => {
            setCreateFormLoading(false);
          });
          return response;
        })
        .catch((e) => {
          setCreateFormLoading(false);
          if (e instanceof AxiosError) {
            toaster.create({
              title: 'Failed to create form instance',
              description: e.response?.data.message ?? e.message,
              type: 'error',
              duration: 3000,
            });
          } else {
            toaster.create({
              title: 'Failed to create form instance',
              description: (e as Error).message,
              type: 'error',
              duration: 3000,
            });
          }
        });
    } else {
      // form instance edit mode -> submit changes
    }
  };

  return (
    <>
      <Flex float="right" justifyContent={'space-between'}>
        <Toaster />
        <Button
          w="74px"
          h="36px"
          borderRadius="6px"
          borderWidth="1.5px"
          borderStyle={'solid'}
          borderColor="#1367EA"
          alignContent={'center'}
          bgColor={'transparent'}
          _hover={{
            bgColor: 'transparent',
          }}
          onClick={() => {
            router.push(backLink);
          }}
        >
          <Text
            color="#1367EA"
            fontWeight="600px"
            fontSize="18px"
            lineHeight="22px"
          >
            Back
          </Text>
        </Button>
        <Button
          w={review ? '209px' : '164px'}
          h="36px"
          borderRadius="6px"
          alignContent={'center'}
          background={
            disabled
              ? 'linear-gradient(0deg, rgba(223, 223, 223, 0.50) 0%, rgba(223, 223, 223, 0.50) 100%), #1367EA;'
              : '#1367EA'
          }
          _hover={{
            background: 'auto',
          }}
          marginLeft="12px"
          marginRight="36px"
          disabled={disabled || signFormInstanceLoading || createFormLoading}
          loading={signFormInstanceLoading || createFormLoading}
          onClick={() => {
            switch (type) {
              case FormInteractionType.CreateFormTemplate:
                _submitFormTemplate();
                break;
              case FormInteractionType.CreateFormInstance:
                _submitFormInstance();
                break;
              case FormInteractionType.EditFormInstance:
                _submitFormInstance();
                break;
              case FormInteractionType.EditFormTemplate:
                _submitFormTemplate();
                break;
              case FormInteractionType.SignFormInstance:
                nextSignFormPage(submitLink, review);
                break;
              default:
                throw new Error('Invalid form interaction type');
            }
          }}
        >
          <Text
            color="#FCFCFC"
            fontWeight="600px"
            fontSize="18px"
            lineHeight="22px"
          >
            {review ? heading : 'Save & Continue'}
          </Text>
        </Button>
      </Flex>
    </>
  );
};
