import { db } from "../db/queries";
import type { Request, Response } from "express-serve-static-core";

async function renderGameForm(
  req: Request,
  res: Response,
  actionLabel: string,
  action: string,
  isImgOptional: boolean,
  nameError?: string,
  publisherError?: string,
  genresError?: string,
  id?: number,
) {
  const gameP = id ? db.getGameById(id) : Promise.resolve(undefined);

  const availablePublishersP = db.getAllPublisherNames();
  const availableGenresP = db.getAllGenreNames();

  const [gameWrapper, availablePublishers, availableGenres] = await Promise.all(
    [gameP, availablePublishersP, availableGenresP],
  );
  res.render("game-form", {
    actionLabel,
    action,
    availablePublishers,
    availableGenres,
    nameError,
    publisherError,
    genresError,
    game: gameWrapper ? gameWrapper[0] : undefined,
    selectedId: gameWrapper ? +gameWrapper[0].publisher_id : undefined,
    checkedGenreIds: gameWrapper ? gameWrapper[0].genreids : undefined,
    isImgOptional,
  });
}
export async function renderGameUpdateForm(
  req: Request,
  res: Response,
  nameError?: string,
  publisherError?: string,
  genresError?: string,
) {
  await renderGameForm(
    req,
    res,
    "Update",
    `update/${req.params.id}`,
    true,
    nameError,
    publisherError,
    genresError,
    +req.params.id,
  );
}

export async function renderGameAddForm(
  req: Request,
  res: Response,
  nameError?: string,
  publisherError?: string,
  genresError?: string,
) {
  await renderGameForm(
    req,
    res,
    "Add",
    `new`,
    false,
    nameError,
    publisherError,
    genresError,
  );
}
