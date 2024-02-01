import { NextApiRequest, NextApiResponse } from "next";
import { NextMiddlewareResult } from "next/dist/server/web/types";
import { NextMiddleware } from "next/server";

export default function initMiddleware(middleware: any) {
  return (req: NextApiRequest, res: NextApiResponse) => new Promise((resolve, reject) => {
    middleware(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
