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
  formInstancesControllerUpdateMutation,
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
  submitFunction,
  backLink,
  disabled,
  loading,
  review = false,
  heading,
}: {
  type: FormInteractionType;
  submitFunction: any;
  backLink: string;
  disabled: boolean;
  loading: boolean;
  review?: boolean;
  heading: string;
}) => {
  const router = useRouter();

  const { user } = useAuth();

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
            onClick={() => {}}
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
          loading={loading}
          onClick={submitFunction}
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
