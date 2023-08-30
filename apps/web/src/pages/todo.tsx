import { FormList } from "apps/web/src/components/FormList";
import { todoForms } from "apps/web/src/data/seedData";

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
