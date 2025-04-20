import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { AssignGroupsBox } from '@web/components/createFormInstance/AssignGroupsBox';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { fetchPdfFile } from '@web/utils/formInstanceUtils';
import { useState, useEffect } from 'react';

function AssignGroups() {
  const {
    formInstanceName,
    formInstanceDescription,
    formTemplate,
    formInstanceUseId,
    assignedGroupData,
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
      pageNumber={3}
      heading={
        formInstanceUseId ? 'Edit form instance' : 'Create form instance'
      }
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
      submitLink={'/create-instance/review'}
      backLink={'/create-instance/description'}
      disabled={formTemplate?.fieldGroups.length !== assignedGroupData.length}
    />
  );
}

export default isAuth(AssignGroups);
