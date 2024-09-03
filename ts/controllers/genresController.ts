import type { Request, Response } from "express";
import { db } from "../db/queries";
import { extractFieldsAndImage } from "../helpers/extractFields";
import { createDataUrl } from "../helpers/createDataUrl";

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

function getNewGenreForm(req: Request, res: Response) {
  res.render("genre-form", {
    actionLabel: "Add",
    action: "new",
  });
}

async function postNewGenreForm(req: Request, res: Response) {
  const [fields, imgFile, imgBuf] = await extractFieldsAndImage<"name">(req);

  await db.addNewGenre(fields.name![0], imgBuf!, imgFile.mimetype!);

  res.redirect("..");
}

async function getUpdateGenreForm(req: Request<{ id: string }>, res: Response) {
  const genre = await db.getGenreById(Number(req.params.id));

  res.render("genre-form", {
    actionLabel: "Modify",
    action: `update/${req.params.id}`,
    genre,
    isImageOptional: true,
  });
}

async function postUpdateGenreForm(
  req: Request<{ id: string }>,
  res: Response,
) {
  const [fields, imgFile, imgBuf] = await extractFieldsAndImage<"name">(req, {
    allowEmptyFiles: true,
    minFileSize: 0,
  });

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
export const genresController = {
  get,
  getNewGenreForm,
  postNewGenreForm,
  getUpdateGenreForm,
  postUpdateGenreForm,
};
