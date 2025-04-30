import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { FormTemplateEntity, Scope } from '@web/client/types.gen';
import { TemplateSelectGrid } from '@web/components/createFormInstance/FormTemplateGrid';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useAuth } from '@web/hooks/useAuth';
import { useCallback } from 'react';

function SelectTemplate() {
  const { user } = useAuth();
  const {
    formTemplate,
    formInstanceUseId,
    setFormTemplate,
    setFormInstanceName,
  } = useCreateFormInstance();

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
      type={
        formInstanceUseId
          ? FormInteractionType.EditFormInstance
          : FormInteractionType.CreateFormInstance
      }
      pageNumber={1}
      heading={
        formInstanceUseId ? 'Edit form instance' : 'Create form instance'
      }
      subheading={'Select a form template'}
      boxContent={
        <TemplateSelectGrid
          allowCreate={allowCreate}
          handleSelectTemplate={handleSelectTemplate}
          selectedFormTemplate={formTemplate}
        />
      }
      submitLink={'/create-instance/description'}
      backLink={'/'}
      review={false}
      disabled={!formTemplate}
    />
  );
}

export default isAuth(SelectTemplate);
