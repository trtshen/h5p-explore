import type { NextApiRequest, NextApiResponse } from 'next'
import { getDb } from '../../lib/conn';

type ResponseData = {
  message: string;
  error?: any;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'GET') { 
    const db = getDb(); // Replace with your database name
    try {
      db.collection('testing1').insertOne({ inserted: true });
      return res.status(200).json({ message: 'Hello from Next.js 123!' })
    } catch (error: any) {
      res.status(500).json({ message: 'Internal Server Error', error});
    }
  }

  if (req.method === 'POST') {
    console.log(req.body);
    return res.status(200).json({ message: 'Hello from Next.js!' })
  }
}