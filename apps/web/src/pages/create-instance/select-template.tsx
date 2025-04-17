import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { FormTemplateEntity, Scope } from '@web/client/types.gen';
import { TemplateSelectGrid } from '@web/components/createFormInstance/FormTemplateGrid';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@web/hooks/useAuth';
import { formTemplatesControllerFindAllOptions } from '@web/client/@tanstack/react-query.gen';

function SelectTemplate() {
  const { user } = useAuth();
  const {
    formTemplate,
    formInstanceUseId,
    setFormTemplate,
    setFormInstanceName,
  } = useCreateFormInstance();

  const { data: formTemplates } = useQuery(
    formTemplatesControllerFindAllOptions(),
  );

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
          formTemplates={formTemplates!!}
          allowCreate={
            user?.scope === Scope.ADMIN || user?.scope === Scope.CONTRIBUTOR
          }
          handleSelectTemplate={(template: FormTemplateEntity) => {
            setFormTemplate(template);
            setFormInstanceName(template.name);
          }}
          selectedFormTemplate={formTemplate}
        />
      }
      deleteFunction={() => {
        setFormTemplate(null);
      }}
      submitLink={'/create-instance/description'}
      backLink={'/'}
      review={false}
      disabled={!formTemplate}
    />
  );
}

export default isAuth(SelectTemplate);
