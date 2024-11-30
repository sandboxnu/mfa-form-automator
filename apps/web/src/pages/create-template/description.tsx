import { useBlob } from '@web/hooks/useBlob';
import { FormTemplateLayout } from '@web/components/createFormTemplate/FormTemplateLayout';
import { NameAndDescriptionBox } from '@web/components/createFormTemplate/NameAndDescriptionBox';
import { useState } from 'react';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
export default function Description() {
  // TODO this name and description should be saved to universal state to persist after this page, possibly in blob storage
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const blob = useBlob();
  return (
    <FormTemplateLayout
      pageNumber={2}
      subheading={'Give your form template a name and short description'}
      boxContent={
        <NameAndDescriptionBox
          formLink={blob.localBlobData.url ? blob.localBlobData.url : ''}
          setName={setName}
          setDescription={setDescription}
        />
      }
      deleteFunction={() => {
        setName(null);
        setDescription(null);
      }}
      submitLink={'/create-template/inputFields'}
      backLink={'/create-template/upload'}
      disabled={!name}
    />
  );
}
