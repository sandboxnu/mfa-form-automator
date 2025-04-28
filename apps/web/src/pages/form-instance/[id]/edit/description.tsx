import { FormTemplateBaseEntity } from '@web/client';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { NameAndDescriptionBox } from '@web/components/createForm/NameAndDescriptionBox';
import { FormInteractionType } from '@web/components/createForm/types';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { useEditFormInstance } from '@web/context/EditFormInstanceContext';
import { useUserFormsContext } from '@web/context/UserFormsContext';
import { fetchPdfFile } from '@web/utils/formInstanceUtils';
import { useRouter } from 'next/router';
import { L } from 'node_modules/framer-motion/dist/types.d-6pKw1mTI';
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
    formInstanceUseId,
    setFormInstanceUseId,
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
          fieldGroups={[]}
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
