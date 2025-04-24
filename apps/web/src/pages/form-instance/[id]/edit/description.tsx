import { FormLayout } from '@web/components/createForm/FormLayout';
import { NameAndDescriptionBox } from '@web/components/createForm/NameAndDescriptionBox';
import { FormInteractionType } from '@web/components/createForm/types';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useEditFormInstance } from '@web/context/EditFormInstanceContext';
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
    formInstanceUseId,
    pdfFile,
  } = useEditFormInstance();
  const router = useRouter();

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
      submitFunction={() => {
        router.push(
          '/form-instance/' + formInstanceUseId + '/edit/assign-groups',
        );
      }}
      backLink={'/form-instance/' + formInstanceUseId + '/edit/success'}
      disabled={!formInstanceName}
    />
  );
}

export default isAuth(Description);
