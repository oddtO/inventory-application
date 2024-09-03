import express from "express";
import { genresController } from "../controllers/genresController";
const genresRoute = express.Router();

genresRoute.get("/", genresController.get);
genresRoute.get("/new", genresController.getNewGenreForm);
genresRoute.post("/new", genresController.postNewGenreForm);
genresRoute.get("/update/:id", genresController.getUpdateGenreForm);
genresRoute.post("/update/:id", genresController.postUpdateGenreForm);

export default genresRoute;
