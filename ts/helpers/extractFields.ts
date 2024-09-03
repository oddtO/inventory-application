import formidable from "formidable";
import fs from "fs";
import type { Request } from "express";
import type { Fields, Files, File, Options } from "formidable";
export function extractFieldsAndImage<T extends string>(
  req: Request,
  options = {} as Options,
): Promise<[Fields<T>, File, Buffer]> {
  return new Promise((resolve, reject) => {
    const form = formidable(options);

    form.parse(req, async (err, fields: Fields, files: Files<"image">) => {
      if (err) reject(err);
      const file = files!.image![0];

      const imgBuf = fs.readFileSync(file.filepath);

      resolve([fields, file, imgBuf] as const);
    });
  });
}
