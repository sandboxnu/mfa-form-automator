import {
  background,
  Box,
  Button,
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { FormTemplateEntity, formTemplatesControllerRemove, Scope } from '@web/client';
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

/**
 * @returns A page for admins and contributors to see all templates and the templates they have created.
 */
function TemplateDirectory() {
  const router = useRouter();
  const [formTemplate, setFormTemplate] = useState<FormTemplateEntity | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelectTemplate = async (id: string) => {
    try {
      const response = await fetch(`/api/form-templates/${id}`);
      if (!response.ok) throw new Error('Failed to find form template');

      const template: FormTemplateEntity = await response.json();
      setFormTemplate(template);
      console.log('success');
    } catch (error) {
      console.error(error);
    }
  };
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
              <CloseIcon width="16px" height="16px" />
              <Flex
                height="38px"
                padding="8px 16px"
                justifyContent={'center'}
                alignItems="center"
                gap="8px"
              >
                <EditIcon />
                <Text>Edit Form</Text>
              </Flex>
              <SeparatorIcon />
              <Flex
                height="38px"
                padding="8px 16px"
                justifyContent={'center'}
                alignItems="center"
                gap="8px"
                onClick={()=>{setIsOpen(true);}}
              >
                <DeleteIcon />
                <Text>Move to trash</Text>
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
              <Button
                borderRadius="28px"
                background={'var(--Highlight, #EEF5FF)'}
                padding="4px 12px"
                display={'inline-flex'}
                height="28px"
                _hover={{
                  bgColor: 'var(--Highlight, #EEF5FF)',
                }}
              >
                <Text fontSize={'17px'} fontWeight={'500'}>
                  My Templates
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
          selectionFunction={handleSelectTemplate}
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
            Not seeing the form template you're looking for?
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
      <Modal isOpen={isOpen} onClose={() => {}} isCentered={true}>
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
              from the template directory?
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
                onClick={() => {setIsOpen(false)}}
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
                onClick={() => {(formTemplate)}}
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

export default isAuth(TemplateDirectory, [Scope.CONTRIBUTOR, Scope.ADMIN]);
