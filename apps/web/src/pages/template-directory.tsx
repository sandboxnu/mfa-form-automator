import {
  Button,
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { FormTemplateEntity, Scope } from '@web/client';
import { formTemplatesControllerDisableMutation } from '@web/client/@tanstack/react-query.gen';
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
import { useState } from 'react';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';

/**
 * @returns A page for admins and contributors to see all templates and the templates they have created.
 */
function TemplateDirectory() {
  const {
    setFormTemplateName,
    setFormTemplateDescription,
    setPdfFile,
    setInEditMode,
  } = useCreateFormTemplate();
  const router = useRouter();

  const [formTemplate, setFormTemplate] = useState<FormTemplateEntity | null>(
    null,
  );
  // isOpen for the 'are you sure you want to delete' modal
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /**
   * Sets the clicked form template to be chosen, allowing the user to select other
   * features like editing and deleting for this form.  Note this does NOT prefill
   * the useCreateFormTemplate data.
   * @param id the id of the form template selected on screen
   */
  const handleSelectTemplate = async (id: string) => {
    try {
      const response = await fetch(`/api/form-templates/${id}`);
      if (!response.ok) throw new Error('Failed to find form template');

      const template: FormTemplateEntity = await response.json();
      setFormTemplate(template);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Fetches the pdf file from the link of the selected form template
   * and uses it to initialize the create form template context.
   * Used to pre-fill information before navigating to form template edit mode.
   */
  const fetchPdfFile = async () => {
    if (formTemplate?.formDocLink) {
      const response = await fetch(formTemplate.formDocLink);
      const blob = await response.blob();
      const file = new File([blob], 'document.pdf', {
        type: 'application/pdf',
      });
      setPdfFile(file);
    }
  };

  const disableFormTemplateMutation = useMutation({
    ...formTemplatesControllerDisableMutation(),
    onSuccess: () => {},
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

    await disableFormTemplateMutation
      .mutateAsync({
        path: {
          id: formTemplate.id,
        },
      })
      .catch((e) => {
        throw e;
      });
    console.log('finished');
    console.log(formTemplate);
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
    setFormTemplateName(formTemplate.name);
    setFormTemplateDescription(formTemplate.description);
    setInEditMode(true);
    fetchPdfFile().then(() => router.push('/create-template/description'));
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
              />
              <Flex
                height="38px"
                padding="8px 16px"
                justifyContent={'center'}
                alignItems="center"
                gap="8px"
                onClick={navigateToFormTemplateEditMode}
              >
                <EditIcon />
                <Text color="var(--Gray, #515151)">Edit Form</Text>
              </Flex>
              <SeparatorIcon />
              <Flex
                height="38px"
                padding="8px 16px"
                justifyContent={'center'}
                alignItems="center"
                gap="8px"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <DeleteIcon color="var(--Gray, #515151)" />
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

            <SearchAndSort
              searchQuery={''}
              setSearchQuery={function (searchQuery: string): void {
                throw new Error('Function not implemented.');
              }}
            />
          </Flex>
        )}
        <TemplateSelectGrid
          allowCreate={false}
          handleSelectTemplate={handleSelectTemplate}
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
        >
          <Text fontSize="19px">
            Not seeing the form template you&apos;re looking for?
          </Text>
          <Button
            borderRadius="6px"
            border="1px solid #1367EA"
            background="#FFF"
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
      <Modal
        isOpen={isOpen}
        onClose={() => {
          formTemplatesControllerDisableMutation;
        }}
        isCentered={true}
      >
        <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
        <ModalContent alignItems="center" justifyContent={'center'}>
          <Flex
            zIndex="1000"
            width="391px"
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
            <Text align={'center'}>
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
        </ModalContent>
      </Modal>
    </>
  );
}

export default isAuth(TemplateDirectory, [Scope.ADMIN]);
