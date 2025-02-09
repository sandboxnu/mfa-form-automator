import { Button, Flex, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import {
  formTemplatesControllerCreateMutation,
  formTemplatesControllerFindAllQueryKey,
} from '@web/client/@tanstack/react-query.gen.ts';
import { CreateSignatureFieldDto } from '@web/client/types.gen.ts';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext.tsx';
import { queryClient } from '@web/pages/_app.tsx';
import { useRouter } from 'next/router.js';

/**
 * Delete, Back, and Save & Continue buttons at the bottom of form template creation flow.
 * @param deleteFunction the function to call when delete button is pressed
 * @param submitLink page router will push on click of 'save & continue'
 * @param backLink page router will push on click of 'back'
 * @param disabled whether the 'save & continue' button should be activated
 * @param review if review page, there is no delete/clear button and the Save & Continue becomes Create Form Template
 */
export const FormTemplateButtons = ({
  deleteFunction,
  submitLink,
  backLink,
  disabled,
  review,
}: {
  deleteFunction: Function;
  submitLink: string;
  backLink: string;
  disabled: boolean;
  review?: boolean;
}) => {
  const router = useRouter();
  const { formTemplateName, fieldGroups, useBlob } = useCreateFormTemplate();

  const { hasLocalBlob, uploadLocalBlobData } = useBlob;

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
    if (!hasLocalBlob) {
      throw new Error('No PDF file uploaded');
    }

    const signatures: CreateSignatureFieldDto[] = [];

    Array.from(fieldGroups).forEach(([key, value], index) => {
      signatures.push({
        name: `Group ${index + 1}`,
        order: index,
      });
    });

    const blob = await uploadLocalBlobData();

    createFormTemplateMutation
      .mutateAsync({
        body: {
          name: formTemplateName ? formTemplateName : '',
          formDocLink: blob.url,
          signatureFields: signatures,
        },
      })
      .then((response) => {
        return response;
      })
      .catch((e) => {
        throw e;
      });
    router.push(submitLink);
  };

  const createFormTemplateMutation = useMutation({
    ...formTemplatesControllerCreateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formTemplatesControllerFindAllQueryKey(),
      });
    },
  });

  return (
    <>
      <Button
        borderRadius="6px"
        borderWidth="1.5px"
        borderStyle={'solid'}
        borderColor="#E23F40"
        alignContent={'center'}
        bgColor={'transparent'}
        _hover={{
          bgColor: 'transparent',
        }}
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

      <Flex float="right" justifyContent={'space-between'}>
        <Button
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
          onClick={(_) => {
            _submitFormTemplate();
          }}
        >
          <Text
            color="#FCFCFC"
            fontWeight="600px"
            fontSize="18px"
            lineHeight="22px"
          >
            {review ? 'Create Form Template' : 'Save & Continue'}
          </Text>
        </Button>
      </Flex>
    </>
  );
};
