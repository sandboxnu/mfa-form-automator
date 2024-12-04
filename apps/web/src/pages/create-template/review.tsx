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
    fieldGroups,
    formFields,
  } = useCreateFormTemplate();

  const { localBlobData } = useBlob;

  return (
    <FormTemplateLayout
      pageNumber={4}
      subheading={'Review your form template'}
      boxContent={
        <ReviewBox
          groups={fieldGroups}
          fields={formFields}
          formLink={localBlobData.url}
          name={formTemplateName ? formTemplateName : ''}
          description={formTemplateDescription ? formTemplateDescription : ''}
        />
      }
      deleteFunction={() => {}}
      submitLink={'/create-template/success'}
      backLink={'/create-template/inputFields'}
      disabled={false}
      review={true}
    />
  );
}
