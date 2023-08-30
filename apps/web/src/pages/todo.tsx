import { FormList } from "apps/client/src/components/FormList";
import { todoForms } from "apps/client/src/data/seedData";

export default function Todo() {
  return (
    <>
      <FormList
        title={"Todo"}
        formInstances={todoForms}
        color={"#FFDFDE"}
      ></FormList>
    </>
  );
}
