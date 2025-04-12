import { Scope } from '@web/client/types.gen';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { FormTemplateEntity } from '@web/client/types.gen';
import { TemplateSelectGrid } from '@web/components/createFormInstance/FormTemplateGrid';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

function SelectTemplate() {
  const { formTemplate, formInstanceUseId } = useCreateFormInstance();
  const { setFormTemplate, setFormInstanceName } = useCreateFormInstance();

  const handleSelectTemplate = async (id: string) => {
    try {
      const response = await fetch(`/api/form-templates/${id}`);
      if (!response.ok) throw new Error('Failed to find form template');

      const template: FormTemplateEntity = await response.json();
      setFormTemplate(template);
      setFormInstanceName(template.name);
    } catch (error) {
      console.error(error);
    }
  };

  const { data: formTemplates } = useQuery<FormTemplateEntity[]>({
    queryKey: ['api', 'form-templates'],
    queryFn: async () => {
      const response = await fetch('/api/form-templates');
      if (!response.ok) throw new Error('Failed to get form templates');
      return response.json();
    },
  });

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
          allowCreate={true}
          handleSelectTemplate={handleSelectTemplate}
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
