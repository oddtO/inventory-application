import { db } from "../db/queries";
import type { Request, Response } from "express-serve-static-core";

async function renderPublisherForm(
  req: Request,
  res: Response,
  isImgOptional: boolean,
  actionLabel: string,
  action: string,
  nameError?: string,
  id?: number,
) {
  const publisher = id
    ? await db.getPublisherById(Number(req.params.id))
    : undefined;
  res.render("publisher-form", {
    actionLabel,
    action,
    isImgOptional,
    publisher,
    nameError,
  });
}

export async function renderNewPublisherForm(
  req: Request,
  res: Response,
  nameError?: string,
) {
  await renderPublisherForm(req, res, false, "Add", "new", nameError);
}

export async function renderUpdatePublisherForm(
  req: Request<{ id: string }>,
  res: Response,
  nameError?: string,
) {
  await renderPublisherForm(
    req,
    res,
    true,
    "Modify",
    `update/${req.params.id}`,
    nameError,
    +req.params.id,
  );
}
