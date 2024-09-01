import { db } from "../db/queries";
import formidable, { Files } from "formidable";
import fs from "fs";
import type { Request, Response } from "express";
async function get(req: Request, res: Response) {
  const results = await db.getAllTest();
  const b64 = results[1].data?.toString("base64");
  // CHANGE THIS IF THE IMAGE YOU ARE WORKING WITH IS .jpg OR WHATEVER
  const mimeType = "image/png"; // e.g., image/png

  res.render("index", { imgUrl: `data:${mimeType};base64,${b64}` });
  // res.send(`<img src="data:${mimeType};base64,${b64}" />`);
}
async function post(
  req: Request<object, object, { image: File }>,
  res: Response,
) {
  const form = formidable({});

  console.log(req.body);
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
