import { Scope } from '@web/client';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { NameAndDescriptionBox } from '@web/components/createForm/NameAndDescriptionBox';
import { FormInteractionType } from '@web/components/createForm/types';
import isAuth from '@web/components/isAuth';
import { useEditFormTemplate } from '@web/context/EditFormTemplateContext';
import { useRouter } from 'next/router';
import Error from '@web/components/Error';
import FormLoading from '@web/components/FormLoading';
import { useRouterContext } from '@web/context/RouterProvider';

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
    formDimensions,
    isLoadingEditContext,
  } = useEditFormTemplate();
  const router = useRouter();
  const { isRouteChanging } = useRouterContext();

  if (isLoadingEditContext) {
    return <FormLoading />;
  }

  if (!formDimensions) {
    return <Error secondaryErrorMessage="Error editing form template." />;
  }

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
          formDimensions={formDimensions}
        />
      }
      submitFunction={() => {
        router.push(
          '/form-template/' + formTemplateUseId + '/edit/input-fields',
        );
      }}
      backLink={'/template-directory'}
      disabled={!formTemplateName || isRouteChanging}
      loading={isRouteChanging}
    />
  );
}

export default isAuth(Description, [Scope.ADMIN, Scope.CONTRIBUTOR]);
