import { NextApiRequest, NextApiResponse } from "next/types";
import formidable, { Files, Fields, File } from 'formidable';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { getDb } from "../../lib/conn";
import { Binary } from "mongodb";
import s3 from '../../lib/aws-s3';

export const config = {
  api: {
    bodyParser: false // Disable the default body parser
  },
};


const form = formidable({ 
  multiples: false,
  uploadDir: path.join(process.cwd(), 'uploads'),
  keepExtensions: true,
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      let filepath = '';
      let basename = '';
      form.on('fileBegin', (name, file: File) => {
        // const nameWithoutExtension = file.originalFilename?.replace('.h5p', '') || file.newFilename?.replace('.h5p', '');
        basename = file.originalFilename?.replace('.h5p', '') || file.newFilename?.replace('.h5p', '');
        file.filepath = path.join(process.cwd(), 'uploads', file.originalFilename || file.newFilename);
        filepath = file.filepath;
        console.log('fileBegin', file.filepath);
      });

      const { fields, files } = await new Promise<{ fields: Fields; files: Files; }>((resolve, reject) => {
        form.once('end', () => {
          console.log('Done parsing form!');
        });

        form.parse(req, (err, fields: Fields, files: Files) => {
          if (err) reject(err);

          const file = files.file;
          exec(`bash ${process.cwd()}/h5p_extract.sh ${filepath}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return res.status(500).json({ error: 'Error executing the script' });
            }
            // console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);

            resolve({ fields, files });
          });
        });
      });
      
      console.log('filepath2', filepath);
      
      // Read the content directory and get a list of file paths
      const newFilePath = filepath.replace('.h5p', '');
      // const filesInContentDir = await fs.promises.readdir(newFilePath);
      // console.log('filesInContentDir', filesInContentDir);

      const fileContents = await readDirectoryRecursively(newFilePath);


      console.log('fileContents', fileContents);
      
      // Filter out undefined values (from directories)
      const filteredFileContents = fileContents.filter(content => content !== undefined);

      console.log('filteredFileContents', filteredFileContents);
      // Upload the files to S3
      const promises = filteredFileContents.map(async (fileContent) => {
        const { filename, content } = fileContent;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME || 'h5p-contents',
          Key: `${basename}/${filename}`,
          Body: content,
        };
        return s3.upload(params).promise();
      });

      const uploads = await Promise.all(promises);
      console.log('All files uploaded to S3');

      // Get the MongoDB connection
      const db = getDb();
      db.collection('h5p').insertOne({
        uploads,
      });

      // Process the files and fields as needed
      return res.status(200).json({ uploads, message: 'File uploaded and script executed successfully' });
    } catch (err) {
      res.status(400).send({ message: `Error uploading file: ${err}` })
    }
  } else {
    return res.status(405).json({
      message: 'Internal Server Error',
      error: 'Method not allowed'
    });
  }
}

async function readDirectoryRecursively(dir: string, parentPath: string = ''): Promise<{ filename: string, content: Buffer }[]> {
  let fileContents: { filename: string, content: Buffer }[] = [];
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(parentPath, entry.name);

    if (entry.isDirectory()) {
      // If entry is a directory, recursively read its contents
      fileContents = [
        ...fileContents,
        ...(await readDirectoryRecursively(fullPath, relativePath)),
      ];
    } else {
      // If entry is a file, read its content
      const content = await fs.promises.readFile(fullPath);
      fileContents.push({ filename: relativePath, content });
    }
  }

  return fileContents;
}


export default handler;
