import { CreateFormLayout } from '@web/components/createFormLayout/CreateFormLayout';
import { ReviewBox } from '@web/components/createFormTemplate/ReviewBox';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
export default function Review() {
  const { formTemplateName, formTemplateDescription, useBlob } =
    useCreateFormTemplate();

  const { localBlobData } = useBlob;
  return (
    <CreateFormLayout
      pageNumber={4}
      subheading={'Review your form template'}
      deleteFunction={() => {}}
      submitLink={'/create-template/success'}
      backLink={'/create-template/input-fields'}
      disabled={false}
      review={true}
    >
      <ReviewBox
        formLink={localBlobData.url}
        name={formTemplateName ? formTemplateName : ''}
        description={formTemplateDescription ? formTemplateDescription : ''}
      />
    </CreateFormLayout>
  );
}
