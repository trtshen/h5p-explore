import { getDb } from "@/lib/conn";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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