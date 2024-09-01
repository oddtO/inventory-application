import type { Request, Response } from "express";
import { db } from "../db/queries";
import { extractFieldsAndImage } from "../helpers/extractFields";
import { createDataUrl } from "../helpers/createDataUrl";

async function get(req: Request, res: Response) {
  const results = await db.getAllGenres();

  const genreList = results.map((result) => {
    return {
      name: result.name,
      b64: createDataUrl(result.mime_type, result.image.toString("base64")),
    };
  });

  res.render("genres-list", { genreList });
}

function getNewGenreForm(req: Request, res: Response) {
  res.render("new-genre-form");
}

async function postNewGenreForm(req: Request, res: Response) {
  const [fields, imgFile, imgBuf] = await extractFieldsAndImage<"name">(req);

  await db.addNewGenre(fields.name![0], imgBuf, imgFile.mimetype!);

  res.redirect("..");
}

export const genresController = {
  get,
  getNewGenreForm,
  postNewGenreForm,
};
