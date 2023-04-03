import Position from "./position";
import Employee from "./employee";
import { Prop, PropType, Ref } from "@typegoose/typegoose";

class Department {
    @Prop({ required: true, type: () => String }) //? Should maybe be unique?
    public name!: string;

    @Prop({ required: true, ref: () => Position, type: () => Position })
    public departmentHead!: Ref<Position>;

    @Prop({ required: true, ref: () => Position, type: () => Position })
    public leadershipTeamMember!: Ref<Position>;

    @Prop({ required: true, ref: () => Employee, type: () => [Employee] }, PropType.ARRAY)
    public employees: Ref<Employee>[] = [];
};

export default Department;