import { FormLayout } from '@web/components/createForm/FormLayout';
import { NameAndDescriptionBox } from '@web/components/createForm/NameAndDescriptionBox';
import { FormInteractionType } from '@web/components/createForm/types';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { fetchPdfFile } from '@web/utils/formInstanceUtils';
import { useEffect, useState } from 'react';

/**
 * The description page in the form instance creation flow, where users describe their form.
 */
function Description() {
  const {
    formInstanceName,
    formInstanceDescription,
    setFormInstanceName,
    setFormInstanceDescription,
    formTemplate,
    formInstanceUseId,
  } = useCreateFormInstance();

  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPdfFile(setPdfFile, formTemplate?.formDocLink);
  }, [formTemplate?.formDocLink]);

  return (
    <FormLayout
      type={
        formInstanceUseId
          ? FormInteractionType.EditFormInstance
          : FormInteractionType.CreateFormInstance
      }
      pageNumber={2}
      heading={
        formInstanceUseId ? 'Edit form instance' : 'Create form instance'
      }
      subheading={'Edit your form instance name and description'}
      boxContent={
        <NameAndDescriptionBox
          pdfFile={pdfFile}
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

export default isAuth(Description);
