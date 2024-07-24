import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Your code logic goes here

  res.status(200).json({ message: 'Hello from the API endpoint!' });
}
