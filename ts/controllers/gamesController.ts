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

  res.render("new-game-form", { availablePublishers, availableGenres });
}

async function postNewGameForm(req: Request, res: Response) {
  const [fields, file, imgBuf] = await extractFieldsAndImage<
    "name" | "publisher" | "genres"
  >(req);
  console.log(fields.name);

  await db.addGame(
    fields.name![0],
    imgBuf,
    file.mimetype!,
    +fields.publisher![0],
    fields.genres!.map((numStr) => Number(numStr))!,
  );
  res.redirect("/");
}

export const gamesController = {
  get,
  getNewGameForm,
  postNewGameForm,
};
