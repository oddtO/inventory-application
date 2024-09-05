import express from "express";
import { gamesController } from "../controllers/gamesController";

const gamesRoute = express.Router();

gamesRoute.get("/", gamesController.get);
gamesRoute.get("/new", gamesController.getNewGameForm);
gamesRoute.post("/new", gamesController.postNewGameForm);
gamesRoute.get("/update/:id", gamesController.getUpdateGameForm);
gamesRoute.post("/update/:id", gamesController.postUpdateGameForm);
gamesRoute.post("/delete/:id", gamesController.postDeleteGame);
export default gamesRoute;
