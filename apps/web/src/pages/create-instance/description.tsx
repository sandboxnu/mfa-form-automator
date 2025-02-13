import { CreateFormLayout } from '@web/components/createForm/CreateFormLayout';
import { NameAndDescriptionBox } from '@web/components/createForm/NameAndDescriptionBox';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';

/**
 * The description page in the form instance creation flow, where users describe their form.
 */
export default function Description() {
  
  const {
    formInstanceName,
    formInstanceDescription,
    setFormInstanceName,        
    setFormInstanceDescription,
    formTemplate,
  } = useCreateFormInstance();


  return (
    <CreateFormLayout
      isFormTemplate={false}
      pageNumber={2}
      heading={'Create form instance'}
      subheading={'Edit your form instance name and description'}
      boxContent={
        <NameAndDescriptionBox
          formLink={formTemplate?.formDocLink || ''}
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
      submitLink={'/create-instance/assign-groups'}
      backLink={'/create-instance/select-template'}
      disabled={!formInstanceName}
    />
  );
}
