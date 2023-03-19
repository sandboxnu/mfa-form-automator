import { EmployeeModel } from "@/models/models";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const models = await EmployeeModel.find({});
        res.status(200).json({ success: true, data: models });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const model = await EmployeeModel.create(req.body);
        res.status(201).json({ success: true, data: model });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
