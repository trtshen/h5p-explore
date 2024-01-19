import { NextApiRequest, NextApiResponse } from "next/types";

type ResponseData = {
  message: string;
  error?: any;
  statusCode?: number;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    console.log(req.body);
    return res.status(200).json({ message: 'Hello from Next.js!' })
  }

  return res.json({
    statusCode: 405,
    message: 'Internal Server Error',
    error: 'Method not allowed'
  });
}