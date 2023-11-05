import { FormList } from 'apps/web/src/components/FormList';
import { completedForms } from 'apps/web/src/data/seedData';
import { useAuth } from './../hooks/useAuth';

export default function Completed() {
  useAuth();
  return (
    <>
      <FormList
        title={'Completed'}
        formInstances={completedForms}
        color={'#D0F0DC'}
      ></FormList>
    </>
  );
}
