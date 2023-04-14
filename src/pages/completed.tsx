import { FormList } from "@/components/FormList";
import { completedForms } from "@/data/seedData";

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
