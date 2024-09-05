import type { Request, Response } from "express-serve-static-core";
import { db } from "../db/queries";
import { extractFieldsAndImage } from "../helpers/extractFields";
import { createDataUrl } from "../helpers/createDataUrl";
import {
  renderNewGenreForm,
  renderUpdateGenreForm,
} from "../helpers/renderGenreForm";
import { ValidationError, validationResult } from "express-validator";
import { getNameValidation } from "../helpers/getFormValidators";

type baseItemList = Awaited<ReturnType<typeof db.getAllGenres>>;
type baseItem = baseItemList[number];

type genreItem = baseItem & { b64: string };
async function get(req: Request, res: Response) {
  const results = (await db.getAllGenres()) as genreItem[];
  results.forEach((result) => {
    result.b64 = createDataUrl(
      result.mime_type,
      result.image.toString("base64"),
    );
  });

  res.render("genres-list", { genreList: results });
}

async function getNewGenreForm(req: Request, res: Response) {
  await renderNewGenreForm(req, res);
}

const postNewGenreForm = [...getNameValidation(), FpostNewGenreForm];
async function FpostNewGenreForm(req: Request, res: Response) {
  const fields = req.body;
  const imgBuf = req.imgBuf;
  const imgFile = req.imgFile;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorsMap = errors.mapped() as Record<"name", ValidationError>;
    res.status(422);
    await renderNewGenreForm(req, res, errorsMap.name?.msg);
    return;
  }
  await db.addNewGenre(fields.name![0], imgBuf!, imgFile.mimetype!);

  res.redirect("..");
}

async function getUpdateGenreForm(req: Request<{ id: string }>, res: Response) {
  await renderUpdateGenreForm(req, res);
}

const postUpdateGenreForm = [...getNameValidation(), FpostUpdateGenreForm];
async function FpostUpdateGenreForm(
  req: Request<{ id: string }>,
  res: Response,
) {
  const fields = req.body;
  const imgBuf = req.imgBuf;
  const imgFile = req.imgFile;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorsMap = errors.mapped() as Record<"name", ValidationError>;
    res.status(422);
    await renderUpdateGenreForm(req, res, errorsMap.name?.msg);
    return;
  }
  if (imgFile.size == 0)
    await db.updateGenre(+req.params.id, fields!.name![0], null, null);
  else
    await db.updateGenre(
      +req.params.id,
      fields!.name![0],
      imgBuf!,
      imgFile.mimetype!,
    );
  res.redirect("..");
}

async function postDeleteGenre(req: Request<{ id: string }>, res: Response) {
  await db.deleteGenreById(+req.params.id);
  res.redirect("/");
}
export const genresController = {
  get,
  getNewGenreForm,
  postNewGenreForm,
  getUpdateGenreForm,
  postUpdateGenreForm,
  postDeleteGenre,
};
