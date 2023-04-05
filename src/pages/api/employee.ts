import { EmployeeModel } from "@/models/models";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import { z } from "zod";

const newEmployeeObject = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().email(),
});

const getEmployees = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const employees = await EmployeeModel.find({});
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    res.status(400).json({ success: false, error: error })
  }
};

const createNewEmployee = async (req: NextApiRequest, res: NextApiResponse) => {
  const newEmployee = newEmployeeObject.safeParse(req.body);  
  
  if (!newEmployee.success) { //checks for any issues validating request body  
    res.status(400).json({ newEmployee }); 
    return;
  }

  try {
    const createdEmployee = await EmployeeModel.create(newEmployee.data);
    res.status(201).json({ success: true, data: createdEmployee });
  } catch(error) {
    res.status(400).json({ success: false, error: error });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  console.log(method);

  await dbConnect();

  switch (method) {
    case "GET":
      getEmployees(req, res);
      break;
    case "POST":
      createNewEmployee(req, res);
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
