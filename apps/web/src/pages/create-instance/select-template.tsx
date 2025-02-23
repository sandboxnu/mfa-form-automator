import { CreateFormLayout } from '@web/components/createForm/CreateFormLayout';
import { TemplateSelectGrid } from '@web/components/createFormInstance/FormTemplateGrid';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useEffect } from 'react';

export default function SelectTemplate() {
  const { formTemplate, setFormTemplate } = useCreateFormInstance();

  return (
    console.log('formtemplate', formTemplate),
    (
      <CreateFormLayout
        isFormTemplate={false}
        pageNumber={1}
        heading={'Create form instance'}
        subheading={'Select a form template'}
        boxContent={<TemplateSelectGrid />}
        deleteFunction={() => {
          setFormTemplate(null);
        }}
        submitLink={'/create-instance/description'}
        backLink={'/'}
        review={false}
        disabled={!formTemplate}
      />
    )
  );
}
