import { getDb } from "@/lib/conn";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';

// Initialize CORS middleware - set your options here
const cors = initMiddleware(
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: 'http://localhost:4200', // Adjust this to your frontend origin
  })
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  
  if (req.method === 'POST') {
    return res.status(404).json({ message: 'Invalid API Request.' });
  }

  const db = getDb();
  const result = await db.collection('h5p').find({
    uploads: { $exists: true },
    dir: { $exists: true }, 
    Bucket: process.env.AWS_S3_BUCKET_NAME,
  }).toArray();

  return res.status(200).json({ result });
}