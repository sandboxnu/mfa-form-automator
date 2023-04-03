import { prop } from "@typegoose/typegoose";

class Employee {
  //? mongoDb has an intrinsic attribute _id do we also want employee Id?
  //! Do we want to add password here?
  
  @prop({ required: true, type: () => String })
  public firstName!: string;

  @prop({ required: true, type: () => String })
  public lastName!: string;

  @prop({ required: true, unique: true, type: () => String })
  public email!: string;
};

export default Employee;
