import { NextApiRequest, NextApiResponse } from "next/types";
import formidable, { Files, Fields } from 'formidable';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    }, // Disable the default body parser
  },
};


const form = formidable({ multiples: false })

const isFile = (file: File | File[]): file is File => !Array.isArray(file) && file.filepath !== undefined

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const fileContent: string = await (new Promise((resolve, reject) => {
        form.parse(req, (err, _fields, files: Files) => {
          if (isFile(files.file)) {
            const fileContentBuffer = fs.readFileSync(files.file.filepath)
            const fileContentReadable = fileContentBuffer.toString('utf8')

            resolve(fileContentReadable)
          }

          reject()
        })
      }))

      // Do whatever you'd like with the file since it's already in text
      console.log(fileContent)

      res.status(200).send({ message: 'ok' })
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
