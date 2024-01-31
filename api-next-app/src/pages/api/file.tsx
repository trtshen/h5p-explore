import { NextApiRequest, NextApiResponse } from 'next';
import s3 from '../../lib/aws-s3';
import { S3 } from 'aws-sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filename } = req.query;

  if (!filename) {
    res.status(400).send('Missing filename');
    return;
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || 'app-sschaw',
    Key: filename,
    Expires: 30,
  };

  console.log('filename', filename);
  
  try {
    const url = s3.getSignedUrl('getObject', params);
    res.status(200).send(url);
  } catch (error) {
    res.status(500).send(error);
  }
}
