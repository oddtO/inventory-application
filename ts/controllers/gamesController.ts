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
import {
  getGameFormValidators,
  uniqueGameName,
} from "../helpers/getFormValidators";
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

async function get(
  req: Request<
    object,
    object,
    object,
    { genreid?: string; publisherid?: string }
  >,
  res: Response,
) {
  const genreFilterId = req.query.genreid ? +req.query.genreid : null;
  const publisherFilterId = req.query.publisherid
    ? +req.query.publisherid
    : null;
  const games = (await db.getAllGames(
    genreFilterId,
    publisherFilterId,
  )) as GameItem[];

  games.forEach((game) => {
    game.b64 = createDataUrl(game.mime_type, game.image.toString("base64"));
  });

  let titleText = "Games";

  if (genreFilterId) {
    const genreName = await db.convertGenreIdToName(genreFilterId);
    titleText += ` with genre "${genreName ?? ""}"`;
  }

  if (publisherFilterId) {
    const publisherName = await db.convertPublisherIdToName(publisherFilterId);
    titleText += ` with publisher "${publisherName ?? ""}"`;
  }

  res.render("game-list", {
    gameList: games,
    genreFilterId,
    publisherFilterId,
    titleText,
  });
}

async function getNewGameForm(req: Request, res: Response) {
  await renderGameAddForm(req, res);
}

const postNewGameForm = [
  ...getGameFormValidators(),
  ...uniqueGameName(),
  FpostNewGameForm,
];
async function FpostNewGameForm(
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

const postUpdateGameForm = [
  ...getGameFormValidators(),
  ...uniqueGameName(),
  FpostUpdateGameForm,
];

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
