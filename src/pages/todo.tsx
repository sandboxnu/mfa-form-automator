import { FormList } from "@/components/FormList";
import { todoForms } from "@/data/seedData";

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
