import formidable, { Fields } from "formidable";
import { Files } from "formidable";
import fs from "fs";
import type { Request, Response } from "express";
import { db } from "../db/queries";
import { extractFieldsAndImage } from "../helpers/extractFields";
import { createDataUrl } from "../helpers/createDataUrl";
async function get(req: Request, res: Response) {
  const results = await db.getAllPublishers();

  const publisherList = results.map((result) => {
    return {
      b64: createDataUrl(result.mime_type, result.image.toString("base64")),
      name: result.name,
    };
  });

  console.log(publisherList[1]);

  res.render("publisher-list", { publisherList });
}

function getNewPublisherForm(req: Request, res: Response) {
  res.render("new-publisher-form");
}

async function postNewPublisherForm(req: Request, res: Response) {
  /* const form = formidable({});

  form.parse(
    req,
    async (err, fields: Fields<"name">, files: Files<"image">) => {
      const file = files!.image![0];

      const imgBuf = fs.readFileSync(file.filepath);
      await db.addPublisher(fields.name![0], imgBuf, file.mimetype!);
      res.status(200).redirect("..");
    },
  ); */

  const [fields, file, imgBuf] = await extractFieldsAndImage<"name">(req);

  await db.addPublisher(fields.name![0], imgBuf, file.mimetype!);

  res.status(200).redirect("..");
}

export const publishersController = {
  get,
  getNewPublisherForm,
  postNewPublisherForm,
};
