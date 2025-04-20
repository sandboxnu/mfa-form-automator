import {
  Button,
  Dialog,
  DialogPositioner,
  Flex,
  Portal,
  Text,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FieldGroupBaseEntity, FormTemplateEntity, Scope } from '@web/client';
import {
  formTemplatesControllerFindAllOptions,
  formTemplatesControllerFindAllQueryKey,
  formTemplatesControllerUpdateMutation,
} from '@web/client/@tanstack/react-query.gen';
import { SearchAndSort } from '@web/components/SearchAndSort';
import { TemplateSelectGrid } from '@web/components/createFormInstance/FormTemplateGrid';
import isAuth from '@web/components/isAuth';
import {
  CloseIcon,
  DeleteIcon,
  EditIcon,
  SeparatorIcon,
} from '@web/static/icons';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { queryClient } from './_app';
import {
  Field,
  FieldGroupColor,
  FieldGroups,
  fieldId,
  FieldType,
  FormFields,
  groupId,
} from '@web/components/createFormTemplate/types';
import { distance } from 'fastest-levenshtein';
import { groupColors } from '@web/utils/formTemplateUtils';
import { fetchPdfFile } from '@web/utils/formInstanceUtils';

/**
 * @returns A page for admins and contributors to see all templates and the templates they have created.
 */
function TemplateDirectory() {
  const {
    setFormTemplateName,
    setFormTemplateDescription,
    setPdfFile,
    setFormTemplateUseId,
    setFieldGroups,
    setFormFields,
    setFormDimensions,
  } = useCreateFormTemplate();
  const router = useRouter();

  const [formTemplate, setFormTemplate] = useState<FormTemplateEntity | null>(
    null,
  );
  // isOpen for the 'are you sure you want to delete' modal
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedFormTemplates, setSortedFormTemplates] = useState<
    FormTemplateEntity[]
  >([]);
  const { data: formTemplates } = useQuery(
    formTemplatesControllerFindAllOptions(),
  );

  useEffect(() => {
    if (!formTemplates) return;
    setSortedFormTemplates(
      formTemplates
        ?.map((template) => ({
          ...template,
          levenshteinDistance: distance(
            searchQuery.toLowerCase().slice(0, 10),
            template.name.toLowerCase().slice(0, 10),
          ),
        }))
        .sort((a, b) => a.levenshteinDistance - b.levenshteinDistance),
    );
  }, [searchQuery, formTemplates]);

  const disableFormTemplateMutation = useMutation({
    ...formTemplatesControllerUpdateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formTemplatesControllerFindAllQueryKey(),
      });
    },
  });

  /**
   * Marks the form template as "disabled" so it will appear as deleted to
   * users.  This action will not affect existing form instances.  This
   * action cannot be undone from the site, but the template will remain
   * in the database.
   */
  const submitRemove = async () => {
    if (!formTemplate) {
      return;
    }
    await fetchPdfFile(setPdfFile, formTemplate.formDocLink);

    await disableFormTemplateMutation
      .mutateAsync({
        body: {
          disabled: true,
        },
        path: {
          id: formTemplate.id,
        },
      })
      .catch((e) => {
        throw e;
      });

    setIsOpen(false);
    setFormTemplate(null);
  };

  /**
   * Called on selection of editing a form template.  Prefills useCreateFormTemplate
   * data and navigates to create template flow in edit mode.
   */
  function navigateToFormTemplateEditMode() {
    if (!formTemplate) {
      return;
    }
    // TRANSLATOR FROM BACKEND TYPE GROUPS TO FRONTEND TYPE GROUPS
    // old groups for the backend type
    const oldGroups: FieldGroupBaseEntity[] = formTemplate.fieldGroups;
    // new groups for the frontend type
    let newGroups: Map<groupId, FieldGroupColor> = new Map<
      groupId,
      FieldGroupColor
    >();
    let newFields: Record<number, Map<fieldId, Field>> = {};

    let groupNum: number = 0;
    for (let oldGroup of oldGroups) {
      newGroups.set(oldGroup.id, {
        background: groupColors[groupNum][1],
        border: groupColors[groupNum][0],
        groupName: oldGroup.name,
      });
      groupNum += 1;

      let count = 0;
      let newFieldMap = new Map<fieldId, Field>();
      for (let oldField of oldGroup.templateBoxes) {
        let newType;
        if (oldGroup.id == 'SIGNATURE') {
          newType = FieldType.SIGNATURE;
        } else if (oldGroup.id == 'CHECK BOX') {
          newType = FieldType.CHECKBOX;
        } else {
          newType = FieldType.TEXT_FIELD;
        }

        newFieldMap.set(oldField.id, {
          position: {
            x: oldField.x_coordinate,
            y: oldField.y_coordinate,
            width: oldField.width,
            height: oldField.height,
          },
          groupId: oldGroup.id,
          type: newType,
        });
        newFields[count] = newFieldMap;
      }
    }

    setFormTemplateName(formTemplate.name);
    setFormTemplateDescription(formTemplate.description);
    setFormTemplateUseId(formTemplate.id);
    let castNewGroups: FieldGroups = newGroups;
    setFieldGroups(castNewGroups);
    let castNewFields: FormFields = newFields;
    setFormFields(castNewFields);
    setFormDimensions({
      width: formTemplate.pageWidth,
      height: formTemplate.pageHeight,
    });
    fetchPdfFile(setPdfFile, formTemplate.formDocLink).then(() =>
      router.push('/create-template/description'),
    );
  }

  return (
    <>
      <Flex
        height="100%"
        marginTop="36px"
        marginX={'40px'}
        gap="32px"
        flexDirection={'column'}
      >
        <Text fontSize="30px" fontWeight="700" lineHeight="38px">
          Templates
        </Text>
        {formTemplate ? (
          <Flex
            padding="4px 0px 4px 8px"
            justifyContent={'space-between'}
            alignItems={'center'}
            borderRadius="2px"
            background="#EAEEF1"
          >
            <Flex padding="0px 8px" alignItems="center" gap="8px">
              <CloseIcon
                width="16px"
                height="16px"
                onClick={() => {
                  setFormTemplate(null);
                }}
                cursor="pointer"
              />
              <Flex
                height="38px"
                padding="8px 16px"
                justifyContent={'center'}
                alignItems="center"
                gap="8px"
                onClick={navigateToFormTemplateEditMode}
                cursor={'pointer'}
              >
                <EditIcon mb="4px" />
                <Text color="var(--Gray, #515151)">Edit Form</Text>
              </Flex>
              <SeparatorIcon width="2px" height="22px" />
              <Flex
                height="38px"
                padding="8px 16px"
                justifyContent={'center'}
                alignItems="center"
                gap="8px"
                onClick={() => {
                  setIsOpen(true);
                }}
                cursor={'pointer'}
              >
                <DeleteIcon mt="6px" ml="4px" color="var(--Gray, #515151)" />
                <Text color="var(--Gray, #515151)">Delete</Text>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Flex
            flexDirection="row"
            height="46px"
            justifyContent="space-between"
            alignItems={'center'}
            alignSelf={'stretch'}
          >
            <Flex gap="8px">
              <Button
                borderRadius="28px"
                background={'var(--Blue, #1367EA)'}
                padding="4px 12px"
                display={'inline-flex'}
                height="28px"
                _hover={{
                  bgColor: 'var(--Blue, #1367EA)',
                }}
              >
                <Text color="#FFF" fontSize={'17px'} fontWeight={'500'}>
                  All Templates
                </Text>
              </Button>
            </Flex>
            {formTemplates ? (
              <SearchAndSort
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortedForms={formTemplates!!}
                setSortedForms={setSortedFormTemplates}
              />
            ) : (
              <></>
            )}
          </Flex>
        )}
        <TemplateSelectGrid
          formTemplates={sortedFormTemplates!!}
          allowCreate={false}
          handleSelectTemplate={(template: FormTemplateEntity) =>
            setFormTemplate(template)
          }
          selectedFormTemplate={formTemplate}
        />

        <Flex
          padding="20px"
          justifyContent="space-between"
          alignItems="center"
          height="76px"
          alignSelf={'stretch'}
          backgroundColor="#FFF"
          borderColor="1px solid #E5E5E5"
          borderRadius={'8px'}
          marginBottom={'10px'}
        >
          <Text fontSize="19px">
            Not seeing the form template you&apos;re looking for?
          </Text>
          <Button
            borderRadius="6px"
            border="1px solid #1367EA"
            background="#FFF"
            padding="7px"
          >
            <Text
              fontFamily="Hanken Grotesk"
              color="#1367EA"
              fontSize="17px"
              fontWeight={'500px'}
              lineHeight={'20px'}
              onClick={() => {
                router.push('create-template/upload');
              }}
            >
              Create Form Template
            </Text>
          </Button>
        </Flex>
      </Flex>
      <Dialog.Root open={isOpen} placement={'center'} size="sm">
        <Portal>
          <Dialog.Backdrop bg="rgba(0, 0, 0, 0.5)" />
          <DialogPositioner>
            <Dialog.Content alignItems="center" justifyContent={'center'}>
              <Flex
                zIndex="1000"
                padding="24px 32px"
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems="center"
                gap="24px"
                background="#FFF"
                borderRadius={'5px'}
              >
                <Flex fontSize="19px" fontWeight="700">
                  Delete Template?
                </Flex>
                <Text textAlign={'center'}>
                  Are you sure you want to remove{' '}
                  <em>
                    <strong>{formTemplate?.name} </strong>
                  </em>
                  from the template directory permanently?
                </Text>
                <Flex
                  justifyContent={'center'}
                  alignItems={'center'}
                  gap="40px"
                  height="29px"
                >
                  <Button
                    padding="4px 10px"
                    background="transparent"
                    _hover={{
                      bgColor: 'transparent',
                    }}
                    border="1px solid var(--Blue, #1367EA)"
                    borderRadius="5px"
                    color="#1367EA"
                    width="100px"
                    height="29px"
                    fontWeight={'normal'}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    padding="4px 10px"
                    background={' var(--MFA-Red, #ED2324)'}
                    borderRadius="5px"
                    _hover={{
                      bgColor: ' var(--MFA-Red, #ED2324)',
                    }}
                    color="white"
                    width="100px"
                    height="29px"
                    onClick={() => submitRemove()}
                  >
                    Remove
                  </Button>
                </Flex>
              </Flex>
            </Dialog.Content>
          </DialogPositioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default isAuth(TemplateDirectory, [Scope.ADMIN]);
