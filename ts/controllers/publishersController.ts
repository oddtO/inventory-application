import formidable, { Fields } from "formidable";
import { Files } from "formidable";
import fs from "fs";
import type { Request, Response } from "express";
import { db } from "../db/queries";
import { extractFieldsAndImage } from "../helpers/extractFields";
import { createDataUrl } from "../helpers/createDataUrl";

type baseItemList = Awaited<ReturnType<typeof db.getAllPublishers>>;
type baseItem = baseItemList[number];

type genreItem = baseItem & { b64: string };
async function get(req: Request, res: Response) {
  const results = (await db.getAllPublishers()) as genreItem[];

  results.forEach((result) => {
    result.b64 = createDataUrl(
      result.mime_type,
      result.image.toString("base64"),
    );
  });

  res.render("publisher-list", { publisherList: results });
}

function getNewPublisherForm(req: Request, res: Response) {
  res.render("publisher-form", { actionLabel: "Add", action: "new" });
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

  await db.addPublisher(fields.name![0], imgBuf!, file.mimetype!);
}

async function getUpdatePublisherForm(
  req: Request<{ id: string }>,
  res: Response,
) {
  const publisher = await db.getPublisherById(Number(req.params.id));

  res.render("publisher-form", {
    actionLabel: "Modify",
    action: `update/${req.params.id}`,
    publisher,
    isImageOptional: true,
  });
}

async function postUpdatePublisherForm(
  req: Request<{ id: string }>,
  res: Response,
) {
  const [fields, imgFile, imgBuf] = await extractFieldsAndImage<"name">(req, {
    allowEmptyFiles: true,
    minFileSize: 0,
  });

  if (imgFile.size == 0)
    await db.updatePublisher(+req.params.id, fields!.name![0], null, null);
  else
    await db.updatePublisher(
      +req.params.id,
      fields!.name![0],
      imgBuf!,
      imgFile.mimetype!,
    );
  res.redirect("..");
}
export const publishersController = {
  get,
  getNewPublisherForm,
  postNewPublisherForm,
  getUpdatePublisherForm,
  postUpdatePublisherForm,
};
