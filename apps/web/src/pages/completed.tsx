import { FormList } from 'apps/web/src/components/FormList';
import { completedForms } from 'apps/web/src/data/seedData';

export default function Completed() {
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
