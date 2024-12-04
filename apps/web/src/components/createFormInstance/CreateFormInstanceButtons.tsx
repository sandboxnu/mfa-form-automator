import { Button, Flex, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const CreateFormTemplateButtons = ({
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

  if (router.pathname.includes('select-template')) {
  }

  return <></>;
};
