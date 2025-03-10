import { Scope } from '@web/client';
import { CreateFormLayout } from '@web/components/createForm/CreateFormLayout';
import { ReviewBox } from '@web/components/createFormTemplate/ReviewBox';
import isAuth from '@web/components/isAuth';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
function Review() {
  const { formTemplateName, formTemplateDescription, pdfFile, fieldGroups } =
    useCreateFormTemplate();

  return (
    <CreateFormLayout
      isFormTemplate={true}
      pageNumber={4}
      heading={'Create form template'}
      subheading={'Review your form template'}
      boxContent={
        <ReviewBox
          pdfFile={pdfFile}
          name={formTemplateName ? formTemplateName : ''}
          description={formTemplateDescription ? formTemplateDescription : ''}
          fieldGroups={fieldGroups}
        />
      }
      deleteFunction={() => {}}
      submitLink={'/create-template/success'}
      backLink={'/create-template/input-fields'}
      disabled={false}
      review={true}
    />
  );
}

export default isAuth(Review, Scope.ADMIN);
