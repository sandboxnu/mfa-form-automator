import { Grid, Box, Flex, Text, Button } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { PDFDocument } from '../PDFDocument';
import router from 'next/router';
import { FormTemplateEntity } from '@web/client';
import { useEffect, useState } from 'react';
import { queryClient } from '@web/pages/_app';
import { formTemplatesControllerFindAllQueryKey } from '@web/client/@tanstack/react-query.gen';

export const TemplateSelectGrid = ({
  formTemplates,
  allowCreate,
  handleSelectTemplate,
  selectedFormTemplate,
  refresh,
  setRefresh,
}: {
  formTemplates: FormTemplateEntity[];
  allowCreate: boolean;
  handleSelectTemplate: any;
  selectedFormTemplate: FormTemplateEntity | null;
  refresh?: boolean;
  setRefresh?: any;
}) => {
  return (
    <Grid
      id="frame"
      templateColumns={'repeat(auto-fill, minmax(200px, 1fr))'}
      gap="16px"
      justifyContent="space-between"
      justifyItems={'stretch'}
    >
      {formTemplates?.map((template) => (
        <>
          <Flex
            key={template.id}
            flexDirection="column"
            onClick={() => {
              handleSelectTemplate(template.id);
            }}
            cursor="pointer"
            width="200px"
            marginBottom="16px"
            box-sizing="borderBox"
          >
            <Box
              overflow="hidden"
              height="250px"
              borderRadius="4px"
              border="1px solid #D4D4D4"
              boxShadow={
                template.id === selectedFormTemplate?.id
                  ? '0px 0px 4px 0px #1367EA'
                  : 'none'
              }
              _hover={{ boxShadow: '0px 0px 4px 0px #1367EA' }}
            >
              <PDFDocument formLink={template.formDocLink} />
            </Box>
            <Flex
              display="flex"
              width="200px"
              marginTop="8px"
              fontSize="15px"
              fontWeight="500"
              flexWrap={'wrap'}
            >
              {template.name}
            </Flex>
          </Flex>
        </>
      ))}
      {allowCreate ? (
        <Flex flexDirection="column" cursor="pointer">
          <Button
            overflow="hidden"
            height="250px"
            width="200px"
            borderRadius="4px"
            border="1px solid #D4D4D4"
            padding="8px"
            backgroundColor="white"
            _hover={{ boxShadow: '0px 0px 4px 0px #1367EA' }}
            onClick={() => {
              router.push('/create-template/upload');
            }}
          >
            <Text fontSize="60px" fontWeight="50" color="black">
              +
            </Text>
          </Button>
          <Text
            flex="center"
            justifyContent="center"
            fontSize="15px"
            fontWeight="500"
            marginTop="8px"
          >
            Create Form Template
          </Text>
        </Flex>
      ) : (
        <></>
      )}
    </Grid>
  );
};
