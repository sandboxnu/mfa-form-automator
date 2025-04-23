import { FormLayout } from '@web/components/createForm/FormLayout';
import { NameAndDescriptionBox } from '@web/components/createForm/NameAndDescriptionBox';
import { FormInteractionType } from '@web/components/createForm/types';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';

/**
 * The description page in the form instance creation flow, where users describe their form.
 */
function Description() {
  const {
    formTemplate,
    formInstanceName,
    formInstanceDescription,
    setFormInstanceName,
    setFormInstanceDescription,
    formInstanceUseId,
    pdfFile,
  } = useCreateFormInstance();

  return (
    <FormLayout
      type={FormInteractionType.EditFormInstance}
      pageNumber={2}
      heading={'Edit form instance'}
      subheading={'Edit your form instance name and description'}
      boxContent={
        <NameAndDescriptionBox
          pdfFile={pdfFile}
          fieldGroups={formTemplate?.fieldGroups ?? []}
          name={formInstanceName}
          description={formInstanceDescription}
          setName={setFormInstanceName}
          setDescription={setFormInstanceDescription}
        />
      }
      deleteFunction={() => {
        setFormInstanceName(null);
        setFormInstanceDescription(null);
      }}
      submitLink={'/form-instance/[id]/edit/assign-groups'}
      backLink={'/form-instance/create/success'}
      disabled={!formInstanceName}
    />
  );
}

export default isAuth(Description);
