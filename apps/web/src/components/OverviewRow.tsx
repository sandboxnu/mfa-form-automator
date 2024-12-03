import React, { useState } from 'react';
import {
  HStack,
  Flex,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Box,
} from '@chakra-ui/react';
import { FormCard } from './FormCard';
import { FormInstanceEntity } from '@web/client';
import { FormImageCard } from './FormImageCard';
import { ViewAll } from './ViewAll';
import FormInstance from './FormInstance';

export const OverviewRow = ({
  title,
  color,
  link,
  formInstances,
}: {
  title: string;
  color: string;
  link: string;
  formInstances: FormInstanceEntity[];
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFormInstance, setSelectedFormInstance] = useState<FormInstanceEntity | null>(null);

  const handleOpenDrawer = (formInstance: FormInstanceEntity) => {
    setSelectedFormInstance(formInstance);
    onOpen();
  };

  let displayFormInstances: FormInstanceEntity[] = formInstances.slice(
    0,
    Math.min(4, formInstances.length),
  );

  return (
    <>
      <Flex justifyContent="space-between">
        <Flex alignItems="center">
          <Text color="#32353B" fontSize="24px" fontWeight="500">
            {title === 'To-do'
              ? `You have ${formInstances.length} ${
                  formInstances.length === 1 ? 'form' : 'forms'
                } waiting for you.`
              : title}
          </Text>

          {title !== 'To-do' && (
            <Flex
              marginLeft="13px"
              backgroundColor={color}
              height="18px"
              width="32px"
              borderRadius="12"
              justifyItems="center"
              alignItems="center"
            >
              <Text fontSize="14px" fontWeight="700" color="#756160">
                {formInstances.length}
              </Text>
            </Flex>
          )}
        </Flex>
        <Flex pr="30px">
          <ViewAll title={title} link={link} />
        </Flex>
      </Flex>
      <HStack
        marginTop="20px"
        flexDirection="row"
        wrap="wrap"
        pr="30px"
        spacing="20px"
        width="100%"
      >
        {displayFormInstances.map((formInstance, index) => {
          const handleClick = () => handleOpenDrawer(formInstance);

          return (
            <Box key={index} onClick={handleClick} cursor="pointer">
              {title === 'To-do' ? (
                <FormImageCard
                  formInstance={formInstance}
                  link={'/form-instances/' + formInstance.id}
                />
              ) : (
                <FormCard
                  formName={formInstance.name}
                  signatures={formInstance.signatures}
                  link={'/form-instances/' + formInstance.id}
                />
              )}
            </Box>
          );
        })}
      </HStack>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Form Details</DrawerHeader>
        <DrawerBody>
          {selectedFormInstance ? (
            <FormInstance formInstance={selectedFormInstance} onClose={onClose} />
          ) : (
            <Text>No form selected</Text>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>

    </>
  );
};
