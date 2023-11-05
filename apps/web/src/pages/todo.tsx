import { FormList } from 'apps/web/src/components/FormList';
import { todoForms } from 'apps/web/src/data/seedData';
import { useAuth } from './../hooks/useAuth';

export default function Todo() {
  useAuth();

  return (
    <>
      <FormList
        title={'Todo'}
        formInstances={todoForms}
        color={'#FFDFDE'}
      ></FormList>
    </>
  );
}
