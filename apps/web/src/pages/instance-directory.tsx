import { ActiveFormList } from "@web/components/ActiveFormList";
import { FormListPageLayout } from "@web/components/FormListPageLayout";
import isAuth from "@web/components/isAuth";
import { useUserFormsContext } from "@web/context/UserFormsContext";

function ActiveFormInstanceDirectory() {
    const { pendingForms, completedForms } = useUserFormsContext();
  
    return (
        <>
        <FormListPageLayout>
          <ActiveFormList
            title={'Active Form Instances'}
            pendingForms={pendingForms}
            completedForms={completedForms}
          />
          </FormListPageLayout>
          </>
    );
  }
  
  export default isAuth(ActiveFormInstanceDirectory);
