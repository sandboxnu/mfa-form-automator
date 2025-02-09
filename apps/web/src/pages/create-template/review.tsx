import { FormTemplateLayout } from '@web/components/createFormTemplate/FormTemplateLayout';
import { ReviewBox } from '@web/components/createFormTemplate/ReviewBox';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
export default function Review() {
  const {
    formTemplateName,
    formTemplateDescription,
    useBlob,
    formFields,
    fieldGroups,
  } = useCreateFormTemplate();

  const { localBlobData } = useBlob;
  return (
    <FormTemplateLayout
      pageNumber={4}
      subheading={'Review your form template'}
      boxContent={
        <ReviewBox
          formLink={localBlobData.url}
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
