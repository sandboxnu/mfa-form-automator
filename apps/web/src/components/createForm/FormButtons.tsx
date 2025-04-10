import { Button, Flex, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { CreateFieldGroupDto, CreateTemplateBoxDto } from '@web/client';
import {
  formInstancesControllerCreateMutation,
  formInstancesControllerFindAllQueryKey,
  formInstancesControllerSignFormInstanceMutation,
  formTemplatesControllerCreateMutation,
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

/**
 * Delete, Back, and Save & Continue buttons at the bottom of form template creation flow.
 * @param deleteFunction the function to call when delete button is pressed
 * @param submitLink page router will push on click of 'save & continue'
 * @param backLink page router will push on click of 'back'
 * @param disabled whether the 'save & continue' button should be activated
 * @param review if review page, there is no delete/clear button and the Save & Continue becomes Create Form Template
 */
export const FormButtons = ({
  type,
  deleteFunction,
  submitLink,
  backLink,
  disabled,
  review = false,
  heading,
}: {
  type: FormInteractionType;
  deleteFunction: Function;
  submitLink: string;
  backLink: string;
  disabled: boolean;
  review?: boolean;
  heading: string;
}) => {
  const router = useRouter();

  const {
    formTemplateName,
    formTemplateDescription,
    pdfFile,
    fieldGroups: fieldGroupsContext,
    formFields: formFieldsContext,
    formDimensions,
  } = useCreateFormTemplate();
  const { assignedGroupData, formInstanceName, formTemplate } =
    useCreateFormInstance();

  const { nextSignFormPage } = useSignFormInstance();

  const { user } = useAuth();

  const createFormTemplateMutation = useMutation({
    ...formTemplatesControllerCreateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formTemplatesControllerFindAllQueryKey(),
      });
    },
  });

  const createFormInstanceMutation = useMutation({
    ...formInstancesControllerCreateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formInstancesControllerFindAllQueryKey(),
      });
    },
  });

  /**
   * Upload and create a form template
   */
  const _submitFormTemplate = async () => {
    if (disabled == true) {
      return;
    }
    if (!review) {
      router.push(submitLink);
      return;
    }
    if (!pdfFile) {
      throw new Error('No PDF file uploaded');
    }

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
    if (formDimensions)
      await createFormTemplateMutation
        .mutateAsync({
          body: {
            pageHeight: formDimensions.height,
            pageWidth: formDimensions.width,
            name: formTemplateName ?? '',
            fieldGroups: fieldGroups,
            file: pdfFile,
            description: formTemplateDescription ?? '',
          },
        })
        .then((response) => {
          router.push(submitLink);
          return response;
        })
        .catch((e) => {
          toaster.create({
            title: 'Failed to create form template',
            description: (e as Error).message,
            type: 'error',
            duration: 3000,
          });
          throw e;
        });
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
      assignedGroupData.length != formTemplate.fieldGroups.length
    ) {
      return;
    }

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
          description: formTemplate.description ?? '',
        },
      })
      .then((response) => {
        router.push(submitLink);
        return response;
      })
      .catch((e) => {
        toaster.create({
          title: 'Failed to create form instance',
          description: (e as Error).message,
          type: 'error',
          duration: 3000,
        });
        throw e;
      });
  };

  return (
    <>
      {!review ? (
        <Button
          w="86px"
          h="36px"
          borderRadius="6px"
          borderWidth="1.5px"
          borderStyle={'solid'}
          borderColor="#E23F40"
          alignContent={'center'}
          bgColor={'transparent'}
          _hover={{
            bgColor: 'transparent',
          }}
          marginLeft="36px"
        >
          <Text
            color="#E23F40"
            fontWeight="600px"
            fontSize="18px"
            lineHeight="22px"
            onClick={(e) => deleteFunction(e)}
          >
            Delete
          </Text>
        </Button>
      ) : (
        <></>
      )}

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
          disabled={disabled}
          onClick={() => {
            switch (type) {
              case FormInteractionType.CreateFormTemplate:
                _submitFormTemplate();
                break;
              case FormInteractionType.CreateFormInstance:
                _submitFormInstance();
                break;
              default:
                nextSignFormPage(submitLink, review);
                break;
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
