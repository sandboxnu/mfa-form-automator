import { CreateFormLayout } from '@web/components/createForm/CreateFormLayout';
import { TemplateSelectGrid } from '@web/components/createFormInstance/FormTemplateGrid';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';

function SelectTemplate() {
  const { formTemplate, setFormTemplate } = useCreateFormInstance();

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
      review={false}
      disabled={!formTemplate}
    />
  );
}

export default isAuth(SelectTemplate);
