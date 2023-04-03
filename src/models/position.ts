import { PropType, Ref, prop } from "@typegoose/typegoose";
import Department from "./department";
import Employee from "./employee";
import FormInstance from "./form-instance";

class Position {

    @prop({ required: true, type: () => String })
    public roleName!: string;
    
    // @prop({ required: true, ref: () => Position, type: () => Position }) //? Same question here
    // public manager?: Ref<Position>; //? What if we made this not hold the entire reference but just the id?

    @prop({ required: true, type: () => String }) //? Same question here
    public manager?: string; //? What if we made this not hold the entire reference but just the id?

    // @prop({ required: true, ref: () => Position, type: () => [Position] }, PropType.ARRAY)
    // public underlings: Ref<Position>[] = [];

    @prop({ required: true, type: () => [String] }, PropType.ARRAY)
    public underlings: string[] = [];

    @prop({ required: true, ref: () => Department, type: () => Department })
    public department!: Ref<Department>;

    @prop({ required: true, ref: () => Employee, type: () => Employee })
    public employee!: Ref<Employee>;

    @prop({ required: true, ref: () => FormInstance, type: () => [FormInstance] }, PropType.ARRAY)
    public formInstances: Ref<FormInstance>[] = [];
};

export default Position;
