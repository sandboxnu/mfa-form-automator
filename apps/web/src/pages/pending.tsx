import { FormList } from 'apps/web/src/components/FormList';
import { pendingForms } from 'apps/web/src/data/seedData';
import { useAuth } from './../hooks/useAuth';

export default function Pending() {
  useAuth();
  return (
    <>
      <FormList
        title={'Pending'}
        formInstances={pendingForms}
        color={'#FFECCC'}
      ></FormList>
    </>
  );
}
