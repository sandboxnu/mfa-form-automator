import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { AssignGroupsBox } from '@web/components/createFormInstance/AssignGroupsBox';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useEditFormInstance } from '@web/context/EditFormInstanceContext';
import { fetchPdfFile } from '@web/utils/formInstanceUtils';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

function AssignGroups() {
  const {
    formInstanceName,
    formInstanceDescription,
    formTemplate,
    formInstanceUseId,
    assignedGroupData,
    pdfFile
  } = useEditFormInstance();


  const router = useRouter();

  return (
    <FormLayout
      type={FormInteractionType.EditFormInstance}
      pageNumber={3}
      heading={'Edit form instance'}
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
      submitFunction={() => {
        router.push('/form-instance/' + formInstanceUseId + '/edit/review');
      }}
      backLink={'/form-instance/' + formInstanceUseId + '/edit/description'}
      disabled={formTemplate?.fieldGroups.length !== assignedGroupData.length}
    />
  );
}

export default isAuth(AssignGroups);
