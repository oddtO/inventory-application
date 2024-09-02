import { db } from "../db/queries";
import type { Request, Response } from "express";
async function getNewGameForm(req: Request, res: Response) {
  const availablePublishers = await db.getAllPublisherNames();
  const availableGenres = await db.getAllGenreNames();

  res.render("new-game-form", { availablePublishers, availableGenres });
}

export const gamesController = {
  getNewGameForm,
};
