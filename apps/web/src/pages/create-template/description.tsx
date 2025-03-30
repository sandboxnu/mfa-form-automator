import { Scope } from '@web/client';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { NameAndDescriptionBox } from '@web/components/createForm/NameAndDescriptionBox';
import { FormInteractionType } from '@web/components/createForm/types';
import isAuth from '@web/components/isAuth';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
function Description() {
  const {
    formTemplateName,
    setFormTemplateName,
    formTemplateDescription,
    setFormTemplateDescription,
    pdfFile,
  } = useCreateFormTemplate();

  return (
    <FormLayout
      type={FormInteractionType.CreateFormTemplate}
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

export default isAuth(Description, [Scope.ADMIN]);
