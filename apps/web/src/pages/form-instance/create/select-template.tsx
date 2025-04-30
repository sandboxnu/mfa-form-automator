import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { FormTemplateEntity, Scope } from '@web/client/types.gen';
import { TemplateSelectGrid } from '@web/components/createFormInstance/FormTemplateGrid';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useAuth } from '@web/hooks/useAuth';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

function SelectTemplate() {
  const { user } = useAuth();
  const { formTemplate, setFormTemplate, setFormInstanceName } =
    useCreateFormInstance();
  const router = useRouter();

  // Memoize the handleSelectTemplate function to prevent re-renders
  const handleSelectTemplate = useCallback(
    (template: FormTemplateEntity) => {
      setFormTemplate(template);
      setFormInstanceName(template.name);
    },
    [setFormTemplate, setFormInstanceName],
  );

  const allowCreate =
    user?.scope === Scope.ADMIN || user?.scope === Scope.CONTRIBUTOR;

  return (
    <FormLayout
      type={FormInteractionType.CreateFormInstance}
      pageNumber={1}
      heading={'Create form instance'}
      subheading={'Select a form template'}
      boxContent={
        <TemplateSelectGrid
          allowCreate={allowCreate}
          handleSelectTemplate={handleSelectTemplate}
          selectedFormTemplate={formTemplate}
        />
      }
      submitFunction={() => router.push('/form-instance/create/description')}
      backLink={'/'}
      review={false}
      disabled={!formTemplate}
    />
  );
}

export default isAuth(SelectTemplate);
