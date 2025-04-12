import { Scope } from '@web/client';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/createFormTemplate/ReviewBox';
import isAuth from '@web/components/isAuth';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
function Review() {
  const {
    formTemplateName,
    formTemplateDescription,
    pdfFile,
    fieldGroups,
    formTemplateUseId,
  } = useCreateFormTemplate();

  return (
    <FormLayout
      type={
        formTemplateUseId
          ? FormInteractionType.EditFormTemplate
          : FormInteractionType.CreateFormTemplate
      }
      pageNumber={4}
      heading={
        formTemplateUseId ? 'Edit form template' : 'Create form template'
      }
      subheading={'Review your form template'}
      boxContent={
        <ReviewBox
          pdfFile={pdfFile}
          name={formTemplateName ?? ''}
          description={formTemplateDescription ?? ''}
          fieldGroups={fieldGroups}
        />
      }
      deleteFunction={() => {}}
      submitLink={'/create-template/success'}
      backLink={
        formTemplateUseId
          ? '/create-template/description'
          : '/create-template/input-fields'
      }
      disabled={false}
      review={true}
    />
  );
}

export default isAuth(Review, [Scope.ADMIN, Scope.CONTRIBUTOR]);
