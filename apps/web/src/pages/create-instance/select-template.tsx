import { Scope } from '@web/client/types.gen';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { TemplateSelectGrid } from '@web/components/createFormInstance/FormTemplateGrid';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';

function SelectTemplate() {
  const { formTemplate, setFormTemplate } = useCreateFormInstance();

  return (
    <FormLayout
      type={FormInteractionType.CreateFormInstance}
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
