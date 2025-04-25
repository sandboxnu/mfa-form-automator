import { Scope } from '@web/client';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { NameAndDescriptionBox } from '@web/components/createForm/NameAndDescriptionBox';
import { FormInteractionType } from '@web/components/createForm/types';
import isAuth from '@web/components/isAuth';
import { useEditFormTemplate } from '@web/context/EditFormTemplateContext';
import { useRouter } from 'next/router';

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
    fieldGroups,
  } = useEditFormTemplate();
  const router = useRouter();
  return (
    <FormLayout
      type={FormInteractionType.EditFormTemplate}
      pageNumber={2}
      heading={'Edit form template'}
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
      submitFunction={() => {
        router.push(
          '/form-template/' + formTemplateUseId + '/edit/input-fields',
        );
      }}
      backLink={'/template-directory'}
      disabled={!formTemplateName}
    />
  );
}

export default isAuth(Description, [Scope.ADMIN, Scope.CONTRIBUTOR]);
