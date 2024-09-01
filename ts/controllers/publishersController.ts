import formidable, { Fields } from "formidable";
import { Files } from "formidable";
import fs from "fs";
import type { Request, Response } from "express";
import { db } from "../db/queries";
import { name } from "ejs";
async function get(req: Request, res: Response) {
  const results = await db.getAllPublishers();
  // const b64 = results[0].image?.toString("base64");
  // const mimeType = results[0].mime_type;
  // const imgUrl = `data:${mimeType};base64,${b64}`;

  const publisherList = results.map((result) => {
    return {
      b64: `data:${result.mime_type};base64,${result.image?.toString("base64")}`,
      name: result.name,
    };
  });

  console.log(publisherList[1]);

  // const results = await db.getAllTest();
  // const b64 = results[1].data?.toString("base64");
  // // CHANGE THIS IF THE IMAGE YOU ARE WORKING WITH IS .jpg OR WHATEVER
  // const mimeType = "image/png"; // e.g., image/png
  //
  // const imgUrl = `data:${mimeType};base64,${b64}`;

  res.render("publisher-list", { publisherList });
}

function getNewPublisherForm(req: Request, res: Response) {
  res.render("new-publisher-form");
}

function postNewPublisherForm(req: Request, res: Response) {
  const form = formidable({});

  form.parse(
    req,
    async (err, fields: Fields<"name">, files: Files<"image">) => {
      const file = files!.image![0];

      const imgBuf = fs.readFileSync(file.filepath);
      await db.addPublisher(fields.name![0], imgBuf, file.mimetype!);
      res.status(200).redirect("..");
    },
  );
}

export const publishersController = {
  get,
  getNewPublisherForm,
  postNewPublisherForm,
};
