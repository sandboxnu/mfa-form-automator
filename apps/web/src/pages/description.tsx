import { useBlob } from '@web/hooks/useBlob';
import { FormTemplateLayout } from '@web/components/createFormTemplate/FormTemplateLayout';
import { NameAndDescriptionBox } from '@web/components/createFormTemplate/NameAndDescriptionBox';
import { useState } from 'react';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
export default function Description() {
    const [name, setName] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
  
  return (
    <FormTemplateLayout
      pageNumber={2}
      subheading={'Give your form template a name and short description'}
      boxContent={<NameAndDescriptionBox 
            name={name} 
            setName={setName}
            description={description}
            setDescription={setDescription}/>}
      deleteFunction={() => {setName(null); setDescription(null)}}
      submitLink={'/'}
      backLink={'/upload'}
      disabled={!name}
    />
  );
}