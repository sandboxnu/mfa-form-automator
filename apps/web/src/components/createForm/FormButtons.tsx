import { Button, Flex, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import {
    CreateFormTemplateDto,
    CreateSignatureFieldDto,
    FormTemplateEntity,
    formTemplatesControllerCreate,
    SignerType,
} from '@web/client';
import { formInstancesControllerCreateMutation, formTemplatesControllerFindAllQueryKey } from '@web/client/@tanstack/react-query.gen';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { queryClient } from '@web/pages/_app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Option } from '../createFormInstance/types';
import { useAuth } from '@web/hooks/useAuth';


/**
 * Delete, Back, and Save & Continue buttons at the bottom of form template creation flow.
 * @param deleteFunction the function to call when delete button is pressed
 * @param submitLink page router will push on click of 'save & continue'
 * @param backLink page router will push on click of 'back'
 * @param disabled whether the 'save & continue' button should be activated
 * @param review if review page, there is no delete/clear button and the Save & Continue becomes Create Form Template
 */
export const FormButtons = ({
    isFormTemplate,
    deleteFunction,
    submitLink,
    backLink,
    disabled,
    review,
    heading,
}: {
    isFormTemplate: boolean;
    deleteFunction: Function;
    submitLink: string;
    backLink: string;
    disabled: boolean;
    review?: boolean;
    heading: string;
}) => {
    const router = useRouter();

    const { formTemplateName, formTemplateDescription, useBlob } =
    useCreateFormTemplate();

    /**
     * Upload and create a form template
     */
    const _submitFormTemplate = async () => {

        const { hasLocalBlob, uploadLocalBlobData } = useBlob;

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
        const signatures: CreateSignatureFieldDto[] = [
            {
                name: 'Signature Field 1',
                order: 1,
            },
        ];

        const blob = await uploadLocalBlobData();

        createFormTemplateMutation
            .mutateAsync({
                name: formTemplateName ? formTemplateName : '',
                formDocLink: blob.url,
                signatureFields: signatures,
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
        mutationFn: async (newFormTemplate: CreateFormTemplateDto) => {
            return formTemplatesControllerCreate(
                {
                    body: newFormTemplate,
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['api', 'form-templates'] });
        },
    });



    const { user } = useAuth();
  const [isFormTypeDropdownOpen, setIsFormTypeDropdownOpen] = useState(false);
  const { formTemplate } = useCreateFormInstance();
  const [formTypeSelected, setFormTypeSelected] = useState(false);
  const [signaturePositions, setSignaturePositions] = useState<
    (Option | null)[]
  >([]);
  const [formName, setFormName] = useState('Create Form');
  const createFormInstanceMutation = useMutation({
    ...formInstancesControllerCreateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formTemplatesControllerFindAllQueryKey(),
      });
    },
  });

  /**
   * Reset signature positions when form template changes
   */
  useEffect(() => {
    setSignaturePositions(
      new Array(formTemplate?.signatureFields.length).fill(null),
    );
  }, [formTemplate]);

  /**
   * Updates form instance with the selected form template, form name, and signature positions
   */
  const _submitFormInstance = async () => {
    if (!formTemplate) return;

    if (!review) {
        router.push(submitLink);
        return;
    }

    await createFormInstanceMutation
      .mutateAsync({
        body: {
          name: formName,
          signatures: signaturePositions.map((pos, i) => {
            return {
              order: i,
              signerEmployeeId: pos?.employeeValue!,
              signerType: SignerType.USER,
              signerDepartmentId: null,
              signerPositionId: null,
              signerEmployeeList: [],
            };
          }),
          originatorId: user?.id!,
          formTemplateId: formTemplate?.id!,
          formDocLink: formTemplate?.formDocLink!,
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

    return (
        <>
            {!review ? (
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
                    marginRight="36px"
                    onClick={() => {
                        if (isFormTemplate) {
                            console.log("Submitting Form Template");
                            _submitFormTemplate(); 
                        } else {
                            console.log("Submitting Form Instance");
                            _submitFormInstance();
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
