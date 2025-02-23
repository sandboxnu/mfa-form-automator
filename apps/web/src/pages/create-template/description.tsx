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
    pdfFile,
  } = useCreateFormTemplate();

  return (
    <CreateFormLayout
      isFormTemplate={true}
      pageNumber={2}
      heading={'Create form template'}
      subheading={'Give your form template a name and short description'}
      boxContent={
        <NameAndDescriptionBox
          pdfFile={pdfFile}
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
