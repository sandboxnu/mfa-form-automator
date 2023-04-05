import Position from "./position";
import Employee from "./employee";
import { PropType, Ref, prop } from "@typegoose/typegoose";

class Department {
    @prop({ required: true, unique: true, type: () => String })
    public name!: string;

    @prop({ required: true, ref: () => Position, type: () => Position })
    public departmentHead!: Ref<Position>;

    @prop({ required: true, ref: () => Position, type: () => Position })
    public leadershipTeamMember!: Ref<Position>;

    @prop({ required: true, ref: () => Employee, type: () => [Employee], default: [] }, PropType.ARRAY)
    public employees: Ref<Employee>[] = [];
};

export default Department;