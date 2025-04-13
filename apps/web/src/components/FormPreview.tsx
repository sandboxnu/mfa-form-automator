import { Box, Flex, Heading } from '@chakra-ui/react';
import { FormInstanceEntity } from '@web/client';
import { useState, useEffect } from 'react';
import { SidePreviewForm } from './SidePreviewForm';
import { formEditorTranslateFormFields } from '@web/utils/formInstanceUtils';
import { FormEditor } from './createFormTemplate/createFormTemplateEditor/FormEditor';
import { groupColors } from '@web/utils/formTemplateUtils';
import { fetchPdfFile } from '@web/utils/formInstanceUtils';

export const FormPreview = ({
  formInstance,
}: {
  formInstance: FormInstanceEntity;
}) => {
  const fieldGroups = new Map(
    formInstance?.assignedGroups.map((assignedGroup, i) => {
      const [border, background] = groupColors[i % groupColors.length];
      return [
        assignedGroup.fieldGroup.id,
        {
          fieldGroup: assignedGroup.fieldGroup,
          signerType: assignedGroup.signerType,
          signed: assignedGroup.signed,
          groupName: assignedGroup.fieldGroup.name,
          border,
          background,
        },
      ];
    }),
  );

  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPdfFile(setPdfFile, formInstance?.formDocLink);
  }, [formInstance?.formDocLink]);

  return (
    <>
      <Box height="100vh" marginTop="36px" overflow="hidden">
        <Flex height="100%" width="100%">
          <Box width="170px" height="100%" position="fixed" zIndex={5000}>
            <SidePreviewForm formInstance={formInstance} />
          </Box>

          <Box
            marginLeft="170px"
            height="100%"
            width="calc(100% - 170px)"
            padding="0 36px"
            display="flex"
            flexDirection="column"
            overflow="hidden"
          >
            <Heading
              color="#2A2B2D"
              fontSize="30px"
              fontWeight={700}
              lineHeight="38px"
              marginTop="0px"
              marginBottom="12px"
              marginLeft="0px"
            >
              Form Preview
            </Heading>

            <Flex
              flex="1"
              borderRadius="12px"
              border="1px solid #E5E5E5"
              backgroundColor="#FFF"
              padding="24px"
              overflow="hidden"
              maxHeight="calc(100vh - 180px)"
              width="900px"
            >
              <FormEditor
                formTemplateName={formInstance.name}
                pdfFile={pdfFile}
                disableEdit={true}
                fieldGroups={fieldGroups}
                formFields={formEditorTranslateFormFields(
                  Array.from(fieldGroups.values()).map((v) => v.fieldGroup),
                )}
                setFormFields={() => {}}
                setFieldGroups={() => {}}
                scale={1}
                documentWidth={800}
                showNav={false}
              />
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};
