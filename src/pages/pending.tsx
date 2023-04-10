import { FormList } from "@/components/FormList";
import { pendingForms } from "@/data/seedData";

export default function Pending() {
  return (
    <>
      <>
        <FormList
          title={"Pending"}
          formInstances={pendingForms}
          color={"#FFECCC"}
        ></FormList>
      </>
    </>
  );
}
