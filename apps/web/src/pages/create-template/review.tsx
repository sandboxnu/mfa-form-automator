import { CreateFormLayout } from '@web/components/createForm/CreateFormLayout';
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
    <CreateFormLayout
      isFormTemplate={true}
      pageNumber={4}
      heading={'Create form template'}
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
      backLink={'/create-template/inputFields'}
      disabled={false}
      review={true}
    />
  );
}
