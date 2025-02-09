import { FormTemplateLayout } from '@web/components/createFormTemplate/FormTemplateLayout';
import { NameAndDescriptionBox } from '@web/components/createFormTemplate/NameAndDescriptionBox';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';

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
    <FormTemplateLayout
      pageNumber={2}
      subheading={'Give your form template a name and short description'}
      boxContent={
        <NameAndDescriptionBox
          formLink={localBlobData.url}
          name={formTemplateName}
          description={formTemplateDescription}
          setName={setFormTemplateName}
          setDescription={setFormTemplateDescription}
        />
      }
      deleteFunction={() => {
        setFormTemplateName(null);
        setFormTemplateDescription(null);
      }}
      submitLink={'/create-template/input-fields'}
      backLink={'/create-template/upload'}
      disabled={!formTemplateName}
    />
  );
}
