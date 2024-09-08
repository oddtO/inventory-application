import formidable, { Fields } from "formidable";
import { Files } from "formidable";
import fs from "fs";
import type { Request, Response } from "express-serve-static-core";
import { db } from "../db/queries";
import { extractFieldsAndImage } from "../helpers/extractFields";
import { createDataUrl } from "../helpers/createDataUrl";
import {
  renderNewPublisherForm,
  renderUpdatePublisherForm,
} from "../helpers/renderPublisherForm";
import {
  getNameValidation,
  uniquePublisherName,
} from "../helpers/getFormValidators";
import { ValidationError, validationResult } from "express-validator";

type baseItemList = Awaited<ReturnType<typeof db.getAllPublishers>>;
type baseItem = baseItemList[number];

export type PublisherItem = baseItem & { b64: string };
async function get(req: Request, res: Response) {
  const results = (await db.getAllPublishers()) as PublisherItem[];

  results.forEach((result) => {
    result.b64 = createDataUrl(
      result.mime_type,
      result.image.toString("base64"),
    );
  });

  res.render("publisher-list", { publisherList: results });
}

async function getNewPublisherForm(req: Request, res: Response) {
  await renderNewPublisherForm(req, res);
}

const postNewPublisherForm = [
  ...getNameValidation(),
  ...uniquePublisherName(),
  FpostNewPublisherForm,
];

async function FpostNewPublisherForm(req: Request, res: Response) {
  // const [fields, file, imgBuf] = await extractFieldsAndImage<"name">(req);

  const fields = req.body;
  const imgBuf = req.imgBuf;
  const file = req.imgFile;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorsMap = errors.mapped() as Record<"name", ValidationError>;
    res.status(422);
    await renderNewPublisherForm(req, res, errorsMap.name?.msg);
    return;
  }

  await db.addPublisher(fields.name![0], imgBuf!, file.mimetype!);
  res.redirect("/");
}

async function getUpdatePublisherForm(
  req: Request<{ id: string }>,
  res: Response,
) {
  await renderUpdatePublisherForm(req, res);
  // const publisher = await db.getPublisherById(Number(req.params.id));
  //
  // res.render("publisher-form", {
  //   actionLabel: "Modify",
  //   action: `update/${req.params.id}`,
  //   publisher,
  //   isImageOptional: true,
  // });
}

const postUpdatePublisherForm = [
  ...getNameValidation(),
  ...uniquePublisherName(),
  FpostUpdatePublisherForm,
];
async function FpostUpdatePublisherForm(
  req: Request<{ id: string }>,
  res: Response,
) {
  // const [fields, imgFile, imgBuf] = await extractFieldsAndImage<"name">(req, {
  //   allowEmptyFiles: true,
  //   minFileSize: 0,
  // });

  const fields = req.body;
  const imgBuf = req.imgBuf;
  const imgFile = req.imgFile;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorsMap = errors.mapped() as Record<"name", ValidationError>;
    res.status(422);
    await renderUpdatePublisherForm(req, res, errorsMap.name?.msg);
    return;
  }

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

export async function postDeletePublisher(
  req: Request<{ id: string }>,
  res: Response,
) {
  await db.deletePublisherById(+req.params.id);
  res.redirect("/");
}
export const publishersController = {
  get,
  getNewPublisherForm,
  postNewPublisherForm,
  getUpdatePublisherForm,
  postUpdatePublisherForm,
  postDeletePublisher,
};
