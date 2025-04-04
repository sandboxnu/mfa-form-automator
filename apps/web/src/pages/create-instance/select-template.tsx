import { FormTemplateEntity, Scope } from '@web/client/types.gen';
import { CreateFormLayout } from '@web/components/createForm/CreateFormLayout';
import { TemplateSelectGrid } from '@web/components/createFormInstance/FormTemplateGrid';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useState } from 'react';

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

  return (
    <CreateFormLayout
      isFormTemplate={false}
      pageNumber={1}
      heading={
        formInstanceUseId ? 'Edit form instance' : 'Create form instance'
      }
      subheading={'Select a form template'}
      boxContent={
        <TemplateSelectGrid
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

export default isAuth(SelectTemplate, [Scope.CONTRIBUTOR, Scope.ADMIN]);
