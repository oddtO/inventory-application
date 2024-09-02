import express from "express";
import { gamesController } from "../controllers/gamesController";

const gamesRoute = express.Router();

gamesRoute.get("/", gamesController.get);
gamesRoute.get("/new", gamesController.getNewGameForm);
gamesRoute.post("/new", gamesController.postNewGameForm);

export default gamesRoute;
