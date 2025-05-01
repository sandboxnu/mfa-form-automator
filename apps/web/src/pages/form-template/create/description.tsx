import { Scope } from '@web/client';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { NameAndDescriptionBox } from '@web/components/createForm/NameAndDescriptionBox';
import { FormInteractionType } from '@web/components/createForm/types';
import Error from '@web/components/Error';
import isAuth from '@web/components/isAuth';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
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
    formDimensions,
  } = useCreateFormTemplate();

  const router = useRouter();

  if (!pdfFile || !formDimensions) {
    return <></>;
  }

  return (
    <FormLayout
      type={FormInteractionType.CreateFormTemplate}
      pageNumber={2}
      heading={'Create form template'}
      subheading={'Give your form template a name and short description'}
      boxContent={
        <NameAndDescriptionBox
          pdfFile={pdfFile}
          fieldGroups={[]}
          name={formTemplateName}
          description={formTemplateDescription}
          formDimensions={formDimensions}
          setName={setFormTemplateName}
          setDescription={setFormTemplateDescription}
        />
      }
      submitFunction={() => {
        router.push('/form-template/create/input-fields');
      }}
      backLink={'/form-template/create/upload'}
      disabled={!formTemplateName}
    />
  );
}

export default isAuth(Description, [Scope.ADMIN, Scope.CONTRIBUTOR]);
