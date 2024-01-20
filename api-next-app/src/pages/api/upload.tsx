import { NextApiRequest, NextApiResponse } from "next/types";
import formidable, { Files, Fields } from 'formidable';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

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
      form.on('fileBegin', function (name, file) {
        file.filepath = path.join(process.cwd(), 'uploads', file.originalFilename);
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
          console.log(`bash ${process.cwd()}/h5p_extract.sh ${filepath}`);
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

      // Process the files and fields as needed
      return res.status(200).json({ fields, files, message: 'File uploaded and script executed successfully' });
    } catch (err) {
      res.status(400).send({ message: 'Bad Request' })
    }
  } else {
    return res.status(405).json({
      message: 'Internal Server Error',
      error: 'Method not allowed'
    });
  }
}

export default handler;
