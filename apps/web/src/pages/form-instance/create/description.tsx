import { FormLayout } from '@web/components/createForm/FormLayout';
import { NameAndDescriptionBox } from '@web/components/createForm/NameAndDescriptionBox';
import { FormInteractionType } from '@web/components/createForm/types';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useRouter } from 'next/router';

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
    pdfFile,
  } = useCreateFormInstance();
  const router = useRouter();

  if (!formTemplate) {
    return <div>Error: Form template not found.</div>;
  }

  return (
    <FormLayout
      type={FormInteractionType.CreateFormInstance}
      pageNumber={2}
      heading={'Create form instance'}
      subheading={'Edit your form instance name and description'}
      boxContent={
        <NameAndDescriptionBox
          pdfFile={pdfFile}
          fieldGroups={formTemplate?.fieldGroups ?? []}
          name={formInstanceName}
          description={formInstanceDescription}
          setName={setFormInstanceName}
          setDescription={setFormInstanceDescription}
          formDimensions={{
            width: formTemplate?.pageWidth,
            height: formTemplate?.pageHeight,
          }}
        />
      }
      submitFunction={() => {
        router.push('/form-instance/create/assign-groups');
      }}
      backLink={'/form-instance/create/select-template'}
      disabled={!formInstanceName}
    />
  );
}

export default isAuth(Description);
