import { FormList } from "apps/client/src/components/FormList";
import { completedForms } from "apps/client/src/data/seedData";

export default function Completed() {
  return (
    <>
      <FormList
        title={"Completed"}
        formInstances={completedForms}
        color={"#D0F0DC"}
      ></FormList>
    </>
  );
}
