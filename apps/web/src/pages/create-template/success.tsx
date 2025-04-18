import { Scope } from '@web/client';
import { SuccessPage } from '@web/components/createForm/SuccessPage';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { useRouter } from 'next/router';

function Success() {
  const router = useRouter();
  const { formTemplateUseId } = useCreateFormTemplate();

  return (
    <SuccessPage
      message={
        formTemplateUseId?.substring(0, 6)
          ? 'Your form template has been updated!'
          : 'Your form template has been created!'
      }
      linkText={'Create form instance'}
      linkAction={() => router.push('/create-instance/select-template')}
    />
  );
}

export default isAuth(Success, [Scope.ADMIN, Scope.CONTRIBUTOR]);
