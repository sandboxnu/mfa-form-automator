import { Box } from '@chakra-ui/react';
import { FieldType } from '@web/components/createFormTemplate/types';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import FormLoading from '@web/components/FormLoading';
import isAuth from '@web/components/isAuth';
import EditableFieldFactory from '@web/components/signFormInstance/EditableFieldFactory';
import { PDFDisplayed } from '@web/components/signFormInstance/PDFDisplayed';
import { useSignFormInstance } from '@web/hooks/useSignFormInstance';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Error from '@web/components/Error';
import { groupColors } from '@web/utils/formTemplateUtils';

export function SignFormPage() {
  const router = useRouter();
  const { id } = router.query;

  const {
    formInstance,
    formInstanceError,
    fields,
    groupNumber,
    originalPdfLink,
    nextSignFormPage,
  } = useSignFormInstance();

  // Store form template dimensions from the API response
  const [formTemplateDimensions, setFormTemplateDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // When formInstance data loads, extract dimensions
  useEffect(() => {
    if (formInstance && formInstance.formTemplate) {
      setFormTemplateDimensions({
        width: formInstance.formTemplate.pageWidth,
        height: formInstance.formTemplate.pageHeight,
      });
    }
  }, [formInstance]);

  // Prepare field elements for each page
  const FieldBoxes = fields.map((page) => {
    return page.map((templateBox) => {
      return (
        <EditableFieldFactory
          data={templateBox.data}
          pageNum={templateBox.page}
          id={templateBox.id}
          key={templateBox.id}
          type={templateBox.type as FieldType}
          currentPosition={{
            x: templateBox.x_coordinate,
            y: templateBox.y_coordinate,
            width: templateBox.width,
            height: templateBox.height,
          }}
          highlighted={false}
          color={groupColors[groupNumber][1]}
        />
      );
    });
  });

  if (!formInstance) {
    return <></>;
  }

  if (formInstanceError) {
    return <Error />;
  }

  return (
    <>
      <FormLayout
        pageNumber={1}
        type={FormInteractionType.SignFormInstance}
        heading={'Sign MFA Oracle Logon Request Form'}
        subheading={'Click the highlighted spaces to sign the form'}
        boxContent={
          <Box width="100%">
            <PDFDisplayed
              formFields={FieldBoxes ?? []}
              pdfLink={originalPdfLink}
              formTemplateName={formInstance.formTemplate.name}
              formTemplateDimensions={formTemplateDimensions}
            />
          </Box>
        }
        submitFunction={async () => {
          setIsLoading(true);
          await nextSignFormPage(`/`, false);
          router.push(`/sign-form/review/${id}`).then(() => {
            setIsLoading(false);
          });
        }}
        backLink={'/'}
        disabled={isLoading}
        loading={false}
      />
    </>
  );
}

export default isAuth(SignFormPage);
