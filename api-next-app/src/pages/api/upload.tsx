import { NextApiRequest, NextApiResponse } from "next/types";
import formidable, { Files, Fields, File } from 'formidable';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { getDb } from "../../lib/conn";
import { Binary } from "mongodb";

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
        file.filepath = path.join(process.cwd(), 'uploads', file.originalFilename || file.newFilename);
        filepath = file.filepath;
        console.log('fileBegin', filepath);
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
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);

            resolve({ fields, files });
          });
          
        });
      });


      const contentDir = path.join(process.cwd(), 'content');

      // Read the content directory and get a list of file paths
      const filesInContentDir = await fs.promises.readdir(contentDir);
      console.log('filesInContentDir', filesInContentDir);

      const fileContents = await Promise.all(
        filesInContentDir.map(async (filename) => {
          const filePath = path.join(contentDir, filename);

          // Check if the path is a file and not a directory
          const stat = await fs.promises.stat(filePath);
          if (stat.isFile()) {
            // Read the file content
            const content = await fs.promises.readFile(filePath);
            // Return the filename and its binary content
            return { filename, content: new Binary(content) };
          }
        })
      );

      // Filter out undefined values (from directories)
      const filteredFileContents = fileContents.filter(content => content !== undefined);

      // Get the MongoDB connection
      const db = getDb();
      db.collection('h5p').insertOne({ ...fields, files: filteredFileContents });

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
