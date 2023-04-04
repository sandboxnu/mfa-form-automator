import { prop } from "@typegoose/typegoose";

class Employee {
  @prop({ required: true, type: () => String })
  public firstName!: string;

  @prop({ required: true, type: () => String })
  public lastName!: string;

  @prop({ required: true, unique: true, type: () => String })
  public email!: string;
};

export default Employee;
