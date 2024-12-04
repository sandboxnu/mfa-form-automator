import { Grid, Box, Flex, Text } from '@chakra-ui/react';
import { FormTemplatesService } from '@web/client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PDFDocument } from '../PDFDocument';

export const TemplateSelectGrid: React.FC = () => {
  const { data: formTemplates } = useQuery({
    queryKey: ['api', 'form-templates'],
    queryFn: () => FormTemplatesService.formTemplatesControllerFindAll(),
  });

  const [selectedFormTemplateId, setSelectedFormTemplateId] = useState<
    string | null
  >(null);

  return (
    <Grid templateColumns="repeat(5, 1fr)" gap="24px" padding="16px">
      {formTemplates?.map((template) => (
        <Flex
          key={template.id}
          flexDirection="column"
          padding="4px 4px 0px 4px"
          onClick={() => setSelectedFormTemplateId(template.id)}
          cursor="pointer"
        >
          <Box
            key={template.id} // Add a unique key for each item
            overflow="hidden"
            height="full"
            borderRadius="4px"
            border="1px solid #D4D4D4"
            boxShadow={
              template.id === selectedFormTemplateId
                ? '0px 0px 4px 0px #1367EA;'
                : 'none'
            }
          >
            <PDFDocument formLink={template.formDocLink} />
          </Box>
          <Text marginTop="8px" fontSize="15px" fontWeight="500">
            {template.name}
          </Text>
        </Flex>
      ))}
    </Grid>
  );
};
