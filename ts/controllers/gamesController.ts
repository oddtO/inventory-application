import { db } from "../db/queries";
import type { Request, Response } from "express";
import { extractFieldsAndImage } from "../helpers/extractFields";
import { createDataUrl } from "../helpers/createDataUrl";

type baseGameItems = Awaited<ReturnType<typeof db.getAllGames>>;
type baseGameItem = baseGameItems[0];

type GameItem = baseGameItem & { b64: string };
async function get(req: Request, res: Response) {
  const games = (await db.getAllGames()) as GameItem[];

  games.forEach((game) => {
    game.b64 = createDataUrl(game.mime_type, game.image.toString("base64"));
  });
  res.render("game-list", { gameList: games });
}

async function getNewGameForm(req: Request, res: Response) {
  const availablePublishers = await db.getAllPublisherNames();
  const availableGenres = await db.getAllGenreNames();

  res.render("game-form", {
    actionLabel: "Add",
    action: "new",
    availablePublishers,
    availableGenres,
  });
}

async function postNewGameForm(req: Request, res: Response) {
  const [fields, file, imgBuf] = await extractFieldsAndImage<
    "name" | "publisher" | "genres"
  >(req);

  await db.addGame(
    fields.name![0],
    imgBuf!,
    file.mimetype!,
    +fields.publisher![0],
    fields.genres!.map((numStr) => Number(numStr))!,
  );
  res.redirect("/");
}

async function getUpdateGameForm(req: Request<{ id: string }>, res: Response) {
  const gameP = db.getGameById(Number(req.params.id));

  const availablePublishersP = db.getAllPublisherNames();
  const availableGenresP = db.getAllGenreNames();

  const [gameWrapper, availablePublishers, availableGenres] = await Promise.all(
    [gameP, availablePublishersP, availableGenresP],
  );

  const game = gameWrapper[0];
  res.render("game-form", {
    actionLabel: "Modify",
    action: `update/${req.params.id}`,
    game,
    isImageOptional: true,
    availablePublishers,
    availableGenres,
    selectedId: +game.publisher_id,
    checkedGenreIds: game.genreids,
    isImgOptional: true,
  });
}

async function postUpdateGameForm(req: Request<{ id: string }>, res: Response) {
  const [fields, imgFile, imgBuf] = await extractFieldsAndImage<
    "name" | "publisher" | "genres"
  >(req, {
    allowEmptyFiles: true,
    minFileSize: 0,
  });

  if (imgFile.size == 0)
    await db.updateGame(
      +req.params.id,
      fields!.name![0],
      +fields!.publisher![0],
      null,
      null,
      fields.genres!,
    );
  else
    await db.updateGame(
      +req.params.id,
      fields!.name![0],
      +fields!.publisher![0],
      imgBuf,
      imgFile.mimetype,
      fields.genres!,
    );
  res.redirect("..");
}
export const gamesController = {
  get,
  getNewGameForm,
  postNewGameForm,
  getUpdateGameForm,
  postUpdateGameForm,
};
