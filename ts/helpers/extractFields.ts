import formidable from "formidable";
import fs from "fs";
import type { Request } from "express";
import type { Fields, Files, File } from "formidable";
export function extractFieldsAndImage<T extends string>(
  req: Request,
): Promise<[Fields<T>, File, Buffer]> {
  return new Promise((resolve, reject) => {
    const form = formidable({});

    form.parse(req, async (err, fields: Fields, files: Files<"image">) => {
      if (err) reject(err);
      const file = files!.image![0];

      const imgBuf = fs.readFileSync(file.filepath);

      resolve([fields, file, imgBuf] as const);
    });
  });
}
