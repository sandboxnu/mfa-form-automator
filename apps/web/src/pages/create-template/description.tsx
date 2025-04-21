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
    formTemplateUseId,
  } = useCreateFormTemplate();

  return (
    <FormLayout
      type={
        formTemplateUseId
          ? FormInteractionType.EditFormTemplate
          : FormInteractionType.CreateFormTemplate
      }
      pageNumber={2}
      heading={
        formTemplateUseId ? 'Edit form template' : 'Create form template'
      }
      subheading={'Give your form template a name and short description'}
      boxContent={
        <NameAndDescriptionBox
          pdfFile={pdfFile}
          fieldGroups={[]}
          name={formTemplateName}
          description={formTemplateDescription}
          setName={setFormTemplateName}
          setDescription={setFormTemplateDescription}
        />
      }
      submitLink={
        formTemplateUseId
          ? '/create-template/review'
          : '/create-template/input-fields'
      }
      backLink={
        formTemplateUseId ? '/template-directory' : '/create-template/upload'
      }
      disabled={!formTemplateName}
    />
  );
}

export default isAuth(Description, [Scope.ADMIN, Scope.CONTRIBUTOR]);
