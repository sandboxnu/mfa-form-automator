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
    useId,
  } = useCreateFormTemplate();

  function nullify() {
    setFormTemplateName(null);
    setFormTemplateDescription(null);
  }

  return (
    <FormLayout
      type={FormInteractionType.CreateFormTemplate}
      pageNumber={2}
      heading={useId ? 'Edit form template' : 'Create form template'}
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
      deleteFunction={nullify}
      submitLink={'/create-template/input-fields'}
      backLink={useId ? '/template-directory' : '/create-template/upload'}
      disabled={!formTemplateName}
    />
  );
}

export default isAuth(Description, [Scope.ADMIN, Scope.CONTRIBUTOR]);
