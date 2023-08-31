import { FormList } from 'apps/web/src/components/FormList';
import { pendingForms } from 'apps/web/src/data/seedData';

export default function Pending() {
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
