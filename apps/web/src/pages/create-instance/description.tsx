import { CreateFormLayout } from '@web/components/createForm/CreateFormLayout';
import { NameAndDescriptionBox } from '@web/components/createForm/NameAndDescriptionBox';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useEffect, useState } from 'react';

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

  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPdfFile = async () => {
      if (formTemplate?.formDocLink) {
        const response = await fetch(formTemplate.formDocLink);
        const blob = await response.blob();
        const file = new File([blob], 'document.pdf', {
          type: 'application/pdf',
        });
        setPdfFile(file);
      }
    };

    fetchPdfFile();
  }, [formTemplate?.formDocLink]);

  return (
    <CreateFormLayout
      isFormTemplate={false}
      pageNumber={2}
      heading={'Create form instance'}
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
