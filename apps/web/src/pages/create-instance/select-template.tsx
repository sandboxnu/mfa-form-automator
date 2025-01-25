import { CreateFormLayout } from '@web/components/createForm/CreateFormLayout';
import { TemplateSelectGrid } from '@web/components/createFormInstance/FormTemplateGrid';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';

export default function SelectTemplate() {
  const { setFormTemplate } = useCreateFormInstance();
  return (
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
      disabled={false}
    />
  );
}
