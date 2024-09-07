import { Request, Response, NextFunction } from "express-serve-static-core";
import express from "express";
import path from "path";
import { indexController } from "./controllers/indexController";
import publishersRoute from "./routes/publishers";
import genresRoute from "./routes/genres";
import gamesRoute from "./routes/games";
import { extractFieldsAndImage } from "./helpers/extractFields";
import { Options, Part } from "formidable";
import ParamsDictionary from "express-serve-static-core";
import { format } from "date-fns";
const app = express();

declare global {
  export interface DateConstructor {
    getCurDateFormatted: () => string;
  }
}

Date.getCurDateFormatted = () => format(Date.now(), "eee MMM dd yyyy");
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views/"));

app.post("*", parseData);

async function parseData(req: Request, res: Response, next: NextFunction) {
  if (req.originalUrl.match(/delete/)) handleDeleteReq(req, res, next);

  const defaultFileOptions: Options = {
    maxFileSize: 2 * 1024 * 1024,
    maxFiles: 1,
    filter: function ({ name, originalFilename, mimetype }: Part) {
      // keep only images
      return Boolean(mimetype) && mimetype!.includes("image");
    },
  };
  const isUpdating = req.originalUrl.match(/update/);

  if (isUpdating) {
    defaultFileOptions.allowEmptyFiles = true;
    defaultFileOptions.minFileSize = 0;
  }
  let fields, imgFile, imgBuf;
  try {
    [fields, imgFile, imgBuf] = await extractFieldsAndImage<
      "name" | "publisher" | "genres"
    >(req, defaultFileOptions);
  } catch (error) {
    next(error);
    return;
  }
  req.body = fields;
  req.imgFile = imgFile;
  req.imgBuf = imgBuf;
  next();
}

async function handleDeleteReq(
  req: Request<object, object, { password: string }>,
  res: Response,
  next: NextFunction,
) {
  if (req.body.password) {
    if (req.body.password === process.env.DELETE_ALLOW_PASSWORD) {
      return next();
    }
  }
  res.render("secret-pass-form", {
    urlAction: req.originalUrl,
  });
}

const port = process.env.PORT || 3000;

app.use("/games", gamesRoute);
app.use("/genres", genresRoute);
app.use("/publishers", publishersRoute);
app.get("/", indexController.get);
app.post("/", indexController.post);
app.get("/search", indexController.getSearch);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).render("error-page");
});
