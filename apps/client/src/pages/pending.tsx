import { FormList } from "apps/client/src/components/FormList";
import { pendingForms } from "apps/client/src/data/seedData";

export default function Pending() {
  return (
    <>
      <FormList
        title={"Pending"}
        formInstances={pendingForms}
        color={"#FFECCC"}
      ></FormList>
    </>
  );
}
