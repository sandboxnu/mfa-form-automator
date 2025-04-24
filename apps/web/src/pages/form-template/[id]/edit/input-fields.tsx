import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormEditor } from '@web/components/createFormTemplate/createFormTemplateEditor/FormEditor';
import { Box } from '@chakra-ui/react';
import isAuth from '@web/components/isAuth';
import { Scope } from '@web/client';
import { FormInteractionType } from '@web/components/createForm/types';
import { useEditFormTemplate } from '@web/context/EditFormTemplateContext';
import { useRouter } from 'next/router';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */

function InputFields() {
  const {
    formTemplateName,
    formFields,
    setFormFields,
    fieldGroups,
    setFieldGroups,
    pdfFile,
    setFormDimensions,
    formTemplateUseId,
  } = useEditFormTemplate();
  const router = useRouter();

  return (
    <FormLayout
      type={FormInteractionType.EditFormTemplate}
      pageNumber={3}
      heading={'Edit form template'}
      subheading={
        'Select an assignee group and drag to add input fields for each'
      }
      boxContent={
        <Box width="100%">
          <FormEditor
            formTemplateName={formTemplateName ?? ''}
            pdfFile={pdfFile}
            disableEdit={false}
            formFields={formFields}
            setFormFields={setFormFields}
            fieldGroups={fieldGroups}
            setFieldGroups={setFieldGroups}
            scale={1}
            setFormDimensions={setFormDimensions}
          />
        </Box>
      }
      submitFunction={() => {
        router.push('/form-template/' + formTemplateUseId + '/edit/review');
      }}
      backLink={'/form-template/' + formTemplateUseId + '/edit/description'}
      // TODO set disabled based on some state in the pdf editor component
      disabled={false}
    />
  );
}

export default isAuth(InputFields, [Scope.ADMIN, Scope.CONTRIBUTOR]);
