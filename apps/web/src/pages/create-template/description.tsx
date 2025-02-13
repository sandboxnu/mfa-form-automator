import { CreateFormLayout } from '@web/components/createForm/CreateFormLayout';
import { NameAndDescriptionBox } from '@web/components/createForm/NameAndDescriptionBox';
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
    <CreateFormLayout
      isFormTemplate={true}
      pageNumber={2}
      heading={'Create form template'}
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
      submitLink={'/create-template/inputFields'}
      backLink={'/create-template/upload'}
      disabled={!formTemplateName}
    />
  );
}
