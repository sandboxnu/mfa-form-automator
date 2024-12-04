import { NameAndDescriptionBox } from '@web/components/createFormTemplate/NameAndDescriptionBox';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { CreateFormLayout } from '@web/components/createFormLayout/CreateFormLayout';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
export default function Description() {
  const {
    formTemplateName,
    setFormTemplateName,
    formTemplateDescription,
    setFormTemplateDescription,
    useBlob,
  } = useCreateFormTemplate();

  const { localBlobData } = useBlob;

  return (
    <CreateFormLayout
      pageNumber={2}
      subheading={'Give your form template a name and short description'}
      deleteFunction={() => {
        setFormTemplateName(null);
        setFormTemplateDescription(null);
      }}
      submitLink={'/create-template/input-fields'}
      backLink={'/create-template/upload'}
      disabled={!formTemplateName || !formTemplateDescription}
    >
      <NameAndDescriptionBox
        formLink={localBlobData.url}
        name={formTemplateName}
        description={formTemplateDescription}
        setName={setFormTemplateName}
        setDescription={setFormTemplateDescription}
      />
    </CreateFormLayout>
  );
}
