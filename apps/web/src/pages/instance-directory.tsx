import { ActiveFormList } from '@web/components/ActiveFormList';
import { FormListPageLayout } from '@web/components/FormListPageLayout';
import isAuth from '@web/components/isAuth';

function ActiveFormInstanceDirectory() {
  return (
    <>
      <FormListPageLayout>
        <ActiveFormList title={'Active Form Instances'} />
      </FormListPageLayout>
    </>
  );
}

export default isAuth(ActiveFormInstanceDirectory);
