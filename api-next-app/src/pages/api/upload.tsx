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
      form.on('fileBegin', (name, file: File) => {
        // const nameWithoutExtension = file.originalFilename?.replace('.h5p', '') || file.newFilename?.replace('.h5p', '');
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
      const filesInContentDir = await fs.promises.readdir(newFilePath);
      console.log('filesInContentDir', filesInContentDir);

      const fileContents = await Promise.all(
        filesInContentDir.map(async (filename) => {
          const filePath = path.join(newFilePath, filename);

          // Check if the path is a file and not a directory
          const stat = await fs.promises.stat(filePath);
          if (stat.isFile()) {
            // Read the file content
            const content = await fs.promises.readFile(filePath);
            // Return the filename and its binary content
            // return { filename, content: new Binary(content) };
            return { filename, content };
          }
        })
      );

      // Filter out undefined values (from directories)
      const filteredFileContents = fileContents.filter(content => content !== undefined);

      // Get the MongoDB connection
      // const db = getDb();
      // db.collection('h5p').insertOne({ ...fields, files: filteredFileContents });

      console.log('filteredFileContents', filteredFileContents);
      // Upload the files to S3
      /* const promises = filteredFileContents.map(async (fileContent) => {
        const { filename, content } = fileContent;
        const params = {
          Bucket: 'h5p',
          Key: filename,
          Body: content,
        };
        console.log('params', params);
        return params;
        // return s3.upload(params).promise();
      }); */


      // Process the files and fields as needed
      return res.status(200).json({ fields, files, fileContents, message: 'File uploaded and script executed successfully' });
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

export default handler;
