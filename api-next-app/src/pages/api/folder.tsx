import AWS from 'aws-sdk';
import s3 from '../../lib/aws-s3';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(400).json({
      error: 'Only POST requests allowed',
    });
  }

  if (!req.body.folder) {
    console.log('req.body', req.body.folder);
    return res.status(400).json({
      error: 'Missing folder',
      messzge: req.body.folder,   
    });
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || 'app-sschaw',
    Prefix: req.body.folder,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    console.log('s3data', data);
    return data.Contents.map((file) => {
      return {
        fileName: file.Key,
        url: s3.getSignedUrl('getObject', {
          Bucket: params.Bucket,
          Key: file.Key,
          Expires: 60, // Expires in 60 seconds
        }),
      };
    });
  } catch (error) {
    console.error("Error in fetching objects: ", error);
    throw error;
  }
}