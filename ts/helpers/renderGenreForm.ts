import { db } from "../db/queries";
import type { Request, Response } from "express-serve-static-core";

async function renderGenreForm(
  req: Request,
  res: Response,
  isImgOptional: boolean,
  actionLabel: string,
  action: string,
  nameError?: string,
  id?: number,
) {
  const genre = id ? await db.getGenreById(Number(req.params.id)) : undefined;
  res.render("genre-form", {
    actionLabel,
    action,
    isImgOptional,
    genre,
    nameError,
  });
}

export async function renderNewGenreForm(
  req: Request,
  res: Response,
  nameError?: string,
) {
  await renderGenreForm(req, res, false, "Add", "new", nameError);
}

export async function renderUpdateGenreForm(
  req: Request<{ id: string }>,
  res: Response,
  nameError?: string,
) {
  await renderGenreForm(
    req,
    res,
    true,
    "Modify",
    `update/${req.params.id}`,
    nameError,
    +req.params.id,
  );
}
