import { Request, Response, NextFunction } from "express-serve-static-core";
import express from "express";
import path from "path";
import { indexController } from "./controllers/indexController";
import publishersRoute from "./routes/publishers";
import genresRoute from "./routes/genres";
import gamesRoute from "./routes/games";
import { extractFieldsAndImage } from "./helpers/extractFields";
import { Options } from "formidable";
const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views/"));

app.post("*", parseData);

async function parseData(req: Request, res: Response, next: NextFunction) {
  const defaultFileOptions: Options = {
    maxFileSize: 2 * 1024 * 1024,
    maxFiles: 1,
  };
  const isUpdating = req.originalUrl.match(/update/);

  if (isUpdating) {
    defaultFileOptions.allowEmptyFiles = true;
    defaultFileOptions.minFileSize = 0;
  }
  const [fields, imgFile, imgBuf] = await extractFieldsAndImage<
    "name" | "publisher" | "genres"
  >(req, defaultFileOptions);

  req.body = fields;
  req.imgFile = imgFile;
  req.imgBuf = imgBuf;
  next();
}

const port = process.env.PORT || 3000;

app.use("/games", gamesRoute);
app.use("/genres", genresRoute);
app.use("/publishers", publishersRoute);
app.get("/", indexController.get);
app.post("/", indexController.post);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
