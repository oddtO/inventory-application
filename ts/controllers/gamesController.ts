import { db } from "../db/queries";
import type {
  Request,
  Response,
  NextFunction,
  ParamsDictionary,
} from "express-serve-static-core";
import { extractFieldsAndImage } from "../helpers/extractFields";
import { createDataUrl } from "../helpers/createDataUrl";
import { body, ValidationError, validationResult } from "express-validator";
import { getGameFormValidators } from "../helpers/getFormValidators";
import { IGetGameByIdResult, NumberOrString } from "../db/games/queries.types";
import { IGetPublisherNamesResult } from "../db/publishers/queries.types";
import {
  renderGameAddForm,
  renderGameUpdateForm,
} from "../helpers/renderGameForm";
type baseGameItems = Awaited<ReturnType<typeof db.getAllGames>>;
type baseGameItem = baseGameItems[0];

export type GameItem = baseGameItem & { b64: string };

type GameItemFields = "name" | "publisher" | "genres";

async function get(req: Request, res: Response) {
  const games = (await db.getAllGames()) as GameItem[];

  games.forEach((game) => {
    game.b64 = createDataUrl(game.mime_type, game.image.toString("base64"));
  });

  res.render("game-list", { gameList: games });
}

async function getNewGameForm(req: Request, res: Response) {
  await renderGameAddForm(req, res);
}

const postNewGameForm = [...getGameFormValidators(), postNewGameFormF];
async function postNewGameFormF(
  req: Request<ParamsDictionary, object, Record<GameItemFields, string[]>>,
  res: Response,
) {
  const results = validationResult(req);

  const fields = req.body;
  const file = req.imgFile;
  const imgBuf = req.imgBuf;
  if (!results.isEmpty()) {
    const errors = results.mapped() as Record<GameItemFields, ValidationError>;
    res.status(422);

    await renderGameAddForm(
      req,
      res,
      errors.name?.msg,
      errors.publisher?.msg,
      errors.genres?.msg,
    );
    return;
  }

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
  await renderGameUpdateForm(req, res);
}

const postUpdateGameForm = [...getGameFormValidators(), FpostUpdateGameForm];

async function FpostUpdateGameForm(
  req: Request<{ id: string }>,
  res: Response,
) {
  const results = validationResult(req);

  if (!results.isEmpty()) {
    const errors = results.mapped() as Record<GameItemFields, ValidationError>;
    res.status(422);

    await renderGameUpdateForm(
      req,
      res,
      errors.name?.msg,
      errors.publisher?.msg,
      errors.genres?.msg,
    );
    return;
  }

  const fields = req.body;
  const imgFile = req.imgFile;
  const imgBuf = req.imgBuf;

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

async function postDeleteGame(req: Request<{ id: string }>, res: Response) {
  console.log("called");
  await db.deleteGameById(+req.params.id);
  res.redirect("/");
}

export const gamesController = {
  get,
  getNewGameForm,
  postNewGameForm,
  getUpdateGameForm,
  postUpdateGameForm,
  postDeleteGame,
};
