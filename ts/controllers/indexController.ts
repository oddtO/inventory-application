import { db } from "../db/queries";
import formidable, { Files } from "formidable";
import fs from "fs";
import type { Request, Response } from "express";
import type { GameItem } from "./gamesController";
import { createDataUrl } from "../helpers/createDataUrl";
async function get(req: Request, res: Response) {
  const [gameCount, publisherCount, genreCount, latestGames] =
    await Promise.all([
      db.countGames(),
      db.countPublishers(),
      db.countGenres(),
      db.getFiveLatestGames() as unknown as Promise<GameItem[]>,
    ]);

  latestGames.forEach((game) => {
    game.b64 = createDataUrl(game.mime_type, game.image.toString("base64"));
  });

  res.render("index", {
    gameCount: gameCount[0].count,
    publisherCount: publisherCount[0].count,
    genreCount: genreCount[0].count,
    gameList: latestGames,
  });
  // res.send(`<img src="data:${mimeType};base64,${b64}" />`);
}
async function post(
  req: Request<object, object, { image: File }>,
  res: Response,
) {
  const form = formidable({});

  form.parse(req, async (err, fields, files: Files<"image">) => {
    const file = files!.image![0];

    const buf = fs.readFileSync(file.filepath);
    await db.addImgTest(buf);

    res.redirect("/");
  });
}
export const indexController = {
  get,
  post,
};
