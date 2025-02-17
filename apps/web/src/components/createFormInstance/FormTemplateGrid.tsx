import { Grid, Box, Flex, Text, Button } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PDFDocument } from '../PDFDocument';
import router from 'next/router';
import { FormTemplate } from '@prisma/client';
import { FormTemplateEntity } from '@web/client';
import { useCreateFormInstance } from '../../context/CreateFormInstanceContext';

export const TemplateSelectGrid: React.FC = () => {
  const { data: formTemplates } = useQuery<FormTemplate[]>({
    queryKey: ['api', 'form-templates'],
    queryFn: async () => {
      const response = await fetch('/api/form-templates'); 
      if (!response.ok) throw new Error('Failed to get form templates');
      return response.json();
    },
  });

  const { setFormTemplate, setFormInstanceName } = useCreateFormInstance();
  const [selectedFormTemplateId, setSelectedFormTemplateId] = useState<string | null>(null);
 

  const handleSelectTemplate = async (id: string) => {
    setSelectedFormTemplateId(id);

    try {
      const response = await fetch(`/api/form-templates/${id}`);
      if (!response.ok) throw new Error('Failed to find form template');
      
      const template: FormTemplateEntity = await response.json(); 
      setFormTemplate(template);
      setFormInstanceName(template.name);
      console.log('Selected Form Template:', template.name);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid templateColumns="repeat(5, 1fr)" gap="24px" padding="16px">
      {formTemplates?.map((template) => (
        <Flex
          key={template.id}
          flexDirection="column"
          padding="4px 4px 0px 4px"
          onClick={() => handleSelectTemplate(template.id)}
          cursor="pointer"
        >
          <Box
            overflow="hidden"
            height="240px"
            borderRadius="4px"
            border="1px solid #D4D4D4"
            boxShadow={template.id === selectedFormTemplateId ? '0px 0px 4px 0px #1367EA' : 'none'}
            _hover={{ boxShadow: '0px 0px 4px 0px #1367EA' }}
          >
            <PDFDocument formLink={template.formDocLink} />
          </Box>
          <Text marginTop="8px" fontSize="15px" fontWeight="500">
            {template.name}
          </Text>
        </Flex>
      ))}
      <Flex
          flexDirection="column"
          padding="4px 4px 0px 4px"
          cursor="pointer"
        >
          <Button
            overflow="hidden"
            height="240px"
            borderRadius="4px"
            border="1px solid #D4D4D4"
            padding="8px"
            backgroundColor="white"
            _hover={{ boxShadow: '0px 0px 4px 0px #1367EA' }}
            onClick={() => {
              router.push('/create-template/upload');
            }}>
            <Text fontSize="60px" fontWeight="50">
              +
            </Text>
          </Button>
          <Text flex="center" justifyContent="center" fontSize="15px" fontWeight="500" marginTop="8px">
            Create Form Template
          </Text>
        </Flex>
    </Grid>
  );
};
