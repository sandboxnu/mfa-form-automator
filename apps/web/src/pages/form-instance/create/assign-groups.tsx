import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { AssignGroupsBox } from '@web/components/createFormInstance/AssignGroupsBox';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { fetchPdfFile } from '@web/utils/formInstanceUtils';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

function AssignGroups() {
  const { formInstanceName, formInstanceDescription, formTemplate } =
    useCreateFormInstance();

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPdfFile(setPdfFile, formTemplate?.formDocLink);
  }, [formTemplate?.formDocLink]);

  return (
    <FormLayout
      type={FormInteractionType.CreateFormInstance}
      pageNumber={3}
      heading={'Create form instance'}
      subheading={
        'Assign your input field groups to a person, role, or department'
      }
      boxContent={
        <AssignGroupsBox
          pdfFile={pdfFile}
          name={formInstanceName ?? ''}
          description={formInstanceDescription ?? ''}
          fieldGroups={formTemplate?.fieldGroups ?? []}
        />
      }
      deleteFunction={() => {}}
      submitFunction={() => {
        router.push('/form-instance/create/review');
      }}
      backLink={'/form-instance/create/description'}
      disabled={false}
    />
  );
}

export default isAuth(AssignGroups);
